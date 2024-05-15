import { StateCreator } from 'zustand';
import { Recipe } from '../types';
import { RecipesSliceType, createRecipesSlice } from './recipeSlice';
import { NotificationSliceType, createNotificationSlice } from './notificationSlice';

export type FavoritesSliceType = {
	favorites: Recipe[];
	handleClickFavorite: (recipe: Recipe) => void;
	favoriteExist: (id: Recipe['idDrink']) => boolean;
	loadFromStorage: () => void;
};

// el código despues del & es para unir los Slice
export const createFavoritesSlice: StateCreator<
	FavoritesSliceType & RecipesSliceType & NotificationSliceType,
	[],
	[],
	FavoritesSliceType
> = (set, get, api) => ({
	favorites: [],
	handleClickFavorite: (recipe) => {
		if (get().favorites.some((favorite) => favorite.idDrink === recipe.idDrink)) {
			set((state) => ({
				favorites: state.favorites.filter((favorite) => favorite.idDrink !== recipe.idDrink),
			}));
			createNotificationSlice(set, get, api).showNotification({ text: 'Se eliminó de favoritos', error: false });
		} else {
			set((state) => ({
				favorites: [...state.favorites, recipe],
			}));
			createNotificationSlice(set, get, api).showNotification({ text: 'Se agregó a favoritos', error: false });
		}
		createRecipesSlice(set, get, api).closeModal();
		localStorage.setItem('favorites', JSON.stringify(get().favorites));
	},
	favoriteExist: (id) => {
		return get().favorites.some((favorite) => favorite.idDrink === id);
	},
	loadFromStorage: () => {
		const storedFavorites = localStorage.getItem('favorites');
		if (storedFavorites) {
			set({
				favorites: JSON.parse(storedFavorites),
			});
		}
	},
});
