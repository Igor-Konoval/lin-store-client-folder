import {AppDispatch} from "../store";
import {OldViewsSlice} from "./OldViewsSlice";
import {$authHost} from "../../http/interceptors";
import {IProductsActionCreator} from "../../models/IProductsActionCreator";
const {productFetching, productSuccess, productError, addProduct, updateSaveList} = OldViewsSlice.actions


export const getAuthOldViews = () => async (dispatch: AppDispatch)=> {
    try {
        dispatch(productFetching())
        const {data} = await $authHost.get<IProductsActionCreator[]>('oldViews/');
        dispatch(productSuccess(data))
    } catch (e) {
        dispatch(productError(e.message))
    }
}

export const updateAuthOldViews = (product: IProductsActionCreator) => async (dispatch: AppDispatch)=> {
    try {
        await $authHost.put<IProductsActionCreator[]>('oldViews/', {
            productId: product._id
        });
        dispatch(updateSaveList(product))
    } catch (e) {
        dispatch(productError(e.message))
    }
}

export const updateLocalOldViews = (product: IProductsActionCreator) => (dispatch: AppDispatch)=> {
    dispatch(updateSaveList(product))
}

export const addProductAuthOldViews = (product: IProductsActionCreator) => async (dispatch: AppDispatch)=> {
    try {
        dispatch(addProduct(product))
        await $authHost.post<string>('oldViews/', { productId: product._id});
    } catch (e) {
        dispatch(productError(e.message))
    }
}

export const addProductLocalOldViews = (product: IProductsActionCreator) => (dispatch: AppDispatch)=> {
    dispatch(addProduct(product))
}
