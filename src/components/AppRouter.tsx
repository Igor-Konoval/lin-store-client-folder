import React from 'react';
import {FC} from "react/index";
import {Switch, Route, Redirect } from "react-router-dom";
import {authRoutes, publicRoutes} from "../routes";
import {MAIN_ROUTE} from "../utils/consts";
import {UseAppSelector} from "../hooks/redux";

const AppRouter:FC = () => {

    const isAuth: boolean = UseAppSelector(state => state.UserCheckSlice.isAuth);
    return (
        <Switch>
            {isAuth && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )}
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )}
            <Redirect to={MAIN_ROUTE}/>
        </Switch>
    );
};

export default AppRouter;