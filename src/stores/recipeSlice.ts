import { StateCreator } from 'zustand';
import { getCategories, getRecipeById, getRecipes } from '../services/RecipeService';
import type { Categories, Drinks, Drink, SearchFilter, Recipe } from '../types';
import { FavoritesSliceType } from './favoritesSlice';

export type RecipesSliceType = {
	categories: Categories;
	drinks: Drinks;
	selectedRecipe: Recipe;
	modal: boolean;
	fetchCategories: () => Promise<void>;
	searchRecipes: (SearchFilter: SearchFilter) => Promise<void>;
	selectRecipe: (id: Drink['idDrink']) => Promise<void>;
	closeModal: () => void;
};

// el código despues del & es para unir los Slice
export const createRecipesSlice: StateCreator<RecipesSliceType & FavoritesSliceType, [], [], RecipesSliceType> = (
	set
) => ({
	categories: { drinks: [] },
	drinks: {
		drinks: [],
	},
	selectedRecipe: {} as Recipe,
	modal: false,
	fetchCategories: async () => {
		const categories = await getCategories();
		set({
			categories: categories,
		});
	},
	searchRecipes: async (filters) => {
		const drinks = await getRecipes(filters);
		set({
			drinks: drinks,
		});
	},
	selectRecipe: async (id) => {
		const selectedRecipe = await getRecipeById(id);
		set({
			selectedRecipe: selectedRecipe,
			modal: true,
		});
	},
	closeModal: () => {
		set({
			modal: false,
			selectedRecipe: {} as Recipe,
		});
	},
});
