import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import IFilter from "../../models/IFilter";

interface IFilterState {
    filters: IFilter[],
    isLoading: boolean,
    error: string
}

const initialState: IFilterState = {
    filters: [],
    isLoading: false,
    error: ''
}

export const BrandsFilterSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {
        filtersBrandFetching: (state: IFilterState) => {
            state.isLoading = true;
        },

        filtersBrandSuccess: (state: IFilterState, action: PayloadAction<IFilter>) => {
            state.filters = action.payload;
            state.isLoading = false;
            state.error = '';
        },

        filtersBrandError: (state: IFilterState, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        }

    }
})
