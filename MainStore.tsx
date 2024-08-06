import { createStore } from 'zustand/vanilla';

export type MainState = {
	showCamera: boolean;
	photoTaken: boolean;
	drawerOpen: boolean;
	itemName: string;
	quantity: number;
	aiUpdatedQuantity: boolean;
};

export type MainActions = {
	setShowCamera: (showCamera: boolean) => void;
	setPhotoTaken: (photoTaken: boolean) => void;
	setDrawerOpen: (drawerOpen: boolean) => void;
	setItemName: (itemName: string) => void;
	setQuantity: (quantity: number) => void;
	setAiUpdatedQuantity: (aiUpdatedQuantity: boolean) => void;
};

export type MainStore = MainState & MainActions;

export const defaultInitState: MainState = {
	showCamera: false,
	photoTaken: false,
	drawerOpen: false,
	itemName: '',
	quantity: 1,
	aiUpdatedQuantity: false,
};

export const createMainStore = (initState: MainState = defaultInitState) => {
	return createStore<MainStore>()((set) => ({
		...initState,
		setShowCamera: (showCamera) => set({ showCamera }),
		setPhotoTaken: (photoTaken) => set({ photoTaken }),
		setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
		setItemName: (itemName) => set({ itemName }),
		setQuantity: (quantity) => set({ quantity }),
		setAiUpdatedQuantity: (aiUpdatedQuantity) => set({ aiUpdatedQuantity }),
	}));
};
