import {IProductsActionCreator} from "./IProductsActionCreator";

export interface IBasket {
    products: IProductsActionCreator[]
    error?: string
    isLoading?: boolean
}