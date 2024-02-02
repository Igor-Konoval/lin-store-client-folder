import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface IUserCheckSlice {
    isAuth: boolean,
    isLoading: boolean,
    error: string
}

const initialState: IUserCheckSlice = {
    isAuth: false,
    isLoading: false,
    error: ''
}

export const UserCheckSlice = createSlice({
    name: "userCheck",
    initialState,
    reducers: {
        fetchUserCheck: (state: IUserCheckSlice) => {
            state.isLoading = true;
        },
        userCheckSuccess: (state: IUserCheckSlice) => {
            state.isLoading = false;
            state.isAuth = true;
        },
        userCheckError: (state: IUserCheckSlice, action: PayloadAction<string>) => {
            state.isAuth = false;
            state.isLoading = false;
            state.error = action.payload;
        },
        fetchLogoutCheck: (state: IUserCheckSlice) => {
            state.isLoading = true;
        },
        userLogoutSuccess: (state: IUserCheckSlice) => {
            state.isLoading = false;
            state.isAuth = false;
        },
        userLogoutError: (state: IUserCheckSlice, action: PayloadAction<string>) => {
            state.isAuth = false;
            state.isLoading = false;
            state.error = action.payload;
        }
    }
})