import React, {useEffect, useRef, useState} from 'react';
import {FC} from "react/index";
import {useHistory} from "react-router-dom"
import {Button, Card, Col, Image, Row} from "react-bootstrap";
import {DEVICE_ROUTE, LOGIN_ROUTE} from "../utils/consts";
import {IProductsActionCreator} from "../models/IProductsActionCreator";
import {addBasket} from "../http/basketApi";
import {UseAppSelector} from "../hooks/redux";
import AlertBasket from "./AlertBasket";
import "../moduleCSS/Product.css";
import "../moduleCSS/LoadSpiner.css";

const Product:FC<IProductsActionCreator> = (
    {_id, img, name, price,
    count, colors,
    totalRating, countRating,
    shortDescription, countSales}) => {

    const isAuth = UseAppSelector(state => state.UserCheckSlice.isAuth);

    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const [message, setMessage] = useState<string>('');
    const [show, setShow] = useState<boolean>(false)
    const target = useRef(null);
    const [lengthShortDesc, setLengthShortDesc] = useState('');

    useEffect(() => {
        if (shortDescription.length > 55) {
            setLengthShortDesc(shortDescription.slice(0, 64) + "...");
        } else {
            setLengthShortDesc(shortDescription);
        }
    }, [shortDescription])

    const history = useHistory();
    const clickHandler = (id: string, color: string) => {
        (async () => {
            if (isAuth) {
                const dataBasket = await addBasket(id, color);
                setMessage(dataBasket);
                setShow(true);
                setTimeout(() => setShow(false), 2400)
            } else {
                history.push(LOGIN_ROUTE);
            }
        })()
    }

    const checkCount = colors.find( item => item.count !== 0)

    const checkRating = (rating: number) => {
        const maxRating = 5; // Максимальный рейтинг
        const reRating = Math.round(rating)

        const filledStar = (
            <Image
                className="product-filledStar"
                key="filled"
                alt="image_filled_star"
                src={process.env.REACT_APP_API_URL + "fullstar.png"}
            />
        );

        const emptyStar = (
            <Image
                className="product-emptyStar"
                alt="image_empty_star"
                key="empty"
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

    return (
        <Col
            as="article"
            role="article"
            xs={12} sm={4} md={4} lg={3} xl={3}
            className="container-card-body-product"
        >
            <Card onClick={async () => {
                const encodedProductName = encodeURIComponent(name).replace(/%20/g, '_');
                history.push(DEVICE_ROUTE + "/" + encodedProductName);
            }}
            className="card-product"
            >
                    <Card.Img
                        className={`card-img-product ${count !== 0 ? "" : "card-img-product-noActive"}`}
                        onLoad={handleImageLoad}
                        style={!imageLoaded ? {display: "none"} : {}}
                        alt="product_image"
                        src={`${img}`}
                    />
                {!imageLoaded ?
                    <div className={"card-img-product container-spinner-product"}>
                        <div className={"load-spinner"}></div>
                    </div>
                    :
                    null
                }

                <Card.Body className="card-body-product">
                <Row
                            className="d-flex justify-content-between align-content-center my-1 card-body-product-centered"
                            as="header"
                            role="rowheader"
                        >
                            <Col sm={8} xs={12}>{name}</Col>
                            <Col sm={4} xs={12} className="text-end default-product-price">{`${price} грн.`}</Col>
                        </Row>
                        <Row>
                            <Col
                                className="text-muted card-product-shortDesc"
                            >
                                {lengthShortDesc}
                            </Col>
                        </Row>
                        <Row className="d-flex align-items-center">
                            <Col className="d-flex my-1">
                                {checkRating(totalRating)}
                                <span className="text-muted ms-1">{`(${countRating})`}</span>
                            </Col>
                            {countSales !== 0 ?
                                <Col xl={5} xs={12} className="text-muted fw-semibold fs-6">{`продажів ${countSales}`}</Col>
                                : ""
                            }
                        </Row>
                        <Row>
                            <Col sm={4} xs={12} className="text-end small-screen-product-price">{`${price} грн.`}</Col>
                            <Col className="d-flex justify-content-end">
                                { checkCount !== undefined ?
                                    colors[0].count !== 0 ? <Button
                                        ref={target}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clickHandler(_id, colors[0].color);
                                        }}
                                        variant="outline-dark"
                                        size="lg"
                                        className="d-flex align-items-center button-add-basket"
                                    > В кошик
                                        <Image
                                            className="ms-2"
                                            width={25}
                                            height={25}
                                            src={process.env.REACT_APP_API_URL + 'add-to-basket.png'}
                                        />
                                    </Button>
                                    : <p className="info-notAvailable">Доступні інші кольори</p>
                                    : <p className="info-notAvailable">Немає в наявності</p>
                                }
                            </Col>
                        </Row>
                    </Card.Body>
            </Card>
            <AlertBasket
                show={show}
                message={message}
                target={target}
            />
        </Col>
    );
};

export default Product;