import {createSlice} from "@reduxjs/toolkit";

interface IAppState {
    isLoading: boolean,
}

const initialState: IAppState = {
    isLoading: true,
}

export const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
         loadingApp: (state: IAppState) => {
            state.isLoading = true;
        },

        loadingAppSuccess: (state: IAppState) => {
            state.isLoading = false;
        },
    }
})
