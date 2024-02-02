import React, {useEffect, useRef, useState} from 'react';
import {FC} from "react/index";
import {
    Accordion,
    Button,
    Col,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    FormSelect,
    Image,
    Modal,
    Row
} from "react-bootstrap";
import PhoneInput from "react-phone-number-input/input";
import {formatDate, getUserProfile} from "../http/userAPI";
import {checkDetails, getStreet, identifyCity, identifyDepartment} from "../http/orderAPI";
import {AppSlice} from "../store/reducers/AppSlice";
import "../moduleCSS/ModalPostalComponent.css";
import {ICheckDetails, IModalPostalComponent} from "../models/IModalPostalComponent";
import {fetchBasket} from "../http/basketApi";
import "../moduleCSS/LoadSpiner.css";
import {UseAppDispatch} from "../hooks/redux";
import {IErrorMessage} from "../models/ISelectedDevice";
import AlertDismissible from "./AlertDismissible";
const {loadingApp} = AppSlice.actions;


const ModalPostalComponent:FC<IModalPostalComponent> = ({onClickHandler, show, onHide, totalPrice, reProductList}) => {
    const [firstname, setFirstname] = useState<string>('')
    const [surname, setSurname] = useState<string>('')
    const [lastname, setLastname] = useState<string>('')
    const [userPhone, setUserPhone] = useState<number>();
    const [userEmail, setUserEmail] = useState<string>('');
    const [showAlertDis, setShowAlertDis] = useState(false);
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>({errorTitle: "", errorData: ""})

    const [city, setCity] = useState<string>('')
    const [selectedCity, setSelectedCity] = useState();
    const [listCity, setListCity] = useState<[]>([]);

    const [streetList, setStreetList] = useState<[]>([]);
    const [street, setStreet] = useState<string>('');
    const [selectedStreet, setSelectedStreet] = useState();

    const [isControlSelectCityFocused, setIsControlSelectCityFocused] = useState(false);
    const [isControlSelectStreetFocused, setIsControlSelectStreetFocused] = useState(false);
    const [selectedService, setSelectedService] = useState<string>("0")
    const [selectedDepartment, setSelectedDepartment] = useState<string>('')
    const [departmentList, setDepartmentList] = useState<[]>([]);
    const [infoPreOrder, setInfoPreOrder] = useState<ICheckDetails | null>(null);
    const [loadInfoDelivery, setLoadInfoDelivery] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const dispatch = UseAppDispatch();

    const inputRef = useRef(null);
    const inputRefStreet = useRef(null);

    useEffect(() => {
        (async () => {
           const userData = await getUserProfile();
            setFirstname(userData.firstname)
            setSurname(userData.surname)
            setLastname(userData.lastname)
            setUserPhone(userData.phone)
            setUserEmail(userData.email)
        })()
    }, [])

    const onFocusHandler = () => {
        setIsControlSelectCityFocused(true);
    };

    const onBlurHandler = () => {
        setTimeout(() => {
            setIsControlSelectCityFocused(false);
            inputRefStreet.current.blur();
        }, 100);
    };

    const onFocusHandlerStreet = () => {
        setIsControlSelectStreetFocused(true);
    };

    const onBlurHandlerStreet = () => {
        setTimeout(() => {
            setIsControlSelectStreetFocused(false);
            inputRefStreet.current.blur();
        }, 100);
    };

    const handleSelectCity = async (currentCity) => {
        setCity(currentCity.present)
        setListCity([currentCity]);
        setSelectedCity(currentCity);
        const result = await identifyDepartment(currentCity.ref);
        setDepartmentList(result)
    }

    const handleSelectStreet = (currentStreet) => {
        setStreet(currentStreet.street);
        setSelectedStreet(currentStreet.ref);
        setStreetList([currentStreet]);
    }

    const handleCheckDetails = async () => {
        setLoadInfoDelivery(true);
        const result = await checkDetails(selectedCity.ref, 0.5, totalPrice, 1, 1);
        setInfoPreOrder(result);
        setLoadInfoDelivery(false)
    }

    const handleCreateOrder = async () => {
        if (isFetching) {
            return;
        }
        setIsFetching(true)

        try {
            const resultCreateOrder = await fetchBasket(reProductList(), selectedDepartment.warehouseIndex, selectedCity.ref, selectedStreet, userPhone, firstname, surname, lastname, userEmail)
            console.log(resultCreateOrder)
            if (resultCreateOrder === "не авторизован") {
                dispatch(loadingApp());
                window.location.reload();
            }
            await onClickHandler();
        } catch (e) {
            setErrorMessage({
                errorTitle: "Виникла помилка",
                errorData: "Помилка створення замовлення, перезавантажте сторінку та повторіть спробу"
            });
            setShowAlertDis(true);
        } finally {
            setIsFetching(false)
        }
    }

    const handleSelectDepartment = (e) => {
        const selectedIndex = e.target.selectedIndex;
        const selectedDepartmentItem = departmentList[selectedIndex];
        setSelectedDepartment(selectedDepartmentItem);
    }

    useEffect(() => {
        (async () => {
            if (!departmentList.length) {
                return;
            } else {
                await handleCheckDetails()
            }
        })()
    }, [selectedDepartment])

    return (
        <>
            <Modal
                keyboard={false}
                size={"xl"}
                backdrop="static"
                centered={true}
                show={show}
                onHide={onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title as={"h2"}>Створення замовлення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <h3>Ваші контактні дані</h3>
                            <Form
                                className="p-3"
                            >
                                <Form.Group>
                                    <Form.Label>Ім'я:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="вкажіть ім'я"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Прізвище:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="вкажіть прізвище"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>По батькові:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="вкажіть по батькові"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </Form.Group>
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
                                <h3>Доставка</h3>
                                <Form.Group
                                    className="d-flex flex-column"
                                >
                                    <FormSelect
                                        onChange={(e) => setSelectedService(e.target.value)}
                                        disabled={(firstname.length === 0 ||
                                            surname.length === 0 ||
                                            lastname.length === 0 ||
                                            !userPhone
                                        )}
                                    >
                                        <option value={"0"}>виберіть варіант доставки</option>
                                        <option value={"1"}>Самовивіз із Нової Пошти</option>
                                    </FormSelect>
                                </Form.Group>
                                <FormGroup>
                                    <FormLabel>Місто</FormLabel>
                                    <FormControl
                                        disabled={selectedService === "0"}
                                        className={"control-selectCity"}
                                        type="text"
                                        placeholder="вкажіть ваше місто"
                                        value={city}
                                        onChange={async (e) => {
                                            setCity(e.target.value)
                                            if (city.length !== 0) {
                                                const result = await identifyCity(city)
                                                setListCity(result)
                                            }
                                        }}
                                        onFocus={() => onFocusHandler()}
                                        onBlur={() => onBlurHandler()}
                                        ref={inputRef}
                                    />
                                    {listCity.length !== 0 && isControlSelectCityFocused ?
                                        <Row
                                            className={"container-selectCity"}
                                        >
                                            <Col
                                                className={"body-selectCity"}
                                            >
                                                {listCity.map((value, index) =>
                                                    <Row
                                                        key={index}
                                                        onPointerDown={async () => await handleSelectCity(value)}
                                                        className="p-1 item-selectCity"
                                                    >
                                                        <Col>{value.present}</Col>
                                                    </Row>
                                                )}
                                            </Col>
                                        </Row>
                                        : ''}
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Вулиця</FormLabel>
                                    <FormControl
                                        disabled={!selectedCity}
                                        type="text"
                                        placeholder="вкажіть вашу вулицю"
                                        value={street}
                                        onChange={async (e) => {
                                            setStreet(e.target.value)
                                            if (e.target.value !== "") {
                                                const result = await getStreet(selectedCity.ref, e.target.value)
                                                setStreetList(result)
                                            }
                                        }}
                                        onFocus={() => onFocusHandlerStreet()}
                                        onBlur={() => onBlurHandlerStreet()}
                                        ref={inputRefStreet}
                                    />
                                    {streetList.length !== 0 && isControlSelectStreetFocused ?
                                        <Row
                                            className={"container-selectCity"}
                                        >
                                            <Col
                                                className={"body-selectCity"}
                                            >
                                                {streetList.map((value, index) =>
                                                    <Row
                                                        key={index}
                                                        onPointerDown={() => handleSelectStreet(value)}
                                                        className="p-1 item-selectCity"
                                                    >
                                                        <Col>{value.street}</Col>
                                                    </Row>
                                                )}
                                            </Col>
                                        </Row>
                                        : ''}
                                </FormGroup>
                                <Form.Group
                                    className="d-flex flex-column"
                                >
                                    <Form.Label>Вибір відділення:</Form.Label>
                                    <FormSelect
                                        onChange={handleSelectDepartment}
                                        disabled={departmentList.length === 0}
                                    >
                                        <option>відділення пошти</option>
                                        {departmentList.map((value, index) =>
                                            <option key={index}>{value.description}</option>
                                        )}
                                    </FormSelect>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col>
                            <h3>Товари до замовлення</h3>
                            <Accordion className="mt-2 mb-4" defaultActiveKey="0">
                                <Accordion.Item eventKey={"0"}>
                                    <Accordion.Header>
                                        Вибраний перелік товарів
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {reProductList() && reProductList().map((product, index) =>
                                            <>
                                                <Row key={index}>
                                                    <Col className="mb-2" sm={12} lg={5}>
                                                        <Image
                                                            width={120}
                                                            height={120}
                                                            src={product.img}
                                                        />
                                                    </Col>
                                                    <Col sm={12} lg={7}>
                                                        <h2 className="fs-5 fw-600">{`${product.name} (${product.selectedColor})`}</h2>
                                                        <p className="mb-1">{product.price} грн.</p>
                                                        <p className="mb-0">{product.selectedCount} шт.</p>
                                                    </Col>
                                                </Row>
                                                <hr/>
                                            </>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            {loadInfoDelivery &&
                                <div className="small-container-spinner">
                                    <div className="load-spinner"></div>
                                </div>
                            }
                            {infoPreOrder &&
                                <>
                                    <h3>Приблизний розрахунок замовлення</h3>
                                    <Row className="d-flex flex-row text-end fs-5">
                                        <Col xs={12}>очікувана дата
                                            доставки {formatDate(infoPreOrder.deliveryInfo.date)}</Col>
                                        <Col xs={12}>{infoPreOrder.costInfo.Cost} грн. сума доставки</Col>
                                        <Col xs={12}>{infoPreOrder.costInfo.AssessedCost} грн. сума товару</Col>
                                        <Col
                                            xs={12}>{infoPreOrder.costInfo.AssessedCost + infoPreOrder.costInfo.Cost} грн.
                                            сума замовлення</Col>
                                    </Row>
                                </>
                            }
                            <Row className="text-end mt-3">
                                <Col>
                                    <Button
                                        disabled={infoPreOrder === null}
                                        style={{borderRadius: 50}}
                                        onPointerDown={async () => await handleCreateOrder()}
                                        size="lg"
                                        variant="outline-dark">
                                        {isFetching ? "йде обробка" : "Замовити"}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
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

export default ModalPostalComponent;