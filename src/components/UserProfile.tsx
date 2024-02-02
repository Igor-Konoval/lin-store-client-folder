import React, {useEffect, useRef, useState} from 'react';
import {Accordion, Button, Col, Form, Offcanvas, Row} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input/input';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import {FC} from "react/index";
import {IUserProfileComponent} from "../models/IUserProfile";
import {formatDate, getUserProfile, updateUserProfile} from "../http/userAPI";
import {IUserProfile} from "../models/IUser";
import AlertBasket from "./AlertBasket";
import {UseAppSelector} from "../hooks/redux";
import AlertDismissible from "./AlertDismissible";
import {IErrorMessage} from "../models/ISelectedDevice";


const UserProfile:FC<IUserProfileComponent> = ({show, onHide}) => {

    const [userData, setUserData] = useState<IUserProfile>({} as IUserProfile);
    const [userDataFlag, setUserDataFlag] = useState<boolean>(false);
    const [contactDataFlag, setContactDataFlag] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [userFirstname, setUserFirstname] = useState<string>('');
    const [userSurname, setUserSurname] = useState<string>('');
    const [userLastname, setUserLastname] = useState<string>('');
    const [userPhone, setUserPhone] = useState<number|null>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    const [userBirthday, setUserBirthday] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showSecondAlert, setShowSecondAlert] = useState<boolean>(false);
    const [showAlertDis, setShowAlertDis] = useState(false);
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>({errorTitle: "", errorData: ""})

    const targetUserData = useRef(null);
    const targetContact = useRef(null);

    const {isAuth} = UseAppSelector( state => state.UserCheckSlice)

    const setLocalsData = (result: IUserProfile) => {
        setUserName(result.username || "")
        setUserFirstname(result.firstname || "")
        setUserSurname(result.surname || "")
        setUserLastname(result.lastname || "")
        setUserPhone(result.phone || "")
        setUserEmail(result.email || "")
        setUserBirthday(result.birthday || "");
    }

    useEffect(() => {
        (async () => {
            const result = await getUserProfile();
            setUserData(result)
            setLocalsData(result);
        })()
    }, [isAuth])

    const editUserPersonalData = async () => {
        const changedData = {}
        if (userName !== userData.username && userName.length !== 0) {
            changedData.username = userName;
        }

        if (userFirstname !== userData.firstname && userFirstname.length !== 0) {
            changedData.firstname = userFirstname;
        }
        if (userSurname !== userData.surname && userSurname.length !== 0) {
            changedData.surname = userSurname;
        }
        if (userLastname !== userData.lastname && userLastname.length !== 0) {
            changedData.lastname = userLastname;
        }
        if (userBirthday !== userData.birthday && userBirthday.length !== 0) {
            changedData.birthday = userBirthday;
        }

        if (Object.keys(changedData).length === 0) {
            return false
        }

        const result = await updateUserProfile(changedData);
        if (result === "ok") {
            setShowSecondAlert(true);
            setTimeout(() => setShowSecondAlert(false), 2400)
            setUserData(prevState => ({...prevState, ...changedData}))
            setUserDataFlag(false);
            return;
        } else {
            setErrorMessage({
                errorTitle: "Помилка дії",
                errorData: "Сталася помилка під час завантаження"
            });
            setShowAlertDis(true);
        }
    }

    const editUserContactData = async () => {
        const changedData = {}
        if (userEmail !== userData.email && userEmail.length !== 0) {
            changedData.email = userEmail;
        }
        if (userPhone !== userData.phone && userPhone.length !== 0)  {
            changedData.phone = userPhone;
        }

        if (Object.keys(changedData).length === 0) {
            return false
        }

        const result = await updateUserProfile(changedData);
        if (result === "ok") {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2400)
            setUserData(prevState => ({...prevState, ...changedData}))
            setContactDataFlag(false);
            return;
        } else {
            setErrorMessage({
                errorTitle: "Помилка дії",
                errorData: "Сталася помилка під час завантаження"
            });
            setShowAlertDis(true);
        }
    }

    if (!userData) {
        return (
            <Offcanvas show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton/>
                <Offcanvas.Body>
                    завантаження
                </Offcanvas.Body>
            </Offcanvas>
        )
    }

    return (
        <>
            <Offcanvas show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Профіль користувача</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body
                    className="fs-5"
                >
                    <Accordion className="mt-2 mb-4" defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Особисті дані</Accordion.Header>
                            <Accordion.Body>
                                <Form style={userDataFlag ?
                                    {display: "", marginBottom: 15} :
                                    {display: "none"}
                                }>
                                    <Form.Group>
                                        <Form.Label>Ім'я:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="вкажіть ім'я"
                                            value={userFirstname}
                                            onChange={(e) => setUserFirstname(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Прізвище:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="вкажіть прізвище"
                                            value={userLastname}
                                            onChange={(e) => setUserLastname(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>По батькові:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="вкажіть по батькові"
                                            value={userSurname}
                                            onChange={(e) => setUserSurname(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Відображене ім'я:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="вкажіть відображене ім'я"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="d-flex flex-column">
                                        <Form.Label>День народження:</Form.Label>
                                        <DatePicker onChange={setUserBirthday} value={userBirthday}/>
                                    </Form.Group>
                                </Form>
                                <Row
                                    style={userDataFlag ?
                                        {display: "none"} :
                                        {display: ""}
                                    }
                                >
                                    <Row className="d-flex flex-column mb-2">
                                        <Col className="text-muted">Ім'я:</Col>
                                        <Col>{userData.firstname}</Col>
                                    </Row>
                                    <Row className="d-flex flex-column mb-2">
                                        <Col className="text-muted">Прізвище:</Col>
                                        <Col>{userData.lastname}</Col>
                                    </Row>
                                    <Row className="d-flex flex-column mb-2">
                                        <Col className="text-muted">По батькові:</Col>
                                        <Col>{userData.surname}</Col>
                                    </Row>
                                    <Row className="d-flex flex-column mb-2">
                                        <Col className="text-muted">Відображене ім'я:</Col>
                                        <Col>{userData.username}</Col>
                                    </Row>
                                    <Row className="d-flex flex-column mb-2">
                                        <Col className="text-muted">День народження:</Col>
                                        <Col>{formatDate(userData.birthday)}</Col>
                                    </Row>
                                </Row>
                                <Button
                                    onClick={async () => {
                                        if (userDataFlag) {
                                            await editUserPersonalData();
                                            return;
                                        }
                                        setUserDataFlag(true)
                                    }}
                                    ref={targetUserData}
                                    variant={"outline-dark"}
                                    size={"lg"}
                                >
                                    {userDataFlag ? "Зберегти" : "Змінити"}
                                </Button>
                                <Button
                                    style={userDataFlag ?
                                        {display: "", marginLeft: "10px"} :
                                        {display: "none"}
                                    }
                                    onClick={() => setUserDataFlag(false)}
                                    variant={"secondary"}
                                    size={"lg"}
                                >
                                    Скасувати
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <Accordion className="my-4" defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Контакти</Accordion.Header>
                            <Accordion.Body>
                                <Form
                                    style={contactDataFlag ?
                                        {display: "", marginBottom: 15} :
                                        {display: "none"}
                                    }
                                >
                                    <Form.Group
                                        className="d-flex flex-column"
                                    >
                                        <Form.Label>Телефон:</Form.Label>
                                        <PhoneInput
                                            style={{
                                                paddingLeft: "10px",
                                                border: "1px solid #00000036",
                                                borderRadius: "7px"
                                            }}
                                            placeholder="телефон +380..."
                                            value={userPhone}
                                            onChange={setUserPhone}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Почта:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="вкажіть вашу пошту"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                </Form>
                                <Row
                                    style={contactDataFlag ?
                                        {display: "none"} :
                                        {display: ""}
                                    }
                                >
                                    <Row>
                                        <Row className="d-flex flex-column mb-2">
                                            <Col className="text-muted">Телефон:</Col>
                                            <Col>{userData.phone}</Col>
                                        </Row>
                                        <Row className="d-flex flex-column mb-2">
                                            <Col className="text-muted">Пошта:</Col>
                                            <Col>{userData.email}</Col>
                                        </Row>
                                    </Row>
                                </Row>
                                <Button
                                    onClick={async () => {
                                        if (contactDataFlag) {
                                            await editUserContactData();
                                            return;
                                        }
                                        setContactDataFlag(true)
                                    }}
                                    ref={targetContact}
                                    variant={"outline-dark"}
                                    size={"lg"}
                                >
                                    {contactDataFlag ? "Зберегти" : "Змінити"}
                                </Button>
                                <Button
                                    style={contactDataFlag ?
                                        {display: "", marginLeft: "10px"} :
                                        {display: "none"}
                                    }
                                    onClick={() => setContactDataFlag(false)}
                                    variant={"secondary"}
                                    size={"lg"}
                                >
                                    Скасувати
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Offcanvas.Body>
                <AlertBasket show={showSecondAlert} message={"Зміни прийнято"} target={targetUserData}/>
                <AlertBasket show={showAlert} message={"Зміни прийнято"} target={targetContact}/>
            </Offcanvas>
            <article>
                <AlertDismissible
                    showAlertDis={showAlertDis}
                    errorMessage={errorMessage}
                    setShowAlertDis={() => setShowAlertDis(false)}
                />
            </article>
        </>
    );
};

export default UserProfile;