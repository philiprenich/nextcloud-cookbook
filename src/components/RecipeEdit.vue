<template>
    <div class="wrapper">
        <div v-if="isLoading || store.loadingRecipe" class="loading-indicator">
            <LoadingIndicator :size="40" :delay="800" />
        </div>
        <div v-else>
            <div class="overlay" :class="{ hidden: !overlayVisible }" />
            <EditInputField
                v-model="recipe['name']"
                :field-type="'text'"
                :field-label="t('cookbook', 'Name')"
            />
            <EditInputField
                v-model="recipe['description']"
                :field-type="'markdown'"
                :field-label="t('cookbook', 'Description')"
                :suggestion-options="allRecipeOptions"
            />
            <EditInputField
                v-model="recipe['url']"
                :field-type="'url'"
                :field-label="t('cookbook', 'URL')"
            />
            <EditImageField
                v-model="recipe['image']"
                :field-label="t('cookbook', 'Image')"
            />
            <EditTimeField
                v-model="prepTime"
                :field-label="
                    t('cookbook', 'Preparation time (hours:minutes:seconds)')
                "
            />
            <EditTimeField
                v-model="cookTime"
                :field-label="
                    t('cookbook', 'Cooking time (hours:minutes:seconds)')
                "
            />
            <EditTimeField
                v-model="totalTime"
                :field-label="
                    t('cookbook', 'Total time (hours:minutes:seconds)')
                "
            />
            <EditMultiselect
                v-model="recipe['recipeCategory']"
                :field-label="t('cookbook', 'Category')"
                :placeholder="t('cookbook', 'Choose category')"
                :options="allCategories"
                :taggable="true"
                :multiple="false"
                :loading="isFetchingCategories"
                @tag="addCategory"
            />
            <EditMultiselect
                v-model="selectedKeywords"
                :field-label="t('cookbook', 'Keywords')"
                :placeholder="t('cookbook', 'Choose keywords')"
                :options="allKeywords"
                :taggable="true"
                :multiple="true"
                :tag-width="60"
                :loading="isFetchingKeywords"
                @tag="addKeyword"
            />
            <EditInputField
                :value="String(recipe['recipeYield'])"
                :field-type="'number'"
                :field-label="t('cookbook', 'Servings')"
                :hide="!showRecipeYield"
                @input="recipe['recipeYield'] = Number($event)"
            >
                <NcActions>
                    <NcActionButton
                        class="btn-enable-recipe-yield"
                        :aria-label="
                            // prettier-ignore
                            t('cookbook', 'Toggle if the number of servings is present')
                        "
                        @click="toggleShowRecipeYield"
                    >
                        <template #icon><numeric-icon :size="20" /></template>
                    </NcActionButton>
                </NcActions>
            </EditInputField>
            <EditMultiselectInputGroup
                v-model="recipe['nutrition']"
                :field-label="t('cookbook', 'Nutrition Information')"
                :options="availableNutritionFields"
                :label-select-placeholder="t('cookbook', 'Pick option')"
            />
            <EditInputGroup
                v-model="recipe['tool']"
                :field-name="'tool'"
                :field-type="'text'"
                :field-label="t('cookbook', 'Tools')"
                :create-fields-on-newlines="true"
                :suggestion-options="allRecipeOptions"
            />
            <EditInputGroup
                v-model="recipe['recipeIngredient']"
                :field-name="'recipeIngredient'"
                :field-type="'text'"
                :field-label="t('cookbook', 'Ingredients')"
                :create-fields-on-newlines="true"
                :suggestion-options="allRecipeOptions"
            />
            <EditInputGroup
                v-model="recipe['recipeInstructions']"
                :field-name="'recipeInstructions'"
                :field-type="'textarea'"
                :field-label="t('cookbook', 'Instructions')"
                :create-fields-on-newlines="true"
                :show-step-number="true"
                :suggestion-options="allRecipeOptions"
            />
            <div class="cookbook-footer">
                <button class="button" @click="save()">
                    <span
                        :class="
                            $store.state.savingRecipe
                                ? 'icon-loading-small'
                                : 'icon-checkmark'
                        "
                    ></span>
                    {{ t('cookbook', 'Save') }}
                </button>
            </div>
        </div>
        <!-- Recipe editor container -->
    </div>
</template>

<script setup>
import {
    computed,
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';

import {
    onBeforeRouteLeave,
    onBeforeRouteUpdate,
    useRoute,
} from 'vue-router/composables';

import { NcActions, NcActionButton } from '@nextcloud/vue';

import api from 'cookbook/js/api-interface';
import helpers from 'cookbook/js/helper';
import NumericIcon from 'icons/Numeric.vue';
import {
    showSimpleAlertModal,
    showSimpleConfirmModal,
} from 'cookbook/js/modals';

import EditImageField from './FormComponents/EditImageField.vue';
import EditInputField from './FormComponents/EditInputField.vue';
import EditInputGroup from './FormComponents/EditInputGroup.vue';
import EditMultiselect from './FormComponents/EditMultiselect.vue';
import EditMultiselectInputGroup from './FormComponents/EditMultiselectInputGroup.vue';
import EditTimeField from './FormComponents/EditTimeField.vue';
import LoadingIndicator from './Utilities/LoadingIndicator.vue';

import { useStore } from '../store';
import emitter from '../bus';

const log = getCurrentInstance().proxy.$log;
const route = useRoute();
const store = useStore();

// prettier-ignore
const CONFIRM_MSG = t('cookbook', 'You have unsaved changes! Do you still want to leave?');

// ===================
// Props
// ===================
defineProps({
    id: {
        type: String,
        default: '',
    },
});

// ===================
// Reactive properties
// ===================

/**
 * @type {import('vue').Ref<boolean>}
 */
const isLoading = ref(false);
// Initialize the recipe schema, otherwise v-models in child components may not work
const recipe = ref({
    id: 0,
    name: '',
    description: '',
    url: '',
    image: '',
    prepTime: '',
    cookTime: '',
    totalTime: '',
    recipeCategory: '',
    keywords: '',
    recipeYield: '',
    tool: [],
    recipeIngredient: [],
    recipeInstructions: [],
    nutrition: {},
});

// ==========================
// These are helper variables
/**
 * Changes have been made to the initial values of the form
 * @type {import('vue').Ref<boolean>}
 */
const formDirty = ref(false);
/**
 * the save button has been clicked
 * @type {import('vue').Ref<boolean>}
 */
const savingRecipe = ref(false);
const prepTime = ref({ time: [0, 0, 0], paddedTime: '' });
const cookTime = ref({ time: [0, 0, 0], paddedTime: '' });
const totalTime = ref({ time: [0, 0, 0], paddedTime: '' });
const allCategories = ref([]);
/**
 * @type {import('vue').Ref<boolean>}
 */
const isFetchingCategories = ref(true);
/**
 * @type {import('vue').Ref<boolean>}
 */
const isFetchingKeywords = ref(true);
/**
 * @type {import('vue').Ref<Array>}
 */
const allKeywords = ref([]);
/**
 * @type {import('vue').Ref<Array>}
 */
const selectedKeywords = ref([]);
/**
 * @type {import('vue').Ref<Array>}
 */
const allRecipes = ref([]);
/**
 * @type {import('vue').Ref<Array>}
 */
const availableNutritionFields = ref([
    {
        key: 'calories',
        label: t('cookbook', 'Calories'),
        // prettier-ignore
        placeholder: t('cookbook','E.g.: 450 kcal (amount & unit)'),
    },
    {
        key: 'carbohydrateContent',
        label: t('cookbook', 'Carbohydrate content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'cholesterolContent',
        label: t('cookbook', 'Cholesterol content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'fatContent',
        label: t('cookbook', 'Fat content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'fiberContent',
        label: t('cookbook', 'Fiber content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'proteinContent',
        label: t('cookbook', 'Protein content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'saturatedFatContent',
        label: t('cookbook', 'Saturated-fat content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'servingSize',
        label: t('cookbook', 'Serving size'),
        // prettier-ignore
        placeholder: t('cookbook','Enter serving size (volume or mass)'),
    },
    {
        key: 'sodiumContent',
        label: t('cookbook', 'Sodium content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'sugarContent',
        label: t('cookbook', 'Sugar content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'transFatContent',
        label: t('cookbook', 'Trans-fat content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
    {
        key: 'unsaturatedFatContent',
        label: t('cookbook', 'Unsaturated-fat content'),
        placeholder: t('cookbook', 'E.g.: 2 g (amount & unit)'),
    },
]);
/**
 * @type {import('vue').Ref<boolean>}
 */
const loadingRecipeReferences = ref(true);
/**
 * @type {import('vue').Ref<boolean>}
 */
const showRecipeYield = ref(true);

// ===================
// Computed properties
// ===================
const allRecipeOptions = computed(() =>
    allRecipes.value.map((r) => ({
        recipe_id: r.recipe_id,
        title: `${r.recipe_id}: ${r.name}`,
    })),
);
const overlayVisible = computed(
    () =>
        store.state.loadingRecipe ||
        store.state.reloadingRecipe ||
        (store.state.categoryUpdating &&
            store.state.categoryUpdating === recipe.value.recipeCategory),
);
const recipeWithCorrectedYield = computed(() => {
    const r = recipe.value;
    if (!showRecipeYield.value) {
        r.recipeYield = null;
    }
    return r;
});

// Whether navigation would lose data, etc.
const isNavigationDangerous = computed(
    () => !savingRecipe.value && formDirty.value,
);

// ===================
// Watchers
// ===================

watch(
    () => prepTime.value,
    () => {
        recipe.value.prepTime = prepTime.value.paddedTime;
    },
    { deep: true },
);
watch(
    () => cookTime.value,
    () => {
        recipe.value.cookTime = cookTime.value.paddedTime;
    },
    { deep: true },
);
watch(
    () => totalTime.value,
    () => {
        recipe.value.totalTime = totalTime.value.paddedTime;
    },
    { deep: true },
);
watch(
    () => selectedKeywords.value,
    () => {
        // convert keyword array to comma-separated string
        recipe.value.keywords = selectedKeywords.value.join();
    },
    { deep: true },
);
watch(
    () => recipe.value,
    () => {
        formDirty.value = true;
    },
    { deep: true },
);

// ===================
// Methods
// ===================

/**
 * Add newly created category and set as selected.
 */
const addCategory = (newCategory) => {
    allCategories.value.push(newCategory);
    recipe.value.recipeCategory = newCategory;
};
/**
 * Add newly created keyword.
 */
const addKeyword = (newKeyword) => {
    allKeywords.value.push(newKeyword);
    selectedKeywords.value.push(newKeyword);
};
const beforeWindowUnload = (e) => {
    // We cannot use our fancy modal here because `beforeunload` does not wait for promises to resolve
    // However, we can avoid `window.confirm` by using `e.returnValue`
    if (isNavigationDangerous.value) {
        // Cancel the window unload event
        e.preventDefault();
        e.returnValue = CONFIRM_MSG;
    }
};
/**
 * Fetch and display recipe categories
 */
const fetchCategories = async () => {
    try {
        const response = await api.categories.getAll();
        const json = response.data || [];
        allCategories.value = [];
        for (let i = 0; i < json.length; i++) {
            if (json[i].name !== '*') {
                allCategories.value.push(json[i].name);
            }
        }
        isFetchingCategories.value = false;
    } catch (e) {
        await showSimpleAlertModal(t('cookbook', 'Failed to fetch categories'));
        if (e && e instanceof Error) {
            throw e;
        }
    }
};
/**
 * Fetch and display recipe keywords
 */
const fetchKeywords = async () => {
    try {
        const response = await api.keywords.getAll();
        const json = response.data || [];
        if (json) {
            allKeywords.value = [];
            for (let i = 0; i < json.length; i++) {
                if (json[i].name !== '*') {
                    allKeywords.value.push(json[i].name);
                }
            }
        }
        isFetchingKeywords.value = false;
    } catch (e) {
        await showSimpleAlertModal(t('cookbook', 'Failed to fetch keywords'));
        if (e && e instanceof Error) {
            throw e;
        }
    }
};
const save = async () => {
    savingRecipe.value = true;
    store.dispatch('setSavingRecipe', { saving: true });
    const request = (() => {
        if (route.name !== 'recipe-clone' && (route.params.id ?? false)) {
            return store.dispatch('updateRecipe', {
                recipe: recipeWithCorrectedYield.value,
            });
        }
        return store.dispatch('createRecipe', {
            recipe: recipeWithCorrectedYield.value,
        });
    })();

    try {
        const response = await request;
        helpers.goTo(`/recipe/${response.data}`);
    } catch (e) {
        if (e.response) {
            // Non 2xx state returned

            switch (e.response.status) {
                case 409:
                case 422:
                    await showSimpleAlertModal(e.response.data.msg);
                    break;

                default:
                    await showSimpleAlertModal(
                        // prettier-ignore
                        t('cookbook','Unknown answer returned from server. See logs.'),
                    );
                    log.error(e.response);
            }
        } else if (e.request) {
            await showSimpleAlertModal(
                t('cookbook', 'No answer for request was received.'),
            );
            log.error(e);
        } else {
            await showSimpleAlertModal(
                // prettier-ignore
                t('cookbook','Could not start request to save recipe.'),
            );
            log.error(e);
        }
    } finally {
        store.dispatch('setSavingRecipe', {
            saving: false,
        });
        savingRecipe.value = false;
    }
};

const initEmptyRecipe = () => {
    prepTime.value = { time: [0, 0, 0], paddedTime: '' };
    cookTime.value = { time: [0, 0, 0], paddedTime: '' };
    totalTime.value = { time: [0, 0, 0], paddedTime: '' };
    // this.nutrition = {}
    recipe.value = {
        id: 0,
        name: '',
        description: '',
        url: '',
        image: '',
        prepTime: '',
        cookTime: '',
        totalTime: '',
        recipeCategory: '',
        keywords: '',
        recipeYield: '',
        tool: [],
        recipeIngredient: [],
        recipeInstructions: [],
        nutrition: {},
    };
    formDirty.value = false;
    showRecipeYield.value = true;
};

/**
 * Modifies the current recipe's name property to indicate that it is a clone.
 * Resets id to prevent overwriting original recipe.
 */
const initClone = () => {
    // Reset id to prevent overwriting original
    recipe.value.id = 0;

    // Update
    // eslint-disable-next-line no-template-curly-in-string
    recipe.value.name = t('cookbook', 'Clone of {name}', {
        name: recipe.value.name,
    });
};

const setup = async () => {
    fetchCategories();
    fetchKeywords();
    if (route.params.id) {
        // Parse time values
        let timeComps = recipe.value.prepTime
            ? recipe.value.prepTime.match(/PT(\d+?)H(\d+?)M(\d+?)S/)
            : null;
        prepTime.value = {
            time: timeComps
                ? [timeComps[1], timeComps[2], timeComps[3]]
                : [0, 0, 0],
            paddedTime: recipe.value.prepTime,
        };

        timeComps = recipe.value.cookTime
            ? recipe.value.cookTime.match(/PT(\d+?)H(\d+?)M(\d+?)S/)
            : null;
        cookTime.value = {
            time: timeComps
                ? [timeComps[1], timeComps[2], timeComps[3]]
                : [0, 0, 0],
            paddedTime: recipe.value.cookTime,
        };

        timeComps = recipe.value.totalTime
            ? recipe.value.totalTime.match(/PT(\d+?)H(\d+?)M(\d+?)S/)
            : null;

        totalTime.value = {
            time: timeComps
                ? [timeComps[1], timeComps[2], timeComps[3]]
                : [0, 0, 0],
            paddedTime: recipe.value.totalTime,
        };

        selectedKeywords.value = recipe.value.keywords
            .split(',')
            .map((kw) => kw.trim())
            // Remove any empty keywords
            // If the response from the server is just an empty
            // string, split will create an array of a single empty
            // string
            .filter((kw) => kw !== '');

        // fallback if fetching all keywords fails
        selectedKeywords.value.forEach((kw) => {
            if (!allKeywords.value.includes(kw)) {
                allKeywords.value.push(kw);
            }
        });

        // fallback if fetching all categories fails
        if (!allCategories.value.includes(recipe.value.recipeCategory)) {
            allCategories.value.push(recipe.value.recipeCategory);
        }

        if (recipe.value.recipeYield === null) {
            showRecipeYield.value = false;
        } else if (!recipe.value.recipeYield) {
            showRecipeYield.value = false;
            recipe.value.recipeYield = null;
        } else {
            showRecipeYield.value = true;
        }

        // Modify title and update id for clone to indicate difference from original recipe and prevent overwriting
        // original recipe
        if (route.name === 'recipe-clone') {
            initClone();
        }

        // Always set the active page last!
        if (route.name !== 'recipe-clone') {
            store.dispatch('setPage', { page: 'edit' });
        } else {
            store.dispatch('setPage', { page: 'create' });
        }
    } else {
        initEmptyRecipe();
        store.dispatch('setPage', { page: 'create' });
    }
    recipe.value.valueInit = JSON.parse(JSON.stringify(recipe.value));
    await nextTick();
    formDirty.value = false;
};

const loadRecipeData = async () => {
    isLoading.value = true;
    if (!store.state.recipe) {
        // Make the control row show that a recipe is loading
        store.dispatch('setLoadingRecipe', {
            recipe: -1,
        });
    } else if (store.state.recipe.id === parseInt(route.params.id, 10)) {
        // Make the control row show that the recipe is reloading
        store.dispatch('setReloadingRecipe', {
            recipe: route.params.id,
        });
    }
    try {
        const response = await api.recipes.get(route.params.id);

        store.dispatch('setRecipe', { recipe: response.data });
        recipe.value = response.data;
        await setup();
    } catch {
        await showSimpleAlertModal(t('cookbook', 'Loading recipe failed'));
        // Disable loading indicator
        if (store.state.loadingRecipe) {
            store.dispatch('setLoadingRecipe', { recipe: 0 });
        } else if (store.state.reloadingRecipe) {
            store.dispatch('setReloadingRecipe', {
                recipe: 0,
            });
        }
        // Browse to new recipe creation
        helpers.goTo('/recipe/create');
    } finally {
        isLoading.value = false;
    }
};

const toggleShowRecipeYield = () => {
    showRecipeYield.value = !showRecipeYield.value;
    formDirty.value = true;
};

// ===================
// Vue lifecycle
// ===================

onBeforeRouteUpdate((to, from, next) => {
    // beforeRouteUpdate is called when the static route stays the same
    next();

    // Check if we should reload the component content
    if (helpers.shouldReloadContent(from.fullPath, to.fullPath)) {
        setup();
    }
});

/**
 * This is one tricky feature of Vue router. If different paths lead to
 * the same component (such as '/recipe/create' and '/recipe/xxx/edit
 * or /recipe/xxx/edit and /recipe/yyy/edit)', the view will not automatically
 * reload. So we have to check for these conditions and reload manually.
 * This can also be used to confirm that the user wants to leave the page
 * if there are unsaved changes.
 */
onBeforeRouteLeave(async (to, from, next) => {
    // beforeRouteLeave is called when the static route changes.
    // Cancel the navigation, if the form has unsaved edits and the user did not
    // confirm leave. This prevents accidentally losing changes
    if (
        isNavigationDangerous.value &&
        !(await showSimpleConfirmModal(CONFIRM_MSG))
    ) {
        next(false);
    } else {
        // We have to check if the target component stays the same and reload.
        // However, we should not reload if the component changes; otherwise
        // reloaded data may overwrite the data loaded at the target component
        // which will at the very least result in incorrect breadcrumb path!
        next();
    }
    // Check if we should reload the component content
    if (helpers.shouldReloadContent(from.fullPath, to.fullPath)) {
        setup();
    }
});

onMounted(() => {
    log.info('RecipeEdit mounted');
    window.addEventListener('beforeunload', beforeWindowUnload);

    // Store the initial recipe configuration for possible later use
    if (recipe.value.valueInit === null) {
        recipe.value.valueInit = recipe.value;
    }
    // Register save method hook for access from the controls components
    // The event hook must first be destroyed to avoid it from firing multiple
    // times if the same component is loaded again
    emitter.off('saveRecipe');
    emitter.on('saveRecipe', () => {
        save();
    });
    // Register data load method hook for access from the controls components
    emitter.off('reloadRecipeEdit');
    emitter.on('reloadRecipeEdit', () => {
        loadRecipeData();
    });
    emitter.off('categoryRenamed');
    emitter.on('categoryRenamed', (val) => {
        // Update selectable categories
        const idx = allCategories.value.findIndex((c) => c === val[1]);
        if (idx >= 0) {
            // eslint-disable-next-line prefer-destructuring
            allCategories.value[idx] = val[0];
        }
        // Update selected category if the currently selected was renamed
        if (recipe.value.recipeCategory === val[1]) {
            // eslint-disable-next-line prefer-destructuring
            recipe.value.recipeCategory = val[0];
        }
    });
    savingRecipe.value = false;

    // Load data for all recipes to be used in recipe-reference popup suggestions
    api.recipes
        .getAll()
        .then((response) => {
            allRecipes.value = response.data;
        })
        .catch((e) => {
            log.error(e);
        })
        .then(() => {
            // finally
            loadingRecipeReferences.value = false;
        });
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeWindowUnload);
});

// Initially load recipe data if necessary
if (route.params.id) {
    if (store.state.recipe?.id === route.params.id) {
        // Load the recipe from store and make edits to a local copy first
        recipe.value = { ...store.state.recipe };
    } else {
        loadRecipeData();
    }
}
setup();
</script>

<script>
export default {
    // We can check if the user has browsed from the same recipe's view to this
    // edit and save some time by not reloading the recipe data, leading to a
    // more seamless experience.
    // This assumes that the data has not been changed some other way between
    // loading the view component and loading this edit component. If that is
    // the case, the user can always manually reload by clicking the breadcrumb.
    // beforeRouteEnter(to, from, next) {
    //     if (helpers.isSameItemInstance(from.fullPath, to.fullPath)) {
    //         next((vm) => {
    //             vm.setup()
    //         })
    //     } else if (to.params && to.params.id) {
    //         next((vm) => {
    //             console.log(vm)
    //             vm.loadRecipeData()
    //         })
    //     } else {
    //         next((vm) => {
    //             vm.setup()
    //         })
    //     }
    // },
    name: 'RecipeEdit',
};
</script>

<style scoped>
.wrapper {
    width: 100%;
    padding: 1rem;
}

.loading-indicator {
    display: flex;
    justify-content: center;
    padding: 3rem 0;
}

.overlay {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: var(--color-main-background);
    opacity: 0.75;
}

.overlay.hidden {
    display: none;
}

.references-popup {
    position: fixed;
    display: none;
}

.references-popup.visible {
    display: block;
}

.cookbook-footer {
    margin-top: 3.5em;
    text-align: end;
}

.btn-enable-recipe-yield {
    vertical-align: bottom;
}
</style>
