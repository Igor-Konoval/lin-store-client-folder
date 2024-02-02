import {AxiosResponse} from "axios";
import {$authHost, $publicHost} from "./interceptors";

export interface IResponseCommentUser {
    productId: string,
    username: string,
    userId: string,
    isGetOrder: boolean,
    isRemove: boolean,
    sendTo: string,
    isChanged: boolean,
    commentUserId: string,
    commentData: string,
    commentDate: string
}

export interface IGetAllComments {
    username: string,
    rating: number,
    isGetOrder: boolean,
    sendTo: string,
    isRemove: boolean,
    isChanged: boolean,
    commentData: string,
    commentDate: string,
    responseComments: IResponseCommentUser[]
}

export interface IUserComments {
    userComments: IGetAllComments[],
    productName: string,
    productId: string,
    productTotalRating: number,
    productCountRating: number,
    productShortDescription: string,
    productImg: string
    price: number,
}

export const createDate = () => {
    const currentDate: Date = new Date();

    const months: string[] = [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];

    const day: number = currentDate.getDate();
    const monthIndex: number = currentDate.getMonth();
    const year: number = currentDate.getFullYear();

    const formattedDate: string = `${day} ${months[monthIndex]} ${year} року`;

    return formattedDate;
}

export const createCommentUser = async (productId: string, rating: number, commentData: string, commentDate: string) => {
    try {
        const response = await $authHost.post("comment/", {
            productId,
            rating,
            commentData,
            commentDate
        });

        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const createResponseCommentUser = async (productId: string, commentUserId: string, mainCommentUserId: string, commentData: string, commentDate: string) => {
    try {
        const response = await $authHost.post('comment/responseComment', {
            commentUserId,
            commentData,
            mainCommentUserId,
            commentDate,
            productId
        })

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getAllComments = async (id: string): Promise<AxiosResponse<IGetAllComments[]>> => {
    const {data} = await $publicHost.get<IGetAllComments[]>(`comment/${id}`)
    return data;
}

export const getUserComments = async () => {
    try {
        const {data} = await $authHost.get<IUserComments[]>("comment/commentsUser");

        return data;
    } catch (error) {
        console.log(error.message);
    }
}

export const totalRatingComments = (allComments: IGetAllComments[]) => {
    const filtrationRating = allComments.filter(({rating}) => rating > 0).map(comment => comment.rating);
    const totalRating = +(filtrationRating.reduce((prev, current) => prev + current, 0) / filtrationRating.length).toFixed(1);
    return {
        totalRating,
        countRating: filtrationRating.length
    }
}

export const removeComment = async (productId: string, commentUserId: string, commentDate: string) => {
    try {
        const response = await $authHost.post("comment/removeComment", {
            productId,
            commentUserId,
            commentDate
        })

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const removeResponseComment = async (productId: string, responseCommentId: string, commentUserId: string) => {
    try {
        const response = await $authHost.post("comment/removeResponseComment", {
            productId,
            commentUserId,
            responseCommentId,
            commentDate: createDate()
        })

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const changeCommentUser = async (productId: string, commentUserId: string, commentData: string) => {
    try {
        const response = await $authHost.post("comment/changeComment", {
            productId,
            commentUserId,
            commentData,
        })

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const changeResponseCommentUser = async (responseCommentUserId: string, productId: string, commentUserId: string, commentData: string) => {
    try {
        const response = await $authHost.post("comment/changeResponseComment", {
            responseCommentUserId,
            productId,
            commentUserId,
            commentData,
        })

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}


