OC.L10N.register(
    "cookbook",
    {
    "No image with the matching MIME type was found on the server." : "На северу није пронађена слика са одговарајућим MIME типом.",
    "Recipe with ID %d was not found in database." : "Рецепт са ID %d се не налази у бази података.",
    "Downloading of a file failed returned the following error message: %s" : "Преузимање фајла није успело, враћена је следећа грешка: %s",
    "No content encoding was detected in the content." : "У садржају није детектовано никакво кодирање садржаја.",
    "The given image for the recipe %s cannot be parsed. Aborting and skipping it." : "Слика наведена за рецепт %s не може да се парсира. Прекида се и прескаче.",
    "No valid recipe was left after heuristics of recipe %s." : "Није преостао важећи рецепт након хеуристике за рецепт %s.",
    "Heuristics failed for image extraction of recipe %s." : "Хеуристика није успела да издвоји слику рецепта %s.",
    "Could not guess image URL as no recipe URL was found." : "URL слике није могао да се погоди јер није пронађен ниједан URL рецепта.",
    "Could not guess image URL scheme from recipe URL %s" : "Схема URL слике није могла да се погоди из URL рецепта %s",
    "Could not parse recipe ingredients. It is no array." : "Није успело парсирање састојака рецепта. То није низ.",
    "Could not parse recipe instructions as they are no array." : "Није успело парсирање упутства рецепта јер нису низ.",
    "Cannot parse recipe: Unknown object found during flattening of instructions." : "Рецепр не може да се парсира: пронађен је непознати објекат током сравњивања упутстава.",
    "Did not find any p or li entries in the raw string of the instructions." : "У сировом стрингу упутстава нису пронаћене никакве p или li ставке.",
    "Could not parse the keywords for recipe {recipe}." : "Кључне речи за рецепт {recipe} не могу да се парсирају.",
    "Could not parse the nutrition information successfully for recipe {name}." : "Информације о нутритивној вредности рецепта {name} не могу успешно да се парсирају.",
    "Using heuristics to parse the \"recipeYield\" field representing the number of servings of recipe {name}." : "Користи се хеуристика за парсирање поља „recipeYield” које представља број порција рецепта {name}.",
    "_Only a single number was found in the \"recipeYield\" field. Using it as number of servings._::_There are %n numbers found in the \"recipeYield\" field. Using the highest number found as number of servings._" : ["Пронађен је само један број у „recipeYield” пољу. Користи се као број порција.","Пронађена су %n броја у „recipeYield” пољу. Као број порција се користи највећи пронађен.","Пронађено је %n бројева у „recipeYield” пољу. Као број порција се користи највећи пронађен."],
    "Could not parse \"recipeYield\" field. Falling back to 1 serving." : "Поље „recipeYield” није могло да се парсира. Користи се 1 порција.",
    "Could not parse recipe tools. Expected array or string." : "Опрема за рецепт не може да се парсира. Очекује се низ или стринг.",
    "Could not find recipe in HTML code." : "У HTML коду није пронађен рецепт.",
    "JSON cannot be decoded." : "JSON не може да се декодује.",
    "No recipe was found." : "Није пронађен рецепт.",
    "Parsing of HTML failed." : "Није успело парсирање HTML..",
    "Unsupported error level during parsing of XML output." : "Неподржани ниво грешке током парсирања XML излаза.",
    "_Warning %u occurred while parsing %s._::_Warning %u occurred %n times while parsing %s._" : ["Догодило се упозорење %u током парсирања %s.","Упозорење %u се догодило %n пута током парсирања %s.","Упозорење %u се догодило %n пута током парсирања %s."],
    "_Error %u occurred while parsing %s._::_Error %u occurred %n times while parsing %s._" : ["Догодила се грешка %u током парсирања %s.","Грешка %u се догодила %n пута током парсирања %s.","Грешка%u се догодила %n пута током парсирања %s."],
    "_Fatal error %u occurred while parsing %s._::_Fatal error %u occurred %n times while parsing %s._" : ["Догодила се фатална грешка %u током парсирања %s.","Фатална грешка %u се догодила %n пута током парсирања %s.","Фатална грешка%u се догодила %n пута током парсирања %s."],
    "First time it occurred in line %u and column %u" : "Први пут се десила у линији %u и колони %u",
    "Could not parse duration {duration}" : "Потребно време {duration} није могло да се парсира",
    "The recipe has already an image file. Cannot create a new one." : "Рецепт већ има фајл слике. Не може да се креира нови.",
    "There is no primary image for the recipe present." : "Није присутна примарна слика за рецепт.",
    "Cannot parse non-POST multipart encoding. This is a bug." : "Не може да се парсира не-POST вишеделно кодирање. Ово је баг.",
    "Cannot detect type of transmitted data. This is a bug, please report it." : "Тип емитованих података не може да се детектује. Ово је баг, молимо вас да га пријавите.",
    "Invalid URL-encoded string found. Please report a bug." : "Пронађен је неисправан URL-кодирани стринг. Молимо вас да пријавите баг.",
    "The user is not logged in. No user configuration can be obtained." : "Корисник није пријављен. Не може да се добави конфигурација корисника.",
    "Recipes" : "Рецепти",
    "The user folder cannot be created due to missing permissions." : "Фолдер корисника не може да се креира јер нема дозвола.",
    "The configured user folder is a file." : "Подешени кориснички фолдер је фајл.",
    "User cannot create recipe folder" : "Корисник не може да креира фолдер са рецептима",
    "in %s" : "за %s",
    "The JSON file in the folder with ID %d does not have a valid name." : "JSON фајл у фолдеру са ID %d нема исправно име.",
    "Could not parse URL" : "URL не може да се парсира",
    "Exception while downloading recipe from %s." : "Изузетак током преузимања рецепта са %s.",
    "Download from %s failed as HTTP status code %d is not in expected range." : "Није успело преузимање са %s јер HTTP статусни кôд %d није у очекиваном опсегу.",
    "Could not find a valid encoding when parsing %s." : "Током парсирања %s није пронађено исправно кодирање.",
    "No parser found for the given import." : "За дати увоз не може да се пронађе одговарајући парсер.",
    "No recipe name was given. A unique name is required to store the recipe." : "Није дато име рецепта. Да би се рецепт сачувао, потребно је јединствено име.",
    "Another recipe with that name already exists" : "Рецепт са тим именом већ постоји",
    "No recipe data found. This is a bug" : "Нису пронађени подаци рецепта. Ово је баг",
    "Recipe with ID %d not found." : "Није пронађен рецепт са ID %d.",
    "Image size \"%s\" is not recognized." : "Не препознаје се величина слике „%s”.",
    "The full-sized image is not a thumbnail." : "Слика пуне величине није сличица.",
    "The thumbnail type %d is not known." : "Тип сличице %d се не препознаје.",
    "Cookbook" : "Кувар",
    "An integrated cookbook using schema.org JSON files as recipes" : "Интегрисани кувар који користи schema.org JSON фајлове као рецепте",
    "A library for all your recipes. It uses JSON files following the schema.org recipe format. To add a recipe to the collection, you can paste in the URL of the recipe, and the provided web page will be parsed and downloaded to whichever folder you specify in the app settings." : "Библиотека за све Ваше рецепте. Користи JSON фајлове који прате schema.org формат рецепата. Да додате рецепт у збирку, налепите адресу рецепта, и жељена веб страна ће бити рашчлањена и  преузета у коју год фасциклу да се сте одредили у подешавањима.",
    "Editing recipe" : "Уређивање рецепта",
    "Viewing recipe" : "Преглед рецепта",
    "All recipes" : "Сви рецепти",
    "None" : "Ништа",
    "Loading app" : "Учитавање апликације",
    "Loading recipe" : "Учитавам рецепт",
    "Recipe not found" : "Рецепт није нађен",
    "Page not found" : "Страна није нађена",
    "Creating new recipe" : "Креирање новог рецепта",
    "Edit" : "Измени",
    "Save" : "Сачувај",
    "Search" : "Претрага",
    "Reload recipe" : "Поново учитај рецепт",
    "Abort editing" : "Прекини уређивање",
    "Print recipe" : "Одштампај рецепт",
    "Delete recipe" : "Обриши рецепт",
    "Filter" : "Филтер",
    "Category" : "Категорија",
    "Recipe name" : "Име рецепта",
    "Tags" : "Ознаке",
    "Search for recipes" : "Тражи рецепте",
    "Are you sure you want to delete this recipe?" : "Да ли сте сигурни да желите да обришете овај рецепт?",
    "Delete failed" : "Брисање није успело",
    "Cannot access recipe folder." : "Не може да се приступи фолдеру са рецептима.",
    "You are logged in with a guest account. Therefore, you are not allowed to generate arbitrary files and folders on this Nextcloud instance. To be able to use the Cookbook app as a guest, you need to specify a folder where all recipes are stored. You will need write permission to this folder." : "Пријављени сте на налог госта. Стога вам није дозвољено да креирате произвољне фајлове и фолдере на овој Nextcloud инстанци. Да бисте могли да користите апликацију Кувар као гост, морате да наведете фолдер у којем су смештени сви рецепти. Биће вам потребна права уписа у тај фолдер.",
    "Select recipe folder" : "Изаберите фолдер за рецепте",
    "Path to your recipe collection" : "Путања ка Вашој збирци рецепата",
    "Create recipe" : "Направи рецепт",
    "Uncategorized recipes" : "Рецепти без категорије",
    "Categories" : "Категорије",
    "Rename" : "Преименуј",
    "Enter new category name" : "Унесите назив нове категорије",
    "Cookbook settings" : "Подешавања кувара",
    "Download recipe from URL" : "Преузми рецепт са адресе",
    "Failed to load category {category} recipes" : "Није успело учитавање категорије {category} рецепата",
    "The server reported an error. Please check." : "Сервер је пријавио грешку. Молимо вас да проверите.",
    "Could not query the server. This might be a network problem." : "Упит не може да се пошаље серверу. Ово може бити проблем са мрежом.",
    "Loading category recipes …" : "Учитавање рецепата у категорији ...",
    "Failed to fetch categories" : "Грешка при дохватању категорија",
    "Enter URL or select from your Nextcloud instance on the right" : "Унесите URL или изаберите из своје Nextcloud инстанце са десне стране",
    "Pick a local image" : "Одаберите локалну слику",
    "Path to your recipe image" : "Путања до слике рецепта",
    "Move entry up" : "Помери ставку навише",
    "Move entry down" : "Помери ставку наниже",
    "Insert entry above" : "Уметни ставку изнад",
    "Delete entry" : "Обриши ставку",
    "Add" : "Додај",
    "Close" : "Затвори",
    "The page was not found" : "Страна није нађена",
    "Name" : "Име",
    "Description" : "Опис",
    "URL" : "Адреса",
    "Image" : "Слика",
    "Preparation time (hours:minutes)" : "Време припреме (сати:минута)",
    "Cooking time (hours:minutes)" : "Време кувања (сати:минута)",
    "Total time (hours:minutes)" : "Укупно време (сати:минута)",
    "Choose category" : "Изаберите категорију",
    "Keywords" : "Кључне речи",
    "Choose keywords" : "Изаберите кључне речи",
    "Servings" : "Порција",
    "Toggle if the number of servings is present" : "Укључи/искључи ако је присутан број порција",
    "Nutrition Information" : "Нутритивне информације",
    "Pick option" : "Изаберите опцију",
    "Tools" : "Алати",
    "Ingredients" : "Састојци",
    "Instructions" : "Упутства",
    "You have unsaved changes! Do you still want to leave?" : "Имате несачуване измене! Да ли још увек желите да напустите?",
    "Calories" : "Калорије",
    "E.g.: 450 kcal (amount & unit)" : "Нпр.: 450 kcal (количина и јединица)",
    "Carbohydrate content" : "Садржај угљених хидрата",
    "E.g.: 2 g (amount & unit)" : "Нпр.: 2 g (количина и јединица)",
    "Cholesterol content" : "Садржај холестерола",
    "Fat content" : "Садржај масти",
    "Fiber content" : "Садржај влакана",
    "Protein content" : "Садржај протеина",
    "Saturated-fat content" : "Садржај засићених масти",
    "Serving size" : "Величина порције",
    "Enter serving size (volume or mass)" : "Унесите величину порције (запремина или маса)",
    "Sodium content" : "Садржај натријума",
    "Sugar content" : "Садржај шећера",
    "Trans-fat content" : "Садржај трансмасти",
    "Unsaturated-fat content" : "Садржај незасићених масти",
    "Failed to fetch keywords" : "Није успело добављање кључних речи",
    "Loading recipe failed" : "Грешка приликом учитавања рецепта",
    "Unknown answer returned from server. See logs." : "Сервер је вратио непознат одговор. Погледајте дневнике.",
    "No answer for request was received." : "Није примљен одговор на захтев",
    "Could not start request to save recipe." : "Није могао да се започне захтев за чување рецепта.",
    "Recipe image" : "Слика рецепта",
    "Select order" : "Изаберите редослед",
    "No recipes created or imported." : "Није креиран или увезен ниједан рецепт.",
    "To get started, you may use the text box in the left navigation bar to import a new recipe. Click below to create a recipe from scratch." : "Да бисте почели, можете да употребите текст поље у левој навигациониј траци да увезете нови рецепт. Кликлните испод да креирате нови празан рецепт.",
    "No recipes" : "Нема рецепата",
    "No recipes matching the selected category found." : "Није пронађен ниједан рецепр који задовољава изабрану категорију.",
    "Try selecting a category from the left navigation bar." : "Покушајте да изаберете категорију из леве навигационе траке.",
    "Creation date" : "Датум креирања",
    "Modification date" : "Датум измене",
    "Toggle keyword" : "Укључи/искључи кључну реч",
    "Keyword not contained in visible recipes" : "Кључна реч се не садржи у видљивим рецептима",
    "Toggle keyword area size" : "Пребаци величину простора кључне речи",
    "Order keywords by number of recipes" : "Поређај кључне речи по броју рецепата",
    "Order keywords alphabetically" : "Поређај кључне речи по абецеди",
    "Cooking time is up!" : "Време за кување!",
    "Search recipes with this keyword" : "Претражи рецепте са овом кључном речи",
    "Date created" : "Датум креирања",
    "Last modified" : "По времену последње измене",
    "Preparation time (H:MM)" : "Време припреме (Ч:ММ)",
    "Cooking time (H:MM)" : "Време кувања (Ч:ММ)",
    "Total time (H:MM)" : "Укупно време (Ч:ММ)",
    "Serving Size" : "Величина порције",
    "Energy" : "Енергија",
    "Sugar" : "Шећер",
    "Carbohydrate" : "Угљени хидрати",
    "Cholesterol" : "Холестерол",
    "Fiber" : "Влакна",
    "Protein" : "Протеини",
    "Sodium" : "Натријум",
    "Fat total" : "Укупне масти",
    "Saturated Fat" : "Засићене масти",
    "Unsaturated Fat" : "Незасићене масти",
    "Trans Fat" : "Транс масти",
    "Source" : "Извор",
    "Copy ingredients" : "Копирај састојке",
    "The ingredient cannot be recalculated due to incorrect syntax. Please change it to this syntax: amount unit ingredient. Examples: 200 g carrots or 1 pinch of salt" : "Услед неисправне синтаксе састојак не може понова да се прорачуна. Молимо вас да га промените на следећу синтаксу: количина јединица састојак. Примери: 200 g шаргарепа или 1 прстохват соли",
    "Loading…" : "Учитавам…",
    "Failed to load recipes with keywords: {tags}" : "Није успело учитавање рецепата са кључним речима: {tags}",
    "Failed to load search results" : "Грешка приликом учитавања резултата претраге",
    "Recipe folder" : "Фасцикла са рецептима",
    "Please pick a folder" : "Одаберите фасциклу",
    "Recipe display settings" : "Подешавања приказа рецепта",
    "Info blocks" : "Инфо блокови",
    "Frontend debug settings" : "Подешавања отклањања грешака предњег приказа",
    "Rescan library" : "Поновно скенирај библиотеку",
    "Update interval in minutes" : "Време ажурирања у минутима",
    "Print image with recipe" : "Штампај и слику уз рецепт",
    "Show keyword cloud in recipe lists" : "Прикажи облак кључних речи у листи рецепата",
    "Control which blocks of information are shown in the recipe view. If you do not use some features and find them distracting, you may hide them." : "Контролише који се блокови информација приказују у погледу рецепта. Ако не користите неке могућности и само вам сметају, можете да их сакријете.",
    "Preparation time" : "Време припреме",
    "Cooking time" : "Време кувања",
    "Total time" : "Укупно време",
    "Nutrition information" : "Нутритивне информације",
    "This allows to temporarily enable logging in the browser console in case of problems. You will not need these settings by default." : "Овим можете привремено да укључите логовање у конзолу приказивача када постоје проблеми. У општем случају вам неће бити потребна ова подешавања.",
    "Could not set preference for image printing" : "Не могу да поставим поставке за штампање слика",
    "Could not set recipe update interval to {interval}" : "Не могу да постави време ажурирања на {interval}",
    "Could not save visible info blocks" : "Није успело чување видљивих инфо блокова",
    "Could not set recipe folder to {path}" : "Не могу да поставим фасциклу са рецептима на {path}",
    "Dismiss" : "Уклони",
    "Cancel" : "Поништи",
    "OK" : "У реду"
},
"nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);");
