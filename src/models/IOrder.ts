import {IProductsActionCreator} from "./IProductsActionCreator";

export interface IOrder {
    _id: string,
    products: IProductsActionCreator[],
    TTN: number,
    isCancel: boolean,
    price: number,
    info: string[],
    status: string[],
    orderNumber: number,
    receivedL: boolean,
    resultStatus: {
        deliveryCost: number,
        deliveryData: string,
        warehouseRecipient: string
    },
    typeDelivery: string,
    userId: string
}