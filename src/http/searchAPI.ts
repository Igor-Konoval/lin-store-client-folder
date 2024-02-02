import {$publicHost} from "./interceptors";

export const shortSearch = async (searchTerm: string) => {
    try {
        const {data} = await $publicHost.get('/search/shortSearch', {
            params: {
                q: searchTerm
            }
        })
        return data;
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}