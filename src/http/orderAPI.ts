import {AxiosResponse} from "axios";
import {$authHost} from "./interceptors";
import {ICheckDetails} from "../models/IModalPostalComponent";
import {ICheckOrderProduct} from "../models/ICheckOrderProduct";

export const getOrderUser = async () => {
    const {data} = await $authHost.get("order/orderUser");
    return data;
}

export const identifyCity = async (city: string) => {
    try {
        const {data} = await $authHost.post("order/identifyCity", {
            city
        })
        return data;
    } catch (e) {
        console.log({message: e.message})
    }
}

export const cancelOrder = async (TTN: number, orderNumber: number) => {
    try {
        const {data} = await $authHost.put("order/cancelOrder", {
            TTN,
            orderNumber
        })
        return data
    } catch (e) {
        console.log({message: e.message})
    }
}

export const getStreet = async (cityRef: string ,street: string) => {
    try {
        const {data} = await $authHost.post("order/getStreet", {
            cityRef,
            street
        })
        return data;
    } catch (e) {
        console.log({message: e.message})
    }
}

export const identifyDepartment = async (cityRef: string) => {
    try {
        const {data} = await $authHost.post("order/identifyDepartment", {
            cityRef
        })
        return data;
    } catch (e) {
        console.log({message: e.message})
    }
}

export const checkDetails = async (cityRecipient: string, weight: number, cost: number, seatsAmount: number, packCount: number): Promise<AxiosResponse<ICheckDetails>> => {
    try {
        const {data} = await $authHost.post<ICheckDetails>("order/checkDetails", {
            cityRecipient,
            weight,
            cost,
            seatsAmount,
            packCount
        })
        return data;
    } catch (e) {
        console.log({message: e.message})
    }
}

export const checkOrderProduct = async (productId: string) => {
    const {data} = await $authHost.get<ICheckOrderProduct>(`order/checkOrderForCom/${productId}`)
    return data;
}

export const fetchAcceptOrder = async (orderNumber: string) => {
    try {
        const {data} = await $authHost.get<string>(`order/acceptOrder/${orderNumber}`)

        return data;
    } catch (e) {
        console.log(e)
    }
}
export const fetchRejectOrder = async (orderNumber: string) => {
    try {
        const {data} = await $authHost.get<string>(`order/rejectOrder/${orderNumber}`)
        return data;
    } catch (e) {
        console.log(e)
    }
}