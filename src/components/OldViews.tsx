import React, {useEffect} from 'react';
import {FC} from "react/index";
import {UseAppDispatch, UseAppSelector} from "../hooks/redux";
import {getAuthOldViews} from "../store/reducers/OldViewsActionCreator";
import OldViewsSlider from "./OldViewsSlider";
import "../moduleCSS/LoadSpiner.css"

const OldViews:FC = () => {

    const dispatch = UseAppDispatch();

    const isAuth = UseAppSelector(state => state.UserCheckSlice.isAuth)

    useEffect(() => {
        if (isAuth) {
            ( async () => {
                await dispatch(getAuthOldViews())
            })()
        }
    }, [])

    const {products, isLoad} = UseAppSelector(state => state.OldViewsSlice)

    if (isLoad) {
        return (
            <div className="container-spinner">
                <div className="load-spinner"></div>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="mt-5">
                <h1>Переглянуті товари</h1>
                <hr className="mb-5"/>
                <OldViewsSlider products={products}/>
            </div>
        );
    } else {
        return (
            <div className="mt-5">
                <h1>Переглянуті товари</h1>
                <hr/>
                <OldViewsSlider products={products}/>
            </div>
        );
    }
};

export default OldViews;