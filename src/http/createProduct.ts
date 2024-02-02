import {$authHost} from "./interceptors";

export const createProduct = async (form: HTMLFormElement) => {
    const response = await $authHost.post('product', form)
    return response;
}

export const createBrand = async (addBrand: string) => {
    const response = await $authHost.post('brand', addBrand)
    return response;
}

export const createType = async (addType: string) => {
    const response = await $authHost.post('type', addType)
    return response;
}