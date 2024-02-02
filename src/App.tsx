import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { UseAppDispatch, UseAppSelector } from './hooks/redux';
import { check } from './store/reducers/UserActionCreator';
import "./moduleCSS/Container.css";
import "./moduleCSS/LoadSpiner.css"
import {AppSlice} from "./store/reducers/AppSlice";
import {loadFingerprint} from "./http/interceptors";
const {loadingAppSuccess} = AppSlice.actions;


const App = () => {
    const dispatch = UseAppDispatch();
    const isLoading = UseAppSelector(state => state.AppSlice.isLoading);

    useEffect(() => {
        try {
            loadFingerprint()
                .then(value =>
                    dispatch(check(value)))
                .then(value =>
                    dispatch(loadingAppSuccess()));
        } catch (e) {
            console.log(e.message)
        }
    }, []);

    if (isLoading) {
        return (
            <div className="container-spinner">
                <div className="load-spinner"></div>
            </div>
        )
    }

    return (
        <BrowserRouter>
            <Container
                fluid={true}
                className={"container-page"}
            >
                <NavBar />
                <AppRouter />
            </Container>
        </BrowserRouter>
    );
};

export default App;
