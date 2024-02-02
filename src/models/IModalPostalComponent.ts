import {ISelectCount} from "../pages/Basket";

export interface ICheckDetails {
    costInfo: {
        AssessedCost: number,
        Cost: number
    },
    deliveryInfo: {
        date: string,
        timezone: string,
        timezone_type: number
    }
}

export interface IModalPostalComponent {
    onClickHandler: () => {},
    totalPrice: number,
    reProductList: () => ISelectCount[],
    show: boolean,
    onHide: () => {}
}