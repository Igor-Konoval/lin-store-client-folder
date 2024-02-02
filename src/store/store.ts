import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {ProductItemsSlice} from "./reducers/ProductItemsSlice";
import {ProductOneSlice} from "./reducers/ProductOneSlice";
import {TypesFilterSlice} from "./reducers/FilterSlice";
import {BrandsFilterSlice} from "./reducers/BrandSlice";
import {UserCheckSlice} from "./reducers/UserCheckSlice";
import {OldViewsSlice} from "./reducers/OldViewsSlice";
import {AppSlice} from "./reducers/AppSlice";


const rootReducer = combineReducers({
    ProductItemsSlice: ProductItemsSlice.reducer,
    ProductOneSlice: ProductOneSlice.reducer,
    TypesFilterSlice: TypesFilterSlice.reducer,
    BrandsFilterSlice: BrandsFilterSlice.reducer,
    UserCheckSlice: UserCheckSlice.reducer,
    OldViewsSlice: OldViewsSlice.reducer,
    AppSlice: AppSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch