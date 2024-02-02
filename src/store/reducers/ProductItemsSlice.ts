import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IProductsActionCreator} from "../../models/IProductsActionCreator";
import IFilter from "../../models/IFilter";

interface ProductState {
    searchTerm: string | null,
    totalPages: number,
    currentPage: number,
    limit: number,
    totalProducts: number | null,
    type: IFilter,
    brand: IFilter,
    prices: IPrices,
    fixedPrices: IPrices,
    products: IProductsActionCreator[],
    error: string,
    isLoading: boolean
}

const initialState: ProductState = {
    searchTerm: null,
    currentPage: 1,
    totalPages: 1,
    totalProducts: null,
    limit: 25,
    type: {name: "Категории", _id: null},
    brand: {name: "Бренды", _id: null},
    prices: {
        minPrice: null,
        maxPrice: null
    },
    fixedPrices: {
        minPrice: null,
        maxPrice: null
    },
    products:[],
    error: '',
    isLoading: false
}

export const ProductItemsSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        productsFetching: (state: ProductState) => {
            state.isLoading = true;
        },

        productsSuccess: (state: ProductState, action: PayloadAction<IProductsActionCreator[]>) => {
            state.products = action.payload;
            state.isLoading = false;
            state.error = '';
        },

        productsPage: (state: ProductState, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },

        productsTotalPages: (state: ProductState, action: PayloadAction<number>) => {
            state.totalPages = action.payload;
        },

        setTotalProducts: (state: ProductState, action: PayloadAction<number | null>) => {
            state.totalProducts = action.payload;
        },

        productsLimit: (state: ProductState, action: PayloadAction<number>) => {
            state.limit = action.payload;
        },

        productsError: (state: ProductState, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false
        },

        setSearchValue: (state: ProductState, action:PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },

        productsTypeId: (state: ProductState, action: PayloadAction<IFilter>) => {
            state.type = action.payload;
        },

        productsBrandId: (state: ProductState, action: PayloadAction<IFilter>) => {
            state.brand = action.payload;
        },

        productPrices: (state: ProductState, action: PayloadAction<IPrices>) => {
            state.prices = action.payload;
        },

        productFixedPrices: (state: ProductState, action: PayloadAction<IPrices>) => {
            state.fixedPrices = action.payload;
        },

        productAllPrices: (state: ProductState, action: PayloadAction<IPrices>) => {
            state.fixedPrices = action.payload.fixedPrices;
            state.prices = action.payload.prices;
        }
    }
})


