import {IDescription} from "./IDescription";

export interface IProductsActionCreator {
    _id: string,
    name: string,
    typeId: string,
    brandId: string,
    totalProducts: number | null,
    price: number,
    totalRating: number,
    countRating: number,
    count: number,
    countSales: number,
    description?: IDescription[],
    shortDescription: string,
    img: string[],
    wasInUsed: boolean,
    colors: [{color: string, count: number, urlImg: string}],
    isActive: boolean,
    commentId: string,
    handlerRemove?: () => {}
}