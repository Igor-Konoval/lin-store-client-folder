import {AppDispatch} from "../store";
import {ProductItemsSlice} from "./ProductItemsSlice";
import {ProductOneSlice} from "./ProductOneSlice";
import {IProductsActionCreator} from "../../models/IProductsActionCreator";
import {TypesFilterSlice} from "./FilterSlice";
import IFilter from "../../models/IFilter";
import {BrandsFilterSlice} from "./BrandSlice";
import {$publicHost} from "../../http/interceptors";

const {
    productsSuccess,
    productsFetching,
    productsError,
    productsPage,
    productsLimit,
    productsTotalPages,
    setTotalProducts,
    productAllPrices
} = ProductItemsSlice.actions;

const {productOneFetching, productOneSuccess, productOneError} = ProductOneSlice.actions;
const {filtersTypeError, filtersTypeSuccess, filtersTypeFetching} = TypesFilterSlice.actions;
const {filtersBrandFetching, filtersBrandSuccess, filtersBrandError} = BrandsFilterSlice.actions;

export const fetchProducts = (
    searchTerm: string | null = null,
    page: number,
    limit: number,
    type: string | null,
    brand: string | null,
    maxPrice: number | null,
    minPrice: number | null,
    sortPrice: string | null
) => async (dispatch: AppDispatch)=> {
    try {
        dispatch(productsFetching());
        const response = await $publicHost.get<IProductsActionCreator[]>("product", {params: {
            searchTerm,
            page: page,
            limit: limit,
            type: type === "Категории" ? null : type,
            brand: brand === "Бренды" ? null : brand,
            maxPrice,
            minPrice,
            sortPrice
            }});
        dispatch(productsSuccess(response.data.productList));
        dispatch(productAllPrices(response.data.allPrices))
        dispatch(setTotalProducts(response.data.totalProducts))
        dispatch(productsLimit(limit));
        dispatch(productsTotalPages(response.data.totalPages))
    } catch (e) {
        dispatch(productsError(e.message))
    }
}

export const fetchCurrentPage = (page: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(productsPage(page));
    } catch (e) {
        console.log(e.message);
    }
}

export const fetchFilter = (filter: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(filtersTypeFetching());
        const response = await $publicHost.get<IFilter[]>(`${filter}`);
        dispatch(filtersTypeSuccess(response.data));
    } catch (e) {
        dispatch(filtersTypeError(e.message));
    }
}

export const fetchBrand = (filter: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(filtersBrandFetching());
        const response = await $publicHost.get<IFilter[]>(`${filter}`);
        dispatch(filtersBrandSuccess(response.data));
    } catch (e) {
        dispatch(filtersBrandError(e.message));
    }
}