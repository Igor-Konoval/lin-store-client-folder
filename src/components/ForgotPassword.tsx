import React, {useEffect, useState} from 'react';
import {FC} from "react/index";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {UseAppSelector} from "../hooks/redux";
import {useHistory} from "react-router-dom";
import {MAIN_ROUTE} from "../utils/consts";
import {fetchEmailRecoveryPassword} from "../http/userAPI";
import "../moduleCSS/ForgotPassword.css"

const ForgotPassword:FC = () => {
    const [email, setEmail] = useState<string>('');
    const [info, setInfo] = useState<string>('');
    const [fetchResult, setFetchResult] = useState<string>('');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const isAuth = UseAppSelector(state => state.UserCheckSlice.isAuth);
    const history = useHistory();

    useEffect( () => {
        if (isAuth) {
            history.push(MAIN_ROUTE);
        }
    }, [])

    const handleSubmit = async () => {
        if (isFetching) {
            return false
        }
        setIsFetching(true)

        try {
            setInfo("")
            const validEmail = email.endsWith("@gmail.com");
            if (validEmail) {
                setInfo("");
                await fetchEmailRecoveryPassword(email).then( result => setFetchResult(result) );
            } else {
                setInfo("ви припустилися помилки у вказівці пошти");
            }
            return false
        } catch (e) {
            setInfo("Виникла помилка")
        } finally {
            setIsFetching(false);
        }
    }

    if (fetchResult === "ok") {
        return (
            <div className="d-flex justify-content-center align-items-center mt-5">
                <Card
                    style={{ width: 600}}
                    className="p-4 p-sm-5 d-flex flex-column forgot-card-container"
                >
                    <p className="fw-bold">На вашу пошту було надіслано повідомлення з посиланням на скидання пароля</p>
                    <p className="text-muted">Ви можете закрити цю сторінку та дізнатися про наступні дії в повідомленні</p>
                </Card>
            </div>
        )
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center mt-5">
            <Card
                className="p-4 p-sm-5"
                style={{ width: 600}}>
                <Form className="d-flex flex-column">
                    <h1 className="m-auto">
                        Відновлення паролю
                    </h1>

                    <Form.Group>
                        <Form.Control
                            value={email}
                            className="mt-4 forgot-input"
                            size="lg"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    await handleSubmit();
                                }
                            }}
                            placeholder="Вкажіть вашу пошту"/>
                    </Form.Group>

                    {email.length !== 0 ?
                        <Form.Text className="text-danger">
                            {info}
                        </Form.Text> : ''
                    }
                    {fetchResult !== "ok" ?
                        <Form.Text className="text-danger">
                            {fetchResult}
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
    );
};

export default ForgotPassword;