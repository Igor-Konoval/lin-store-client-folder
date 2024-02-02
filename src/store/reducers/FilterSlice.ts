import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import IFilter from "../../models/IFilter";

interface IFilterState {
    filters: IFilter[],
    sortPrice: string | null,
    isLoading: boolean,
    error: string
}

const initialState: IFilterState = {
    filters: [],
    sortPrice: null,
    isLoading: false,
    error: ''
}

export const TypesFilterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        filtersTypeFetching: (state: IFilterState) => {
            state.isLoading = true;
        },

        filtersTypeSuccess: (state: IFilterState, action: PayloadAction<IFilter>) => {
            state.filters = action.payload;
            state.isLoading = false;
            state.error = '';
        },

        filtersTypeError: (state: IFilterState, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        selectSortPrice: (state: IFilterState, action: PayloadAction<string | null>) => {
            state.sortPrice = action.payload;
        }

    }
})