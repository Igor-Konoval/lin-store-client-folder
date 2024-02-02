import React, {useEffect} from 'react';
import {FC} from "react/index";
import {MAIN_ROUTE} from "../utils/consts";
import {fetchAcceptOrder} from "../http/orderAPI";
import "../moduleCSS/LoadSpiner.css";
import {UseAppSelector} from "../hooks/redux";
import {useHistory, useParams} from "react-router-dom";

const OAccept:FC = () => {
    const history = useHistory();
    const { orderNumber } = useParams();
    const {isAuth, isLoading} = UseAppSelector(state => state.UserCheckSlice);

    if (!isAuth) {
        history.push(MAIN_ROUTE);
    }

    useEffect(() => {
        ( async () => {
            try {
                const response = await fetchAcceptOrder(orderNumber)
                if (response === "ok") {
                    alert("подтверждено")
                } else {
                    history.push(MAIN_ROUTE);
                    return
                }
            } catch (e) {
                history.push(MAIN_ROUTE);
            }
        }) ()
    }, [orderNumber]);

    if (isLoading) {
        return (
            <div className="container-spinner">
                <div className="load-spinner"></div>
            </div>
        )
    }

    return (
        <div className="container-spinner">
            <div className="load-spinner"></div>
        </div>
    )
};

export default OAccept;