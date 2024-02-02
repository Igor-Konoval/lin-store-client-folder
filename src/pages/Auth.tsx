import React, {useEffect, useState} from 'react';
import {FC} from "react/index";
import fingerprintjs from "@fingerprintjs/fingerprintjs";
import {Button, Card, Col, Form, Image, Row} from "react-bootstrap";
import {NavLink, useHistory, useLocation} from "react-router-dom";
import { Helmet } from 'react-helmet';
import {FORGOT_PASSWORD_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import {fetchAuthGoogle, login, registration} from "../http/userAPI";
import "../moduleCSS/Auth.css"
import {UseAppDispatch, UseAppSelector} from "../hooks/redux";
import {googleAuth} from "../http/googleAuthAPI";
import {UserCheckSlice} from "../store/reducers/UserCheckSlice";
import {loadFingerprint} from "../http/interceptors";
import AlertDismissible from "../components/AlertDismissible";
import {IErrorMessage} from "../models/ISelectedDevice";
const {userCheckError, userCheckSuccess, fetchUserCheck} = UserCheckSlice.actions;

const Auth:FC = () => {

    const dispatch = UseAppDispatch();

    const isAuth = UseAppSelector(state => state.UserCheckSlice.isAuth);

    const location = useLocation();
    const isLogin: boolean = location.pathname === LOGIN_ROUTE;

    const history = useHistory();

    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fingerPrint, setFingerPrint] = useState<string>('');
    const [errorValid, setErrorValid] = useState<string>('');
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [showAlertDis, setShowAlertDis] = useState(false);
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>({errorTitle: "", errorData: ""})

    useEffect( () => {
        if (isAuth) {
            history.push(MAIN_ROUTE);
        }

        (async () => {
        setFingerPrint(await loadFingerprint())
        })()
    }, [])

    const pushGoogleAuthData = async () => {
        try {
            dispatch(fetchUserCheck());
            const data = await googleAuth();
            const result = await fetchAuthGoogle(data, fingerPrint);

            if (result.split(' ')[0] === "ok") {
                localStorage.clear();
                localStorage.setItem("bTok", result.split(' ')[1]);
                dispatch(userCheckSuccess());
                history.push(MAIN_ROUTE);
            } else {
                localStorage.clear()
                dispatch(userCheckError(result));
            }
        } catch (e) {
            setErrorMessage({
                errorTitle: "Помилка дії",
                errorData: "Виникла помилка під час аутентифікації користувача"
            });
            setShowAlertDis(true);
        }
    }

    const removeDescriptionHTML = () => {
        const existingDescription = document.head.querySelector('meta[name="description"]');
        if (existingDescription) {
            document.head.removeChild(existingDescription);
        }
    }

    const pushData = async () => {
        if (isFetching) {
            return false
        }
        setIsFetching(true)

        try {
            let result;

            dispatch(fetchUserCheck());

            if (isLogin) {
                result = await login(email, password, fingerPrint);
            } else {
                if (username.length === 0 || username.length > 20) {
                    setErrorValid("ваш логін має неприпустиму кількість символів, він має складатися з 1-20 символів")
                    return;
                }
                result = await registration(email, username, password, fingerPrint);
            }

            if (result.split(' ')[0] === "ok") {
                localStorage.clear();
                localStorage.setItem("bTok", result.split(' ')[1]);
                dispatch(userCheckSuccess());
                history.push(MAIN_ROUTE);
            } else {
                localStorage.clear();
                setErrorValid(result)
                dispatch(userCheckError(result));
            }

        } catch (e) {
            if (e.response && e.response.status === 401) {
                setErrorValid(e.response.data.message);
            } else if (e.response && e.response.status === 404) {
                setErrorValid(e.response.data.message);
            } else {
                setErrorValid(e.message || "Сталася помилка під час виконання операції")
            }
        } finally {
            setIsFetching(false)
        }
    }

    return (
        <>
            <Helmet>
                {removeDescriptionHTML()}
                <title>{`Lin-Store | ${isLogin ? "Авторизація" : "Реєстрація"} користувача`}</title>
                <meta name="description"
                      content="Інтернет магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
            </Helmet>
            <div
                className="d-flex justify-content-center align-items-center mt-5">
                <Card
                    className="p-4 p-sm-5 auth-card-container"
                    // style={{ width: 600}}
                >
                    <Form className="d-flex flex-column">
                        <h1 className="m-auto form-title">
                            {isLogin ? "Авторизація" : "Зареєструватись"}
                        </h1>
                        <Form.Group>
                            <Form.Control
                                value={email}
                                className="auth-input mt-4"
                                size="lg"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Електронна адреса"/>
                        </Form.Group>
                        {!isLogin && <Form.Group>
                            <Form.Control
                                value={username}
                                className="auth-input mt-4"
                                size="lg"
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ваше ім'я"/>
                        </Form.Group>
                        }
                        <Form.Group>
                            <Form.Control
                                value={password}
                                className="auth-input mt-4"
                                size="lg"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        await pushData();
                                    }
                                }}
                                placeholder="Ваш пароль"/>
                            {errorValid &&
                                <Form.Text className="errorValid">
                                    {/*Пароль не должен содержать...*/}
                                    {errorValid}
                                </Form.Text>
                            }
                        </Form.Group>
                        <Row
                            className="d-flex justify-content-between flex-column flex-sm-row align-items-center align-items-sm-center mt-2 pl-3 pr-3"
                        >
                            <Col xs={12} sm={7}>
                                {isLogin ?
                                    <>
                                        <div>
                                            Немає облікового запису? <NavLink to={REGISTRATION_ROUTE}>Зареєструватись</NavLink>
                                        </div>
                                        <div>
                                            Забули пароль? <NavLink to={FORGOT_PASSWORD_ROUTE}>Відновити</NavLink>
                                        </div>
                                    </>
                                    :
                                    <div>
                                        маєте обліковий запис? <NavLink to={LOGIN_ROUTE}>Авторизуватися</NavLink>
                                    </div>
                                }
                                <div
                                    onClick={pushGoogleAuthData}
                                    className="d-flex flex-row align-items-center p-2 mt-2"
                                    style={{
                                        width: "fit-content",
                                        borderRadius: "3px",
                                        border: "none",
                                        backgroundColor: "#ffff",
                                        boxShadow: "0px 1px 2px 0px rgb(0 0 0 / 81%)",
                                    }}
                                >
                                    <Image
                                        className="me-2"
                                        width={21}
                                        height={21}
                                        src={process.env.REACT_APP_API_URL + "google.png"}
                                        alt="image_google_icon"
                                    />
                                    Увійти
                                </div>
                            </Col>
                            <Col xs={12} sm={5}
                                 className="d-flex justify-content-center justify-content-sm-start"
                            >
                                {isLogin ?
                                    <Button
                                        size="lg"
                                        className="auth-button"
                                        variant="outline-dark"
                                        onClick={pushData}>
                                        {isFetching ? "Йде відправка..." : "Авторизуватися"}
                                    </Button> :
                                    <Button
                                        size="lg"
                                        className="auth-button"
                                        variant="outline-dark"
                                        onClick={pushData}>
                                        {isFetching ? "Йде відправка..." : "Зареєструватись"}
                                    </Button>
                                }
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
            <AlertDismissible
                showAlertDis={showAlertDis}
                errorMessage={errorMessage}
                setShowAlertDis={() => setShowAlertDis(false)}
            />
        </>
    );
};

export default Auth;