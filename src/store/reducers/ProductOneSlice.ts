import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IProductsActionCreator} from "../../models/IProductsActionCreator";

interface ProductState {
    products: IProductsActionCreator,
    error: string,
    isLoading: boolean
}

const initialState: ProductState = {
    products: {} as IProductsActionCreator,
    error: '',
    isLoading: false
}

export const ProductOneSlice = createSlice({
    name: 'productOne',
    initialState,
    reducers: {
        productOneFetching: (state: ProductState) => {
            state.isLoading = true;
        },

        productOneSuccess: (state: ProductState, action: PayloadAction<IProductsActionCreator>) => {
            state.products = action.payload;
            state.isLoading = false;
            state.error = '';
        },

        productOneError: (state: ProductState, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false
        }

    }
})


