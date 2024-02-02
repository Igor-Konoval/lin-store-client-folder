import {$authHost} from "./interceptors";

export const checkIdSaveList = async (id: string) => {
    try {
        const {data} = await $authHost.get<boolean>(`saveList/${id}`);
        return data
    } catch (e) {
        console.log(e);
    }
}

export const getSaveList = async () => {
    try {
        const {data} = await $authHost.get("saveList/");

        return data
    } catch (e) {
        console.log(e.message)
    }
}

export const selectIdSaveList = async (productId: string) => {
    try {
        const {data} = await $authHost.post<boolean>("saveList", {
            productId
        })

        return data
    } catch (e) {
        console.log(e.message)
    }
}

export const removeIdSaveList = async (id: string) => {
    try {
        const {data} = await $authHost.delete<string>(`saveList/${id}`)

        return data
    } catch (e) {
        console.log(e.message)
    }
}