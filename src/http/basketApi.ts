import {AxiosResponse} from "axios";
import {IBasket} from "../models/IBasket";
import {IProductsActionCreator} from "../models/IProductsActionCreator";
import {$authHost} from "./interceptors";
import {ISelectCount} from "../pages/Basket";

export const getBasket = async (): Promise<AxiosResponse<IProductsActionCreator[]>> => {
    const {data} = await $authHost.get<IProductsActionCreator[]>
    (
        process.env.REACT_APP_API_URL + "basket/basketUser"
    )

    return data;
}

export const addBasket = async (idProduct: string, color: string): Promise<AxiosResponse<IBasket>> => {
    try {
        const {data} = await $authHost.post<IBasket>("basket/basketUser",
            {
                selectedProduct: idProduct,
                selectedColor: color
            }
        )

        return data;
    } catch (error) {
        return error.response.data;
    }

}

export const dropBasket = async (idProduct: string, color: string): Promise<AxiosResponse<IBasket>> => {
    const {data} = await $authHost.post<IBasket>
    ("basket/dropBasketUser",
        {
            selectedProduct: idProduct,
            selectedColor: color
        }
    )
    return data;
}

export const fetchBasket = async (productList: ISelectCount[], recipientsWarehouse, cityRecipient, recipientAddress,
                                  recipientsPhone, firstname, surname, lastname, email) => {
    const {data} = await $authHost.post("order/createDocument",
        {
            productList,
            recipientsWarehouse,
            cityRecipient,
            recipientAddress,
            recipientsPhone,
            firstname,
            surname,
            lastname,
            email,
        })
    return data;
}