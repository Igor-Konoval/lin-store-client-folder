import React, {useEffect} from 'react';
import {FC} from "react/index";
import {UseAppSelector} from "../hooks/redux";
import {useHistory, useParams} from "react-router-dom";
import {MAIN_ROUTE} from "../utils/consts";
import {fetchRejectOrder} from "../http/orderAPI";
import "../moduleCSS/LoadSpiner.css";

const OReject:FC = () => {
    const isAuth = UseAppSelector(state => state.UserCheckSlice.isAuth);
    const history = useHistory();

    if (isAuth) {
        history.push(MAIN_ROUTE);
    }

    const { orderNumber } = useParams();

    useEffect(() => {
        ( async () => {
            try {
                const response = await fetchRejectOrder(orderNumber)
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

    return (
        <div className="container-spinner">
            <div className="load-spinner"></div>
        </div>
    )
};

export default OReject;