import React, {useEffect, useRef, useState} from 'react';
import {FC} from "react/index";
import {Button, Col, Form, Image, Row} from "react-bootstrap";
import {fetchProducts} from "../store/reducers/ProductsActionCreator";
import {UseAppDispatch} from "../hooks/redux";
import "../moduleCSS/SearchComponent.css"
import {ProductItemsSlice} from "../store/reducers/ProductItemsSlice";
import {shortSearch} from "../http/searchAPI";
import {DEVICE_ROUTE, MAIN_ROUTE} from "../utils/consts";
import {useHistory, useLocation} from "react-router-dom";
import {TypesFilterSlice} from "../store/reducers/FilterSlice";
import {escapeFunc} from "../http/escapeApi";
import AlertDismissible from "./AlertDismissible";
import {IErrorMessage} from "../models/ISelectedDevice";
const {setSearchValue, productsPage, productsTypeId, productsBrandId} = ProductItemsSlice.actions;
const {selectSortPrice} = TypesFilterSlice.actions;

const SearchComponent:FC = () => {

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResult, setSearchResult] = useState<[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [selectSearch, setSelectSearch] = useState<null | number>(null);
    const [showAlertDis, setShowAlertDis] = useState(false);
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>({errorTitle: "", errorData: ""})

    const dispatch = UseAppDispatch();
    const history = useHistory();
    const location = useLocation();
    const inputRef = useRef(null);

    const throttleTimeout = useRef<number | null>(null);

    const throttleFetch = async (searchTerm: string) => {
        if (throttleTimeout.current) {
            clearTimeout(throttleTimeout.current);
        }

        throttleTimeout.current = setTimeout(async () => {
            await shortSearch(searchTerm).then((result) => setSearchResult(result));
        }, 140);
    };

    useEffect(() => {
        (async () => {
            if (searchTerm.trim() !== '') {
                await throttleFetch(searchTerm.trim());
            }
            setSelectSearch(null);
        })();
    }, [searchTerm]);

    const onClickHandler = async (searchTerm: string) => {
        if (searchTerm.trim().length === 0) {
            return false
        }
        setSearchTerm(searchTerm.trim());
        setSelectSearch(null)
        dispatch(setSearchValue(searchTerm.trim()));
        await dispatch(fetchProducts(searchTerm.trim(), 1, 25, null, null, null, null, null));
        dispatch(productsPage(1));
        dispatch(productsTypeId({name: "Категории", _id: null}));
        dispatch(productsBrandId({name: "Бренды", _id: null}));
        dispatch(selectSortPrice(null));
        if (location.pathname !== MAIN_ROUTE) {
            history.push(MAIN_ROUTE.replace(':p?', "p=1").replace(':brand?', "brand=_").replace(':type?', "type=_").replace(':search?', searchTerm.length !== 0 ? "search=" + encodeURIComponent(searchTerm).replace(/%20/g, '_') : "search=_"));
        }
    }

    const onFocusHandler = () => {
        setIsFocused(true);
        setSelectSearch(null)
    };

    const onBlurHandler = () => {
        setTimeout(() => {
            setIsFocused(false);
            inputRef.current.blur();
            setSelectSearch(null)
        }, 100);
    };

    const handleListKeyDown = async (e) => {
        if ( e.key === "ArrowLeft" || e.key === "ArrowRight") {
            return false;
        }

        if ( e.key === "Enter" ) {
            e.preventDefault();
            await handleOnSubmit(e);
            return false;
        }

        if (selectSearch == null) {
            if ( e.key === "ArrowUp" ) {
                e.preventDefault();
                setSelectSearch(searchResult.length - 1);
            }
            if ( e.key === "ArrowDown" ) {
                e.preventDefault();
                setSelectSearch(0);
            }
            return false;
        }

        if ( e.key === "ArrowUp" && selectSearch === 0 ) {
            e.preventDefault();
            setSelectSearch(null);
            return false;
        }

        if ( e.key === "ArrowDown" && selectSearch === searchResult.length - 1 ) {
            e.preventDefault();
            setSelectSearch(null);
            return false;
        }

        if (e.key === "ArrowUp" && selectSearch > 0) {
            e.preventDefault();
            setSelectSearch(prevState => prevState - 1);
        } else if (e.key === "ArrowDown" && selectSearch < searchResult.length - 1) {
            e.preventDefault();
            setSelectSearch(prevState => prevState + 1);
        }
    };

    const handleOnSubmit = async (e) => {
        try {
            const searchValue = searchResult[selectSearch]
            if (searchValue === undefined) {
                await dispatch(fetchProducts(searchTerm.trim(), 1, 25, null, null, null, null, null));
                dispatch(productsTypeId({name: "Категории", _id: null}));
                dispatch(productsBrandId({name: "Бренды", _id: null}));
                dispatch(selectSortPrice(null));
                dispatch(setSearchValue(searchTerm.trim()));
                dispatch(productsPage(1));
                if (location.pathname !== MAIN_ROUTE) {
                    history.push(MAIN_ROUTE.replace(':p?', "p=1").replace(':brand?', "brand=_").replace(':type?', "type=_").replace(':search?', searchTerm.length !== 0 ? "search=" + encodeURIComponent(searchTerm).replace(/%20/g, '_') : "search=_"));
                }
                setSelectSearch(null)
                onBlurHandler();
                e.preventDefault();
            } else if (!searchValue.img) {
                await onClickHandler(searchValue.name);
                onBlurHandler();
                e.preventDefault();
            } else {
                await history.push(DEVICE_ROUTE + "/" + searchValue.name);
                onBlurHandler();
                e.preventDefault();
            }
        } catch (e) {
            setErrorMessage({
                errorTitle: "Помилка дії",
                errorData: "Сталася помилка під час пошуку"
            });
            setShowAlertDis(true);
        }
    }

    const checkRating = (rating: number) => {
        const maxRating = 5; // Максимальный рейтинг
        const reRating = Math.round(rating)

        const filledStar = (
            <Image
                className="product-filledStar"
                alt="image_filled-star"
                key="filled"
                src={process.env.REACT_APP_API_URL + "fullstar.png"}
            />
        );

        const emptyStar = (
            <Image
                className="product-emptyStar"
                alt="image_empty-star"
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
    }

    return (
        <>
            <Form.Control
                type="search"
                placeholder="Пошук товару"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(escapeFunc(e.target.value))
                }}
                className="me-1 form-control-search"
                aria-label="Search"
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onKeyDown={handleListKeyDown}
                ref={inputRef}
            />
            {isFocused && searchResult.length > 0 && (
                <div
                    style={{
                        position: 'fixed',
                        top: '10%',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                    }}
                ></div>
            )}
            {
                isFocused && searchResult.length ? (
                    <div
                        className="search-result-container"
                    >
                        {searchResult.map((value, index) => (
                            <Row
                                key={value._id}
                                style={selectSearch === index ? {
                                    backgroundColor: "#f1f1f1",
                                    margin: "initial",
                                } : {}}
                                className="p-2 hover-search-element"
                            >
                                {value.img ? (
                                        <Col
                                            onMouseDown={async () => {
                                                history.push(DEVICE_ROUTE + "/" + value.name);
                                            }}
                                        >
                                            <Row>
                                                <Col>
                                                    <Image
                                                        width={65}
                                                        height={65}
                                                        src={value.img[0]}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Row className="d-flex flex-column">
                                                        <Col className="fw-semibold">
                                                            {value.name}
                                                        </Col>
                                                        <Col className="d-flex">
                                                            {checkRating(value.totalRating)}
                                                        </Col>
                                                        <Col className="text-muted">
                                                            {`${value.price} грн`}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    ) :
                                    <>
                                        <Col
                                            onMouseDown={async () => await onClickHandler(value.name)}
                                            className="fs-5 text-muted"
                                        >
                                            <Image
                                                src={process.env.REACT_APP_API_URL + "search.png"}
                                                alt="image_search_icon"
                                                width={23}
                                                height={23}
                                                className="me-2"
                                            />
                                            {value.name}
                                        </Col>
                                    </>
                                }
                            </Row>
                        ))}
                    </div>
                ) : (
                    ""
                )
            }
            <Button
                className="button-search-navBar"
                onClick={async () => await onClickHandler(searchTerm.trim())}
                variant="outline-success"
                aria-label="search"
            >
                Знайти
            </Button>
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

export default SearchComponent;