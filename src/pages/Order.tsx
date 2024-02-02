import React, {useEffect, useState} from 'react';
import {FC} from "react/index";
import {cancelOrder, getOrderUser} from "../http/orderAPI";
import {IProductsActionCreator} from "../models/IProductsActionCreator";
import {Button, Col, Image, Row} from "react-bootstrap";
import {DEVICE_ROUTE} from "../utils/consts";
import {useHistory} from "react-router-dom";
import { Helmet } from 'react-helmet';
import {AppSlice} from "../store/reducers/AppSlice";
import OldViews from "../components/OldViews";
import "../moduleCSS/Order.css"
import "../moduleCSS/LoadSpiner.css";
import {UseAppDispatch} from "../hooks/redux";
import {IOrder} from "../models/IOrder";
import {IErrorMessage} from "../models/ISelectedDevice";
import AlertDismissible from "../components/AlertDismissible";
const {loadingApp} = AppSlice.actions;

const Order:FC = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [order, setOrder] = useState<IOrder[]>([]);
    const [fetchCancelOrder, setFetchCancelOrder] = useState<string>("");
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [showAlertDis, setShowAlertDis] = useState(false);
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>({errorTitle: "", errorData: ""})
    const dispatch = UseAppDispatch();

    const history = useHistory();

    useEffect(() => {
        (async() => {
            try {
                const response = await getOrderUser();
                if (response === "не авторизован") {
                    dispatch(loadingApp());
                    window.location.reload();
                }
                setOrder(response);
                setLoading(false);
            } catch (e) {
                setLoading(false)
                if (e.status === 408) {
                    setOrder([])
                }
            }
        })()
    }, [fetchCancelOrder])

    const handleDropdownStatus = (e) => {
        const target = e.target.closest(".container-showHistory").previousSibling;
        const imgTarget = e.currentTarget.querySelector("img");
        imgTarget.classList.toggle('img-hideHistory');
        imgTarget.classList.toggle('img-showHistory');

        target.classList.toggle('status-item-hide');
        target.classList.toggle('status-item-show');
    }

    const removeDescriptionHTML = () => {
        const existingDescription = document.head.querySelector('meta[name="description"]');
        if (existingDescription) {
            document.head.removeChild(existingDescription);
        }
    }

    const checkRating = (rating: number) => {
        const maxRating = 5;
        const reRating = Math.round(rating)

        const filledStar = (
            <Image
                className="product-filledStar"
                alt="image_filled_star"
                key="filled"
                src={process.env.REACT_APP_API_URL + "fullstar.png"}
            />
        );

        const emptyStar = (
            <Image
                className="product-emptyStar"
                key="empty"
                alt="image_empty_star"
                src={process.env.REACT_APP_API_URL + "star.png"}
            />
        );

        const stars = [];
        for (let i = 0; i < reRating; i++) {
            stars.push(<div key={`star-${i}`}>{filledStar}</div>);
        }

        for (let i = reRating; i < maxRating; i++) {
            stars.push(<div key={`star-${i}`}>{emptyStar}</div>);
        }

        return stars;
    };

    if (loading) {
        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Сторінка замовлень користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <h1 className="fs-1 mt-4 mb-5">Замовлення користувача</h1>
                <div className="container-spinner">
                    <div className="load-spinner"></div>
                </div>
            </>
        )
    }

    if (order.statusCode === 408) {
        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Сторінка замовлень користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <h1 className="fs-1 mt-4 mb-5">Замовлення користувача</h1>
                <div style={{minHeight: "60vh"}}>
                    <div>Помилка, час очікування відповіді минув, перезавантажте сторінку</div>
                </div>
                <aside>
                    <OldViews/>
                </aside>
            </>
        )
    }

    if (!order.length) {
        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Сторінка замовлень користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <h1 className="fs-1 mt-4 mb-5">Замовлення користувача</h1>
                <div className="d-flex justify-content-center align-items-center text-muted notOrders">
                    <div>
                        У вас поки немає замовлень
                        <Image
                            className="ms-1 opacity-75"
                            src={process.env.REACT_APP_API_URL + "pngegg.png"}
                            width={40}
                            height={40}
                        />
                    </div>
                </div>
                <aside>
                    <OldViews/>
                </aside>
            </>
        )
    }

    return (
        <>
            <Helmet>
                {removeDescriptionHTML()}
                <title>{`Lin-Store | Сторінка замовлень користувача`}</title>
                <meta name="description"
                      content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
            </Helmet>
            <h1 className="fs-1 mt-4 mb-5">Замовлення користувача</h1>
            <div style={{minHeight: "60vh"}}>
                <div style={{
                    fontSize: "22px",
                    marginBottom: "80px"
                }}>
                    <main>
                        {order.map((orderData, index) =>
                            <Row key={orderData._id}
                                 className="d-flex align-items-center justify-content-center flex-wrap orderData-product">
                                <Row
                                    style={{
                                        padding: "20px 0px 0px 0px"
                                    }}
                                >
                                    {orderData.orderNumber && <h3> Номер замовлення {orderData.orderNumber}</h3>}
                                    {orderData.products.map((product: IProductsActionCreator) => (
                                        <Row
                                            key={product._id}
                                            className="d-flex flex-row flex-nowrap p-0 align-items-center m-auto my-3"
                                        >
                                            <Col
                                                xs={6} sm={4} xl={3}
                                                onClick={() => {
                                                    const encodedProductName = encodeURIComponent(product.name).replace(/%20/g, '_');
                                                    history.push(DEVICE_ROUTE + "/" + encodedProductName);
                                                }}
                                            >
                                                <Image
                                                    className={`order-product-img ${orderData.isCancel && "cancelOrder"}`}
                                                    alt="image_order_icon"
                                                    src={product.img[0]}
                                                />
                                            </Col>
                                            <Col xs={6} sm={7} xl={8}>
                                                <Row
                                                    className="d-flex flex-xl-row fw-semibold flex-column order-product-info">
                                                    <Col xl={4}>
                                                        <div>{product.name}</div>
                                                        <div className="d-flex flex-row">
                                                            {checkRating(product.totalRating)}
                                                            <span
                                                                className="text-muted">{`(${product.countRating})`}</span>
                                                        </div>
                                                    </Col>
                                                    <Col xl={4} className="d-flex justify-content-xl-end">
                                                        <div className="ms-1">{product.count + ' шт.'}</div>
                                                    </Col>
                                                    <Col xl={4} className="text-xl-end">
                                                        <div>{product.price + " грн"}</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    ))}
                                </Row>
                                <Row
                                    className="d-flex justify-content-between container-order-product-status"
                                    key={orderData._id}
                                >
                                    {orderData.info &&
                                        <Col xs={12} className="px-0 d-flex flex-row oder-info">
                                            <p>Інформація про замовлення: <span className="text-muted">
                                                    {orderData.info[orderData.info.length - 1]}
                                                </span>
                                            </p>
                                        </Col>
                                    }
                                    <Col xs={6} md="5" className="p-0">
                                        {orderData.TTN &&
                                            <div className="show-status-order">Номер накладної: {orderData.TTN}</div>}
                                        <span className="show-status-order">Статус товару:</span>
                                        {orderData.status && (
                                            <Row className="py-1 ms-1 status-container">
                                                {orderData.status.map((value, index) => {
                                                        if (index <= 2) {
                                                            return (
                                                                <Row
                                                                    key={index}
                                                                    className={index === 0 ? "" : "status-item-old"}
                                                                >
                                                                    <Col xs={1}
                                                                         className="d-flex justify-content-center align-items-start">
                                                                        <Image
                                                                            className="mt-1"
                                                                            alt="image_success"
                                                                            width={20}
                                                                            height={20}
                                                                            src={process.env.REACT_APP_API_URL + "checkSuccess.png"}
                                                                        />
                                                                    </Col>
                                                                    <Col className="px-0">
                                                                        {value}
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        } else {
                                                            return
                                                        }
                                                    }
                                                )}
                                                <div
                                                    className="status-item status-item-hide"
                                                >
                                                    {orderData.status.map((value, index) => {
                                                        if (index <= 2) {
                                                            return
                                                        } else {
                                                            return (
                                                                <Row
                                                                    key={index}
                                                                    className={"status-item-old"}
                                                                >
                                                                    <Col xs={1}
                                                                         className="d-flex justify-content-center align-items-start">
                                                                        <Image
                                                                            className="mt-1"
                                                                            alt="image_success"
                                                                            width={20}
                                                                            height={20}
                                                                            src={process.env.REACT_APP_API_URL + "checkSuccess.png"}
                                                                        />
                                                                    </Col>
                                                                    <Col className="px-0">
                                                                        {value}
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                                <div
                                                    onClick={handleDropdownStatus}
                                                    className="container-showHistory"
                                                >
                                                    <Image
                                                        className="img-showHistory"
                                                        alt="image_show_history"
                                                        width={20}
                                                        height={20}
                                                        src={process.env.REACT_APP_API_URL + "arrow-down-sign-to-navigate.png"}
                                                    />
                                                </div>
                                            </Row>
                                        )}
                                    </Col>
                                    <Col xs={6} md="6" className="text-end container-track-info">
                                        <div className="mt-2">
                                            {`Очікувана дата доставки: ${orderData.resultStatus.deliveryData}`}
                                        </div>
                                        <div className="mt-2">
                                            {`Повна вартість замовлення: ${orderData.price + +orderData.resultStatus.deliveryCost} грн.`}
                                        </div>
                                        <div className="mt-2">
                                            {`${orderData.resultStatus.warehouseRecipient}`}
                                        </div>
                                        <Button
                                            size={"lg"}
                                            disabled={orderData.isCancel || false}
                                            variant="outline-dark"
                                            onMouseDown={async () => {
                                                if (isFetching) {
                                                    return false
                                                }
                                                setIsFetching(true);
                                                try {
                                                    const response = await cancelOrder(orderData.TTN, orderData.orderNumber)
                                                    if (response === "ok") {
                                                        setFetchCancelOrder(response + Math.random());
                                                    }
                                                } catch (e) {
                                                    setErrorMessage({
                                                        errorTitle: "Помилка виконання",
                                                        errorData: "Виникла помилка при скасуванні замовлення"
                                                    });
                                                    setShowAlertDis(true);
                                                } finally {
                                                    setIsFetching(false);
                                                }
                                            }}
                                        >
                                            {orderData.isCancel ? "Скасовано" : "Скасувати"}
                                        </Button>
                                    </Col>
                                </Row>
                            </Row>
                        )}
                    </main>
                </div>
            </div>
            <aside>
                <OldViews/>
            </aside>
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

export default Order;