#! /bin/bash -e

print_help() {
	cat << EOF
Run the unittests

Possible options:
  --pull
  --create-images
  --create-images-if-needed
  --push-images
  --start-helpers
  --shutdown-helpers
  --setup-environment <BRANCH>
  --drop-environment
  --create-env-dump
  --restore-env-dump
  --drop-dump
  --overwrite-env-dump
  --env-dump-path <PATH>
  --run-tests
  --extract-code-coverage
  --help                            Show this help screen
  
  --prepare <BRANCH>                Prepare the system for running the unit tests. This is a shorthand for
                                      --pull --create-images-if-needed --start-helpers --setup-environment <BRANCH> --create-env-dump
  --run                             Run the unit tests themselves. This is a shorthand for
                                      --restore-env-dump --run-tests --extract-code-coverage
  
  The following environment variables are taken into account:
    INPUT_DB            Defines which database to use for the integration tests. Can be mysql, pgsql or sqlite. Defaults to mysql.
EOF
}

pull_images() {
	echo 'Pulling pre-built images'
	docker-compose pull
}

build_images() {
	echo 'Building the images'
# 	FIXME Do the image building process
	local uid=$(id -u)
	docker-compose build --pull --force-rm --build-arg UID=$uid dut
	docker-compose build --pull --force-rm mysql
}

is_image_exists() {
# 	TODO Further Checks needed?
	lines=$(docker images | awk '$1 == "cookbook_unittesting_dut"' | wc -l)
	test $lines -gt 0
}

push_images() {
# 	FIXME This needs to be implemented
	echo "Not yet implented"
	exit 1
}

create_file_structure() {
	mkdir -p volumes/{mysql,postgres,nextcloud,data,dumps}
}

start_helpers(){
# 	TODO add further hosts for web server
	case "$INPUT_DB" in
		mysql)
			docker-compose up -d mysql
			
			# Wait for service become available
			local i
			for i in `seq 1 20`
			do
				local state=$(docker inspect --format "{{.State.Health.Status}}" cookbook_unittesting_mysql_1)
				
				if [ "$state" = 'healthy' ]; then
					break
				fi
				
				sleep 2.5
			done
			
			if [ $i -eq 20 ]; then
				echo 'Error: Could not connect with mysql service container'
				exit 1
			fi
			;;
		pgsql)
			docker-compose up -d postgres
			
			# Wait for the service to become available
			local i
			for i in `seq 1 10`
			do
				echo '\q' | call_postgres && break || true
				sleep 5
			done
			
			if [ $i -eq 10 ]; then
				echo 'Could not connect with postgres service container'
				exit 1
			fi
			;;
		sqlite)
			;;
		*)
			echo "Unknown database given in INPUT_DB: $INPUT_DB"
			exit 1
			;;
	esac
}

shutdown_helpers(){
	docker-compose down
}

setup_environment(){
	echo "Checking out nextcloud server repository"
	git clone --depth=1 --branch "$ENV_BRANCH" https://github.com/nextcloud/server volumes/nextcloud
	
	echo "Updating the submodules"
	pushd volumes/nextcloud
	git submodule update --init
	popd
	
	echo "Installing Nextcloud server instance"
	case "$INPUT_DB" in
		mysql)
			docker-compose run --rm -T occ \
				maintenance:install \
				--database mysql \
				--database-host mysql \
				--database-name "$MYSQL_DATABASE" \
				--database-user "$MYSQL_USER" \
				--database-pass "$MYSQL_PASSWORD" \
				--admin-user admin \
				--admin-pass admin
			;;
		pgsql)
			docker-compose run --rm -T occ \
				maintenance:install \
				--database pgsql \
				--database-host postgres \
				--database-name "$POSTGRES_DB" \
				--database-user "$POSTGRES_USER" \
				--database-pass "$POSTGRES_PASSWORD" \
				--admin-user admin \
				--admin-pass admin
			;;
		sqlite)
			docker-compose run --rm -T occ \
				maintenance:install \
				--database sqlite \
				--admin-user admin \
				--admin-pass admin
			;;
		*)
			echo "Unknown database: $INPUT_DB"
			exit 1
			;;
	esac
	
	# FIXME Install cookbook plugin
# 	FIXME This needs to be implemented
	echo "Not yet implemented."
	exit 1
}

drop_environment(){
	# Drop all tables
	case "$INPUT_DB" in
		mysql)
			local tables=$(echo "SHOW TABLES;" | call_mysql | tail -n +2)
			if [ -n "$tables" ]; then
				echo "$tables" | sed 's@.*@DROP TABLE \0;@' | call_mysql
			fi
			;;
		pgsql)
			local tables=$(echo "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" | call_postgres | head -n -1 )
			if [ -n "$tables" ]; then
				echo "$tables" | sed 's@.*@DROP TABLE \0;@' | call_postgres
			fi
			;;
	esac
	
	# Remove any data in the volumes
	rm -rf volumes/{data,nextcloud}/{*,.??*}
# 	FIXME This needs to be implemented
}

dump_env_dump() {
	if [ -d "dumps/$ENV_DUMP_PATH" -a "$OVERWRITE_ENV_DUMP" != 'y' ]; then
		echo "Cannot create dump $ENV_DUMP_PATH as it is already existing."
		exit 1
	fi
	
	mkdir -p "dumps/$ENV_DUMP_PATH/"{data,nextcloud,sql}
	
	# Dump data
	echo "Saving data files"
	rsync $RSYNC_PARAMS volumes/data/ "dumps/$ENV_DUMP_PATH/data"
	
	# Dump server files
	echo "Saving server files"
	rsync $RSYNC_PARAMS volumes/nextcloud/ "dumps/$ENV_DUMP_PATH/nextcloud"
	
	# Dump SQL
	case "$INPUT_DB" in
		mysql)
			echo "Dumping MySQL database"
			docker-compose exec -T mysql mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" --add-drop-database --databases "$MYSQL_DATABASE" > "dumps/$ENV_DUMP_PATH/sql/dump.sql"
			;;
		pgsql)
			echo "Dumping Postgres database"
			docker-compose exec -T postgres pg_dump "$POSTGRES_DB" > "dumps/$ENV_DUMP_PATH/sql/dump.sql"
			;;
		sqlite)
			echo "No sqlite dump is generates as it is saved with the regular files."
			;;
		*)
			echo "Unknown database type: $INPUT_DB. Aborting."
			exit 1
			;;
	esac
}

restore_env_dump() {
	if [ ! -d "dumps/$ENV_DUMP_PATH" ]; then
		echo "Dump $ENV_DUMP_PATH was not found. Cannot restore it."
		exit 1
	fi
	
	# Restore data
	echo "Restoring data files"
	rsync $RSYNC_PARAMS "dumps/$ENV_DUMP_PATH/data/" volumes/data/
	
	# Restore server files
	echo "Restoring server files"
	rsync $RSYNC_PARAMS "dumps/$ENV_DUMP_PATH/nextcloud/" volumes/nextcloud/
	
	# Restore DB dump
	case "$INPUT_DB" in
		mysql)
			echo "Restoring MySQL database from dump"
			cat "dumps/$ENV_DUMP_PATH/sql/dump.sql" | docker-compose exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASWORD"
			;;
		pgsql)
			echo "Restoring Postgres database from dump"
			cat "dumps/$ENV_DUMP_PATH/sql/dump.sql" | call_postgres
			;;
		sqlite)
			echo "Restoring of sqlite not required as already covered by data restoring."
			;;
		*)
			echo "Unknown database type: $INPUT_DB. Aborting."
			exit 1
			;;
	esac
}

drop_env_dump() {
	rm -rf "dumps/$ENV_DUMP_PATH"
}

run_tests() {
# 	FIXME This needs to be implemented
	echo "Not yet implemented."
	exit 1
}

function call_mysql() {
	docker-compose exec -T mysql mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"
}

function call_postgres() {
	#docker-compose exec -T postgres psql -t nc_test tester
	docker-compose exec -T postgres psql -U "$POSTGRES_USER" "$POSTGRES_DB"
}

##### Parameters as extracted from the CLI

DOCKER_PULL=n
CREATE_IMAGES=n
CREATE_IMAGES_IF_NEEDED=n
PUSH_IMAGES=n
START_HELPERS=n
SHUTDOWN_HELPERS=n
SETUP_ENVIRONMENT=n
DROP_ENVIRONMENT=n
CREATE_ENV_DUMP=n
RESTORE_ENV_DUMP=n
DROP_ENV_DUMP=n
OVERWRITE_ENV_DUMP=n
RUN_TESTS=n
EXTRACT_CODE_COVERAGE=n

ENV_BRANCH=stable20
ENV_DUMP_PATH=default

MYSQL_DATABASE=nc_test
MYSQL_USER=tester
MYSQL_PASSWORD=tester_pass
MYSQL_ROOT_PASWORD=pass_root

POSTGRES_USER=tester
POSTGRES_PASSWORD=tester_pass
POSTGRES_DB=nc_test

RSYNC_PARAMS="--delete --delete-delay --archive"

##### Extract CLI parameters into internal variables

if [ $# -eq 0 ]; then
	echo "No parameters give. Please specify the operation to be carried out. See $0 --help"
	exit 0
fi

while [ $# -gt 0 ]
do
	case "$1" in
		--help|-h)
			print_help
			exit 0
			;;
		--pull)
			DOCKER_PULL=y
			;;
		--create-images)
			CREATE_IMAGES=y
			;;
		--create-images-if-needed)
			CREATE_IMAGES_IF_NEEDED=y
			;;
		--push-images)
			PUSH_IMAGES=y
			;;
		--start-helpers)
			START_HELPERS=y
			;;
		--shutdown-helpers)
			SHUTDOWN_HELPERS=y
			;;
		--setup-environment)
			SETUP_ENVIRONMENT=y
			ENV_BRANCH="$2"
			shift
			;;
		--drop-environment)
			DROP_ENVIRONMENT=y
			;;
		--create-env-dump)
			CREATE_ENV_DUMP=y
			;;
		--restore-env-dump)
			RESTORE_ENV_DUMP=y
			;;
		--drop-env-dump)
			DROP_ENV_DUMP=y
			;;
		--overwrite-env-dump)
			OVERWRITE_ENV_DUMP=y
			;;
		--env-dump-path)
			ENV_DUMP_PATH="$2"
			shift
			;;
		--run-tests)
			RUN_TESTS=y
			;;
		--extract-code-coverage)
			EXTRACT_CODE_COVERAGE=y
			;;
		--prepare)
			CREATE_IMAGES_IF_NEEDED=y
			START_HELPERS=y
			SETUP_ENVIRONMENT=y
			ENV_BRANCH="$2"
			CREATE_ENV_DUMP=y
			shift
			;;
		--run)
			RESTORE_ENV_DUMP=y
			RUN_TESTS=y
			EXTRACT_CODE_COVERAGE=y
			;;
		*)
			echo "Unknown parameter $1. Exiting."
			print_help
			exit 1
			;;
	esac
	
	shift
done

export PS4='+ $0:$LINENO '
set -x

##### Do some sanity checks

if [ $CREATE_IMAGES = 'y' -a $CREATE_IMAGES_IF_NEEDED = 'y' ]; then
	echo "You have both specified --create-images and --create-images-if-needed. These are exclusive options."
	exit 1
fi

if [ -z "$INPUT_DB" ]; then
	echo "No database configured. Falling back to mysql"
	export INPUT_DB=mysql
fi

if echo "$ENV_DUMP_PATH" | grep ' ' > /dev/null; then
	echo "The dump path '$ENV_DUMP_PATH' contains invalid characters. Please adjust"
	exit 1
fi

##### Start processing the tasks at hand

if [ $DOCKER_PULL = 'y' ]; then
	pull_images
fi

if [ $CREATE_IMAGES = 'y' ]; then
	build_images
fi

if [ $CREATE_IMAGES_IF_NEEDED = 'y' ]; then
	if ! is_image_exists; then
		build_images
	fi
fi

create_file_structure

if [ $START_HELPERS = 'y' ]; then
	start_helpers
fi

if [ $PUSH_IMAGES = 'y' ]; then
	if ! is_image_exists; then
		echo "Cannot push images as it does not exist"
		exit 1
	fi
	push_images
fi

if [ $DROP_ENVIRONMENT = 'y' ]; then
	drop_environment
fi

if [ $SETUP_ENVIRONMENT = 'y' ]; then
	setup_environment
fi

if [ $DROP_ENV_DUMP = 'y' ]; then
	drop_env_dump
fi

if [ $CREATE_ENV_DUMP = 'y' ]; then
	dump_env_dump
fi

if [ $RESTORE_ENV_DUMP = 'y' ]; then
	restore_env_dump
fi

if [ $RUN_TESTS = 'y' ]; then
	run_tests
fi

if [ $SHUTDOWN_HELPERS = 'y' ]; then
	shutdown_helpers
fi

exit 0
#################################################################






set -x

cd $(dirname "$0")

docker-compose up -d mysql postgres

mkdir -p workdir

cd workdir

rm -rf nextcloud

git clone --depth=1 --branch stable20 https://github.com/nextcloud/server nextcloud

# git clone --depth=1 https://github.com/nextcloud/cookbook nextcloud/custom_apps/cookbook

cd ..

echo Dropping databases

function call_mysql() {
	docker-compose exec -T mysql mysql -u tester -ptester_pass nc_test
}
function call_postgres() {
	docker-compose exec -T postgres psql -t nc_test tester
}

echo "SHOW TABLES;" | call_mysql | tail -n +2 | sed 's@.*@DROP TABLE \0;@' | call_mysql
echo "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" | call_postgres | head -n -1 | sed 's@.*@DROP TABLE \0;@' | call_postgres

docker-compose run dut

