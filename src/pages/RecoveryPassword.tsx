import React, {useEffect, useState} from 'react';
import {FC} from "react/index";
import {UseAppDispatch, UseAppSelector} from "../hooks/redux";
import { Helmet } from 'react-helmet';
import {useHistory, useParams} from "react-router-dom";
import { MAIN_ROUTE } from "../utils/consts";
import "../moduleCSS/RecoveryPassword.css"
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {checkRecoveryLink, fetchRecoveryPassword} from "../http/userAPI";
import {UserCheckSlice} from "../store/reducers/UserCheckSlice";
import {loadFingerprint} from "../http/interceptors";
const {userCheckError, userCheckSuccess, fetchUserCheck} = UserCheckSlice.actions;

const RecoveryPassword:FC = () => {
    const isAuth = UseAppSelector(state => state.UserCheckSlice.isAuth);

    const [newPassword, setNewPassword] = useState<string>("");
    const [repeatNewPassword, setRepeatNewPassword] = useState<string>("");
    const [isValidLink, setIsValidLink] = useState<string>('');
    const [infoMessage, setInfoMessage] = useState<string>('');
    const [fingerPrint, setFingerPrint] = useState<string>('');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const dispatch = UseAppDispatch();

    const removeDescriptionHTML = () => {
        const existingDescription = document.head.querySelector('meta[name="description"]');
        if (existingDescription) {
            document.head.removeChild(existingDescription);
        }
    }
    const handleSubmit = async () => {
        if (isFetching) {
            return false
        }
        setIsFetching(true)

        try {
            if (newPassword !== repeatNewPassword) {
                return false
            }
            dispatch(fetchUserCheck());
            const fetchResult = await fetchRecoveryPassword(link, newPassword, fingerPrint);
            if (fetchResult.split(' ')[0] === "ok") {
                localStorage.clear();
                localStorage.setItem("bTok", fetchResult.split(' ')[1]);
                dispatch(userCheckSuccess());
                history.push(MAIN_ROUTE);
            } else {
                localStorage.clear();
                setInfoMessage(fetchResult)
                dispatch(userCheckError(fetchResult));
            }
        } catch (e) {
            if (e.response && e.response.status === 404) {
                setInfoMessage(e.response.data.message);
            } else {
                setInfoMessage(e.message || "Виникла помилка")
            }
        } finally {
            setIsFetching(false)
        }
    }

    const history = useHistory();
    const { link } = useParams();

    useEffect( () => {

        if (isAuth) {
            history.push(MAIN_ROUTE);
        }

        (async () => {
            try {
                setFingerPrint(await loadFingerprint())
                const response = await checkRecoveryLink(link);
                if (response === "ok") {
                    setIsValidLink(response)
                }
            } catch (e) {
                if ((e.response && e.response.status === 404)) {
                    setIsValidLink(e.response.data.message);
                } else {
                    setIsValidLink(e.message || "Сталася помилка, повторіть спробу")
                }
            }
        })()
    }, [])

    if (isValidLink !== "ok") {
        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Сторінка відновлення пароля`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store – різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <div>{isValidLink}</div>
            </>

        )
    }

    return (
        <>
            <Helmet>
                {removeDescriptionHTML()}
                <title>{`Lin-Store | Сторінка відновлення пароля`}</title>
                <meta name="description"
                      content="Інтернет-магазин Lin-Store – різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
            </Helmet>
            <div
                className="d-flex justify-content-center align-items-center mt-5">
                <Card
                    className="p-4 p-sm-5"
                    style={{ width: 600}}>
                    <Form className="d-flex flex-column">
                        <h1 className="m-auto">
                            Встановлення нового пароля
                        </h1>

                        <Form.Group>
                            <Form.Control
                                value={newPassword}
                                className="mt-4 recovery-input"
                                size="lg"
                                type="password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Вкажіть новий пароль"/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control
                                value={repeatNewPassword}
                                className="mt-4 recovery-input"
                                size="lg"
                                type="password"
                                onChange={(e) => setRepeatNewPassword(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        await handleSubmit();
                                    }
                                }}
                                placeholder="Повторіть пароль"/>
                        </Form.Group>
                        <Form.Text className="text-muted">
                            {/*Пароль не должен содержать...*/}
                        </Form.Text>
                        {newPassword !== repeatNewPassword ?
                            <Form.Text className="text-muted">
                                Паролі не сходяться
                            </Form.Text> : ''
                        }

                        {infoMessage.length !== 0 ?
                            <Form.Text className="text-muted">
                                {infoMessage}
                            </Form.Text> : ''
                        }
                        <Row
                            className="d-flex justify-content-between align-items-center mt-2 pl-3 pr-3"
                        >
                            <Col xs={5}>
                                <Button
                                    size="lg"
                                    variant="outline-dark"
                                    onClick={async ()=> {await handleSubmit()}}>
                                    {isFetching ? "Йде відправка..." : "Відправити"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        </>
    );
};

export default RecoveryPassword;