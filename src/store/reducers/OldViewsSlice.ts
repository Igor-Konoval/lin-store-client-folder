
import {IProductsActionCreator} from "../../models/IProductsActionCreator";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface IOldViewsSlice {
    products: IProductsActionCreator[],
    isLoad: boolean,
    error: string
}

const initialState: IOldViewsSlice = {
    products: [],
    isLoad: false,
    error: ''
}

export const OldViewsSlice = createSlice({
    name: "OldViews",
    initialState,
    reducers: {
        productFetching: (state: IOldViewsSlice) => {
            state.isLoad = true;
        },
        productSuccess: (state: IOldViewsSlice, action: PayloadAction<IProductsActionCreator[]>) => {
            state.isLoad = false;
            state.products = action.payload;
        },
        addProduct: (state: IOldViewsSlice, action: PayloadAction<IProductsActionCreator>) => {
            state.products.unshift(action.payload);
        },
        productError: (state: IOldViewsSlice, action: PayloadAction<string>) => {
            state.isLoad = false;
            state.error = action.payload;
        },
        updateSaveList: (state: IOldViewsSlice, action: PayloadAction<IProductsActionCreator>) => {
            state.products = state.products.filter( product => product._id !== action.payload._id );
            state.products.unshift( action.payload );
        }
    }
})