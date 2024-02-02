import React, {useEffect, useState} from 'react';
import {FC} from "react/index";
import {dropBasket, getBasket} from "../http/basketApi";
import {IProductsActionCreator} from "../models/IProductsActionCreator";
import {Button, ButtonGroup, Col, Image, Navbar, Row} from "react-bootstrap";
import {DEVICE_ROUTE} from "../utils/consts";
import {AppSlice} from "../store/reducers/AppSlice";
import { Helmet } from 'react-helmet';
import {useHistory} from "react-router-dom";
import {UseAppDispatch} from "../hooks/redux";
import AlertCreateOrder from "../components/AlertCreateOrder";
import OldViews from "../components/OldViews";
import ModalPostalComponent from "../components/ModalPostalComponent";
import "../moduleCSS/LoadSpiner.css";
import "../moduleCSS/Basket.css"
import AlertDismissible from "../components/AlertDismissible";
import {IErrorMessage} from "../models/ISelectedDevice";
const {loadingApp} = AppSlice.actions;


export interface ISelectCount {
    selectedCount: number,
    name: string,
    img: string[],
    isActive: boolean,
    _id: string,
    countProduct: number,
    countedPrice: number,
    price: number
}

const Basket:FC = () => {
    const [basket, setBasket] = useState<IProductsActionCreator[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCountProduct, setSelectedCountProduct] = useState<ISelectCount[]>([])
    const [selectedProducts, setSelectedProducts] = useState<ISelectCount[]>([])
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);
    const [showAlertDis, setShowAlertDis] = useState(false);
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>({errorTitle: "", errorData: ""})
    const [showPostal, setShowPostal] = useState<boolean>(false);

    const history = useHistory();
    const dispatch = UseAppDispatch();

    const checkRating = (rating: number) => {
        const maxRating = 5;
        const reRating = Math.round(rating)

        const filledStar = (
            <Image
                className="rating-filledStar"
                key="filled"
                alt="image_filled_star"
                width={20}
                height={20}
                src={process.env.REACT_APP_API_URL + "fullstar.png"}
            />
        );

        const emptyStar = (
            <Image
                className="rating-emptyStar"
                key="empty"
                alt="image_empty_star"
                width={18}
                height={18}
                src={process.env.REACT_APP_API_URL + "star.png"}
            />
        );

        const stars = [];
        for (let i = 0; i < reRating; i++) {
            stars.push(<div className="star-content" key={`star-${i}`}>{filledStar}</div>);
        }

        for (let i = reRating; i < maxRating; i++) {
            stars.push(<div className="star-content" key={`star-${i}`}>{emptyStar}</div>);
        }

        return stars;
    };

    const showAlert = async () => {
        setShow(true);
        const promise = new Promise<void>((resolve) => {
            setTimeout(() => {
                setShowPostal(false);
                setShow(false);
                resolve();
            }, 2500);
        });
        return await promise;
    }

    const loadBasketPage = async () => {
        try {
            const response = await getBasket();
            if (response === "не авторизован") {
                dispatch(loadingApp());
                window.location.reload();
            }
            setBasket(response);

            setTotalPrice(0);
            setLoading(false);
            setSelectedCountProduct(response.map((value) =>
                ({
                    name: value.name,
                    img: value.img[0],
                    isActive: value.isActive,
                    selectedCount: 0,
                    _id: value._id,
                    selectedColor: value.selectedColor,
                    countProduct: value.colors.find( item => item.color === value.selectedColor).count,
                    countedPrice: 0,
                    price: value.price
                })))
        } catch (error) {
            setErrorMessage({
                errorTitle: "Виникла помилка",
                errorData: "Помилка завантаження кошика, перезавантажте сторінку"
            });
            setShowAlertDis(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => await loadBasketPage())()
    }, []);

    const basketHandler = async (id: string, color: string) => {
        try {
            const response = await dropBasket(id, color);
            if (response === "не авторизован") {
                dispatch(loadingApp());
                window.location.reload();
            }

            setBasket((prevBasket) => prevBasket.filter((product) => product._id !== id));
            const reProductList: ISelectCount[] = [...selectedCountProduct].filter(value => value._id !== id);
            const reTotalPrice: number = [...selectedCountProduct].find(value => value._id == id).countedPrice;

            setTotalPrice((prevState) => prevState - reTotalPrice)
            setSelectedCountProduct(reProductList)
        } catch (error) {
            setErrorMessage({
                errorTitle: "Помилка дії",
                errorData: "Виникла помилка при видаленні товару з кошика"
            });
            setShowAlertDis(true);
        }
    };

    const reProductList = (selectedProducts: ISelectCount[]): ISelectCount[] => {
        return [...selectedProducts].filter((value) => value.selectedCount !== 0);
    }

        const onClickHandler = async () => {
            await showAlert().then( result => {
                setLoading(true);
                loadBasketPage();
            })
        }

    const incrCountTotalPrice = (value: ISelectCount) => {
        value.countedPrice = value.price * value.selectedCount;
        setTotalPrice((prevState) => prevState + value.price);
        return value.countedPrice;
    }

    const decrCountTotalPrice = (value: ISelectCount) => {
        value.countedPrice = value.price * value.selectedCount;
        setTotalPrice((prevState) => prevState - value.price);
        return value.countedPrice;
    }

    const handlerOnIncrementCount = (index: number) => {
        const reSelectCount: ISelectCount[] = [...selectedCountProduct];
        const current = reSelectCount[index];
        if (current.countProduct !== current.selectedCount) {
            current.selectedCount += 1;
            current.countedPrice = incrCountTotalPrice(current);
        } else {
            return false
        }
        setSelectedCountProduct(reSelectCount);
    }

    const handlerOnDecrementCount = (index: number) => {
        const reSelectCount: ISelectCount[] = [...selectedCountProduct];
        const current = reSelectCount[index];
        if (current.selectedCount > 0) {
            reSelectCount[index].selectedCount -= 1;
            current.countedPrice = decrCountTotalPrice(current);
        } else {
            return false
        }
        setSelectedCountProduct(reSelectCount);
    }

    const removeDescriptionHTML = () => {
        const existingDescription = document.head.querySelector('meta[name="description"]');
        if (existingDescription) {
            document.head.removeChild(existingDescription);
        }
    }

    if (loading) {
        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Завантаження сторінки кошика користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store – різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <h1 className="fs-1 mt-4 mb-5">Кошик користувача</h1>
                <div className="container-spinner">
                    <div className="load-spinner"></div>
                </div>
            </>
        )
    }

    if (!basket.length) {
        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Завантаження сторінки кошика користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <h1 className="fs-1 mt-4 mb-5">Кошик користувача</h1>
                <div className="d-flex justify-content-center align-items-center text-muted empty-basket">
                    Кошик порожній
                    <Image
                        className="ms-1 opacity-75"
                        src={process.env.REACT_APP_API_URL + "pngegg.png"}
                        width={40}
                        height={40}
                    />
                </div>
                <OldViews/>
            </>
        );
    }

    return (
        <>
            <Helmet>
                {removeDescriptionHTML()}
                <title>{`Lin-Store | Сторінка кошика користувача`}</title>
                <meta name="description"
                      content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
            </Helmet>
            <h1 className="fs-1 mt-4 mb-5">Кошик користувача</h1>
            <section
                className="container-basket-page"
            > {show && <AlertCreateOrder/>}
                <main>
                    {basket.map((product: IProductsActionCreator, index) => (
                        <React.Fragment key={index}>
                            <Row
                                as="article"
                                role='article'
                                key={product._id} className="d-flex align-items-center flex-nowrap my-4 mx-auto basket-item"
                            >
                                <Col xs="3" className="container-basket-img">
                                    <Image
                                        className="basket-item-img"
                                        alt="image_basket_icon"
                                        onClick={() => {
                                            try {
                                                const encodedProductName = encodeURIComponent(product.name).replace(/%20/g, '_');
                                                history.push(DEVICE_ROUTE + "/" + encodedProductName);
                                            } catch (e) {
                                                setErrorMessage({
                                                    errorTitle: "Помилка дії",
                                                    errorData: "сталася помилка при перенаправленні користувача"
                                                });
                                                setShowAlertDis(true);
                                            }
                                        }}
                                        src={product.img[0]}
                                    />
                                </Col>
                                <Col
                                    xs="3"
                                >
                                    <Row
                                        style={{cursor: "pointer"}}
                                        onClick={() => history.push(DEVICE_ROUTE + "/" + product._id)}
                                        className="d-flex flex-column"
                                    >
                                        <Col className="basket-item-name">
                                            <div role="rowheader">{`${product.name} (${product.selectedColor})`}</div>
                                        </Col>
                                        <Col className="d-flex align-items-center container-totalRating">
                                            {checkRating(product.totalRating)}
                                            <span className="ms-2">{`(${product.countRating})`}</span>
                                        </Col>
                                        <Col className="text-muted basket-item-desc">
                                            {product.shortDescription}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs="3" className="d-flex flex-column align-items-center justify-content-between">
                                    <ButtonGroup size="lg" aria-label="Basic example">
                                        <Button onClick={() => {
                                            handlerOnDecrementCount(index)
                                        }} variant="outline-dark">-</Button>
                                        <Button disabled
                                                variant="outline-dark">{selectedCountProduct[index].selectedCount}</Button>
                                        <Button onClick={() => {
                                            handlerOnIncrementCount(index)
                                        }} variant="outline-dark">+</Button>
                                    </ButtonGroup>
                                    <div className="ms-1 my-2 basket-item-count">
                                        {product.colors.find(item =>
                                            item.color === product.selectedColor).count + ' залишилося'
                                        }
                                    </div>
                                </Col>
                                <Col xs="2" className="text-center basket-item-price">
                                    <div>{product.price + " грн"}</div>
                                </Col>
                                <Col
                                    xs="1"
                                    onClick={ async () => {
                                        try {
                                            await basketHandler(product._id, product.selectedColor)
                                        } catch (e) {
                                            setErrorMessage({
                                                errorTitle: "Виникла помилка",
                                                errorData: "Сталася помилка обробки товару, ймовірно, ми не можемо обробити цей товар."
                                            });
                                            setShowAlertDis(true);
                                        }
                                    }}
                                    // style={{cursor: "pointer"}}
                                    className="d-flex align-items-center flex-column container-basket-drop"
                                >
                                    <Image
                                        className="basket-item-drop-img"
                                        alt="image_trash_drop_icon"
                                        width={50}
                                        height={50}
                                        src={process.env.REACT_APP_API_URL + "trash.png"}
                                    />
                                    <div>видалити</div>
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))}
                </main>
                <article>
                    <Navbar
                        expand={"lg"}
                        className="bg-body-tertiary"
                        fixed="bottom"
                        style={{
                            padding: '1% 5%',
                            fontWeight: "600"
                        }}>
                        <div
                            className="d-flex flex-nowrap align-items-center justify-content-end"
                            style={{
                                width: "100%"
                            }}
                        >
                            <div className="mx-5">{`Поточна сума: ${totalPrice} грн.`}</div>
                            <Button
                                disabled={!totalPrice}
                                style={{borderRadius: 50}}
                                onClick={() => {
                                    try {
                                        const reProductList: ISelectCount[] = [...selectedCountProduct].filter((value) => value.selectedCount !== 0);
                                        setSelectedProducts(reProductList)
                                        setShowPostal(true)
                                    } catch (e) {
                                        setErrorMessage({
                                            errorTitle: "Помилка виконання",
                                            errorData: "Сталася помилка, ймовірно, ви вибрали відсутній товар на складі"
                                        });
                                        setShowAlertDis(true);
                                    }
                                }}
                                size="lg"
                                variant="outline-dark">
                                Перейти до створення замовлення
                            </Button>
                        </div>
                    </Navbar>
                </article>
            </section>
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
            <article>
                <ModalPostalComponent
                    show={showPostal}
                    totalPrice={totalPrice}
                    reProductList={() => reProductList(selectedProducts)}
                    onHide={() => setShowPostal(false)}
                    onClickHandler={async () => {
                        await onClickHandler()
                    }}
                />
            </article>
        </>
    );
};

export default Basket;