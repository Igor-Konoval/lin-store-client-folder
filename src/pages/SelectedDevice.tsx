import React, {useEffect, useRef, useState} from 'react';
import {FC} from "react/index";
import {Accordion, Button, Col, Image, Row} from "react-bootstrap";
import {IProductsActionCreator} from "../models/IProductsActionCreator";
import {useHistory, useParams} from "react-router-dom";
import {UseAppSelector} from "../hooks/redux";
import { Helmet } from 'react-helmet';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CreateComment from "../components/CreateComment";
import {getAllComments, IGetAllComments} from "../http/commentApi";
import CreateResponseComment from "../components/CreateResponseComment";
import {getUsername} from "../http/userAPI";
import {AppSlice} from "../store/reducers/AppSlice";
import RemoveComment from "../components/RemoveComment";
import ChangeComment from "../components/ChangeComment";
import RatingStar from "../components/RatingStar";
import AlertDismissible from "../components/AlertDismissible";
import {addBasket} from "../http/basketApi";
import "../moduleCSS/SaveList.css"
import {checkIdSaveList, selectIdSaveList} from "../http/saveListAPI";
import AlertBasket from "../components/AlertBasket";
import "../moduleCSS/SelectedDevice.css"
import OldViews from "../components/OldViews";
import "../moduleCSS/LoadSpiner.css";
import {BASKET_ROUTE, LOGIN_ROUTE, MAIN_ROUTE} from "../utils/consts";
import {IColors} from "../models/IDescription";
import {IErrorMessage} from "../models/ISelectedDevice";
import {UseAppDispatch} from "../hooks/redux";
import {
    addProductAuthOldViews,
    addProductLocalOldViews,
    updateAuthOldViews, updateLocalOldViews
} from "../store/reducers/OldViewsActionCreator";
import {$publicHost} from "../http/interceptors";

const SelectedDevice: FC = () => {
    const oldViewsProducts = UseAppSelector( state => state.OldViewsSlice.products );
    const [userData, setUserData] = useState(null);
    const [commentUserId, setCommentUserId] = useState<string>('');
    const [showModalResponse, setShowModalResponse] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalChangeComment, setShowModalChangeComment] = useState<boolean>(false);
    const [product, setProduct] = useState<IProductsActionCreator>();
    const [commentsProduct, setCommentsProduct] = useState<IGetAllComments[]>([]);
    const [loadComment, setLoadComments] = useState<boolean>(true)
    const [loadingProductData, setLoadingProductData] = useState<boolean>(true);
    const [toggleShowResponseComments, setToggleShowResponseComments] = useState<boolean[]>([]);
    const [toggleShowRemoveComment, setToggleShowRemoveComment] = useState<boolean>(false);
    const [changeCommentData, setChangeCommentData] = useState<string>('');
    const [showAlertDis, setShowAlertDis] = useState(false);
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>({errorTitle: "", errorData: ""})
    const [selectComUId, setSelectComUId] = useState<string>('')
    const [showResponseToggle, setShowResponseToggle] = useState<boolean>(false);
    const [isSaveList, setIsSaveList] = useState<boolean>(false);
    const [showAlert,setShowAlert] = useState<boolean>(false);
    const [message,setMessage] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<string[]>([]);
    const [countImgSlide, setCountImgSlide] = useState<number>(7)
    const [selectedColor, setSelectedColor] = useState<IColors | null>(null);
    const [mainCommentUserId, setMainCommentUserId] = useState<string>('');
    const [typeProduct, setTypeProduct] = useState<string>('');
    const [brandProduct, setBrandProduct] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const dispatch = UseAppDispatch();

    const target = useRef(null);

    const auth = UseAppSelector(state => state.UserCheckSlice.isAuth);
    const types = UseAppSelector(state => state.TypesFilterSlice.filters);
    const brands = UseAppSelector(state => state.BrandsFilterSlice.filters);
    const history = useHistory();

    const {productName} = useParams();

    const posTarget = useRef(null);
    const heightTarget = useRef(null);

    const getProductById = async (productName: string) => {
        const response = await $publicHost.get<IProductsActionCreator>(`product/${productName.split("_").join(" ")}`);
        return response.data;
    };

    const getProductSelect = UseAppSelector(state => state.ProductItemsSlice.products).find(product => productName.split("_").join(" ") === product.name);

    useEffect(() => {
        const handlePopState = () => {
            window.scrollTo({
                top: 0
            });
            scrollHandler()
        }
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        (async () => {
            window.scrollTo({
                top: 0
            });
            setLoadingProductData(true)

            if (getProductSelect) {
                setProduct(getProductSelect);
                setTypeProduct(types.find( value => value._id === getProductSelect.typeId).name)
                setBrandProduct(brands.find( value => value._id === getProductSelect.brandId).name)
                await addProductHandler(getProductSelect)
                const validColor = getProductSelect.colors.find( color => color.count > 0);
                if (validColor) {
                    setSelectedColor(validColor);
                } else {
                    setSelectedColor(null)
                }
                const comments = await getAllComments(getProductSelect._id)
                setCommentsProduct(comments)
                const arrResponseComments: boolean[] = [];
                comments.forEach( value => arrResponseComments.push(false))
                setToggleShowResponseComments(arrResponseComments)
                await checkIdSaveList(getProductSelect._id).then( data => setIsSaveList(data));
                setLoadComments(false);
                setLoadingProductData(false)
                scrollHandler()
            } else {
                const existingDescription = document.head.querySelector('meta[name="description"]');
                if (existingDescription) {
                    document.head.removeChild(existingDescription);
                }
                getProductById(productName.split("_").join(" ")).then(async product => {
                    setProduct(product);
                    setTypeProduct(product.typeId)
                    setBrandProduct(product.brandId)
                    await addProductHandler(product);
                    const comments = await getAllComments(product._id)
                    setCommentsProduct(comments)
                    const arrResponseComments: boolean[] = [];
                    comments.forEach( value => arrResponseComments.push(false))
                    setToggleShowResponseComments(arrResponseComments)
                    await checkIdSaveList(product._id).then( data => setIsSaveList(data));
                    setLoadComments(false);
                    setLoadingProductData(false)
                    const validColor = product.colors.find( color => color.count > 0);
                    if (validColor) {
                        setSelectedColor(validColor);
                    } else {
                        setSelectedColor(null)
                    }
                    scrollHandler()
                }).catch(e => history.push(MAIN_ROUTE));
            }
        })()
    }, [productName]);

    useEffect(() => {
        (async () => {
            const userData = await getUsername()
            setUserData(userData)
        })()
    },[])

    const handleImageClick = (imageUrl: string) => {
        if (!loadedImages.includes(imageUrl)) {
            setLoadedImages([...loadedImages, imageUrl]);
        }
        setSelectedImage(imageUrl);
    };

    const scrollHandler = () => {
        if (!heightTarget.current) {
            return;
        }
        if (document.documentElement.clientWidth <= 740) {
            return;
        }

        const currentHeight = getComputedStyle(heightTarget.current).height.slice(0, -2);
        const bottomComponent = posTarget.current.offsetHeight;

        if ((bottomComponent + window.scrollY) >= currentHeight) {
            if (posTarget.current.classList.contains("sideInfoAbsolute-device")) {
                return false;
            } else {
                posTarget.current.className = "sideInfoAbsolute-device";
                return false;
            }
        } else {
            if (posTarget.current.classList.contains("sideInfoAbsolute-device")) {
                posTarget.current.className = "sideInfoFixed-device";
                return false;
            } else {
                return false;
            }
        }
    }

    function calculateCountImg(): 7 | 5 {
        const windowWidth = window.innerWidth;
        return windowWidth >= 1100 ? 7 : (windowWidth >= 768 ? 5 : (windowWidth >= 500 ? 7 : 4));
    }

    useEffect(() => {
        function handleResizeCountImg() {
            setCountImgSlide(calculateCountImg());
        }

        window.addEventListener('resize', handleResizeCountImg);
        window.addEventListener('scroll', scrollHandler);
        return () => {
            window.removeEventListener('scroll', scrollHandler);
            window.removeEventListener('resize', handleResizeCountImg);
        }
    }, [])

    if (!product) {
        return (
            <div className="container-spinner">
                <div className="load-spinner"></div>
            </div>
        )
    }

    const checkRating = (rating: number) => {
        const maxRating = 5;

        const filledStar = (
            <Image
                key="filled"
                alt="image_filled_star"
                width={20}
                height={20}
                src={process.env.REACT_APP_API_URL + "fullstar.png"}
            />
        );

        const emptyStar = (
            <Image
                key="empty"
                alt="image_empty_star"
                width={18}
                height={18}
                src={process.env.REACT_APP_API_URL + "star.png"}
            />
        );

        const stars = [];
        const reRating = Math.round(rating)
        for (let i = 0; i < reRating; i++) {
            stars.push(<div key={`star-${i}`}>{filledStar}</div>);
        }

        for (let i = reRating; i < maxRating; i++) {
            stars.push(<div key={`star-${i}`}>{emptyStar}</div>);
        }

        return stars;
    };

    const handlerSelectSaveList = async () => {
        if (!auth) {
            history.push(LOGIN_ROUTE);
        }
        await selectIdSaveList(product._id).then( setIsSaveList ).catch(console.log)
    }

    async function addProductHandler (product) {
        const check = oldViewsProducts.findIndex( oldProduct => oldProduct._id === product._id );

        if (check == -1) {
            if (auth) {
                await dispatch(addProductAuthOldViews(product))
            } else {
                dispatch(addProductLocalOldViews(product))
            }
            return
        }

        if (check !== 0) {
            if (auth) {
                await dispatch(updateAuthOldViews(product))
            } else {
                dispatch(updateLocalOldViews(product))
            }
            return
        }
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <>
            <Helmet>
                <title>{`Придбати ${productName.split("_").join(" ").trim()} в Lin-Store - Відмінні пропозиції за вигідною ціною!`}</title>
                <meta name="description"
                      content={`${productName.split("_").join(" ").trim()}. Зручна доставка по Україні, відгуки, рейтинг, доступний вибір квітів та цінової категорії.!`}/>
            </Helmet>
            <div
                ref={heightTarget}
                className={"body-page"}
            >
                <main>
                    <header className="pb-4 ps-3 header-type-brand">
                        <div
                            className="header-type-brand-block"
                        >
                            <h2 className="mx-2">{typeProduct}</h2>
                            / <h2 className="mx-2">{brandProduct}</h2>
                            / <h2 className="mx-2 text-black">{product.name}</h2>
                        </div>
                    </header>

                    <section>
                        <Row className="m-auto d-flex justify-content-between flex-wrap">
                            <Col
                                md={6} xs={12}
                                className="container-mainImg"
                            >
                                <Image
                                    className="main-img-product"
                                    style={!imageLoaded ? {display: "none"} : {}}
                                    alt="main_image_product"
                                    src={selectedImage || (product && product.img[0])}
                                    onLoad={handleImageLoad}
                                />
                                {!imageLoaded ?
                                    <div className={"main-img-product main-img-product-loading container-spinner-product"}>
                                        <div className={"load-spinner"}></div>
                                    </div>
                                    :
                                    null
                                }
                                <div
                                    className="container-gallery-img"
                                >
                                    <Slider {...{
                                        infinite: false,
                                        speed: 500,
                                        slidesToShow: countImgSlide,
                                        slidesToScroll: 3,
                                        arrows: true,
                                        draggable: false,
                                    }}>
                                        {product &&
                                            product.img.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`thumbnail-${index}`}
                                                    className="gallery-img-item"
                                                    onClick={() => handleImageClick(image)}
                                                />
                                            ))}
                                    </Slider>
                                </div>
                                {product.wasInUsed ?
                                    <div className="img-product-isActive">
                                        товар Б/У
                                    </div>
                                    :
                                    ""
                                }
                            </Col>
                            <Col
                                ref={posTarget}
                                md={6} xs={12}
                                className={"sideInfoFixed-device"}
                            >
                                <Row className="d-flex">
                                    <header>
                                        <h1>{product.name}</h1>
                                        <h2
                                            className="header-product-shortDescription"
                                        >
                                            {product.shortDescription}
                                        </h2>
                                        <div
                                            className="d-flex pb-1 align-items-center"
                                        >
                                            {checkRating(product.totalRating)}
                                            <div
                                                style={{
                                                    fontSize: "20px",
                                                    fontWeight: "600",
                                                    marginLeft: "5px"
                                                }}
                                            >
                                                {`(${product.countRating})`}
                                            </div>
                                        </div>
                                        <hr/>
                                        <h2 className="fs-3">{"ціна " + product.price + " грн"}</h2>
                                        <hr/>
                                        {selectedColor && <h3
                                            className="m-auto fw-normal fs-5">Вибрати колір,
                                            залишилося {selectedColor.count} шт.</h3>}
                                    </header>
                                    {
                                        loadingProductData === false ?
                                            <>
                                                <div className="d-flex flex-wrap p-0">
                                                    {product.colors.map((value, index) =>
                                                        <h4 key={index}
                                                            className={`colorImg ${value.count === 0 ? "outOfStockColorImg" : ""} ${selectedColor !== null ? (selectedColor.color === value.color ? "selectedColorImg" : "") : ''}`}
                                                            onClick={(e) => {
                                                                if (value.count === 0) {
                                                                    return false;
                                                                }
                                                                handleImageClick(value.urlImg);
                                                                setSelectedColor(value);
                                                            }}
                                                        >
                                                            {value.count === 0 ?
                                                                value.color + " закінчився" : value.color
                                                            }
                                                            <img
                                                                src={value.urlImg}
                                                                alt=""
                                                                style={{display: 'none'}}
                                                            />
                                                        </h4>
                                                    )}
                                                </div>
                                                <hr/>
                                                <Row className="pb-3 d-flex flex-wrap flex-row m-auto px-0 ps-1">
                                                    <Col className="d-flex flex-row align-items-center px-0">
                                                        <Button
                                                            onClick={handlerSelectSaveList}
                                                            variant="outline-dark"
                                                            size="lg"
                                                            className="container-save-button"
                                                        >
                                                            {isSaveList === true ?
                                                                <>в обраному
                                                                    <Image
                                                                        className="ms-2"
                                                                        alt="image_filled_heart"
                                                                        width={25}
                                                                        height={25}
                                                                        src={process.env.REACT_APP_API_URL + 'trueHeart.png'}
                                                                    /></> :
                                                                <>
                                                                    Додати в обране
                                                                    <Image
                                                                        className="ms-2"
                                                                        alt="image_hollow_heart"
                                                                        width={25}
                                                                        height={25}
                                                                        src={process.env.REACT_APP_API_URL + 'falseHeart.png'}
                                                                    />
                                                                </>
                                                            }
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <hr/>
                                                {
                                                    selectedColor !== null ?
                                                        <Row className="d-flex pt-lg-3 m-auto px-0 ps-1">
                                                            <Col className="d-flex px-0">
                                                                <Button
                                                                    variant="secondary"
                                                                    size="lg"
                                                                    className="container-button"
                                                                    onClick={async () => {
                                                                        await addBasket(product._id, selectedColor.color);
                                                                        history.push(BASKET_ROUTE)
                                                                    }}
                                                                >
                                                                    Купити зараз
                                                                    <Image
                                                                        className="ms-2 btn-img-selectedDevice"
                                                                        width={29}
                                                                        alt="image_delivery"
                                                                        height={29}
                                                                        src={process.env.REACT_APP_API_URL + 'deliveryWhite.png'}
                                                                    />
                                                                </Button>
                                                                <Button
                                                                    variant="outline-dark"
                                                                    size="lg"
                                                                    ref={target}
                                                                    className="container-button ms-3"
                                                                    onClick={async () => {
                                                                        const dataBasket = await addBasket(product._id, selectedColor.color);
                                                                        setMessage(dataBasket);
                                                                        setShowAlert(true);
                                                                        setTimeout(() => setShowAlert(false), 2400)
                                                                    }}
                                                                >
                                                                    В кошик
                                                                    <Image
                                                                        className="ms-2 btn-img-selectedDevice"
                                                                        width={25}
                                                                        height={25}
                                                                        alt="image_add_to_basket"
                                                                        src={process.env.REACT_APP_API_URL + 'add-to-basket.png'}
                                                                    />
                                                                </Button>
                                                            </Col>
                                                        </Row> :
                                                        <Row className="d-flex pt-1">
                                                            <p className="fw-600 fs-4">Немає в наявності</p>
                                                        </Row>
                                                }
                                            </>
                                            :
                                            <div className=" mt-5 small-container-spinner">
                                                <div className="load-spinner"></div>
                                            </div>
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </section>
                </main>
                <section>
                    <article>
                        <CreateComment
                            show={showModal}
                            onHide={() => setShowModal(false)}
                            productId={product._id}
                            setErrorMessage={setErrorMessage}
                            setShowAlertDis={() => setShowAlertDis(true)}
                            setCommentsProduct={setCommentsProduct}
                        />
                    </article>
                    <article>
                        <CreateResponseComment
                            show={showModalResponse}
                            onHide={() => setShowModalResponse(false)}
                            productId={product._id}
                            setShowAlertDis={() => setShowAlertDis(true)}
                            setErrorMessage={setErrorMessage}
                            commentUserId={commentUserId}
                            mainCommentUserId={mainCommentUserId}
                            setCommentsProduct={setCommentsProduct}
                        />
                    </article>
                    <article>
                        <RemoveComment
                            show={toggleShowRemoveComment}
                            showRemoveResponse={showResponseToggle}
                            onHide={() => setToggleShowRemoveComment(false)}
                            productId={product._id}
                            setShowAlertDis={() => setShowAlertDis(true)}
                            setErrorMessage={setErrorMessage}
                            commentUserId={commentUserId}
                            responseCommentUserId={selectComUId}
                            setCommentsProduct={setCommentsProduct}
                        />
                    </article>
                    <article>
                        <ChangeComment
                            show={showModalChangeComment}
                            onHide={() => setShowModalChangeComment(false)}
                            productId={product._id}
                            commentUserId={commentUserId}
                            showChangeResponse={showResponseToggle}
                            setShowAlertDis={() => setShowAlertDis(true)}
                            responseCommentUserId={selectComUId}
                            changeCommentData={changeCommentData}
                            setErrorMessage={setErrorMessage}
                            setChangeCommentData={setChangeCommentData}
                            setCommentsProduct={setCommentsProduct}
                        />
                    </article>
                </section>

                <section>
                    <article>
                        <AlertDismissible
                            showAlertDis={showAlertDis}
                            errorMessage={errorMessage}
                            setShowAlertDis={() => setShowAlertDis(false)}
                        />
                    </article>
                    <article>
                        <AlertBasket
                            show={showAlert}
                            message={message}
                            target={target}
                        />
                    </article>
                </section>

                <section>
                    <aside>
                        <Row className="mt-3 mb-5 mx-auto d-flex">
                            <Col md={6} xs={12}>
                                <Accordion
                                    style={{
                                        border: "1px solid #dee2e6",
                                        borderRadius: "8px",
                                        backgroundColor: "#f8f9fa",
                                        fontSize: "18px",
                                        fontFamily: "Arial, sans-serif",
                                        overflow: "hidden",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                                    }}
                                >
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            <Row
                                                as="h3"
                                                role="h3"
                                                style={{
                                                    color: "#494949",
                                                    fontSize: "24px",
                                                    fontWeight: "bold",
                                                    padding: "10px 20px",
                                                    wordWrap: "break-word",
                                                    wordBreak: "break-all",
                                                }}
                                            >
                                                Характеристики товару
                                            </Row>
                                        </Accordion.Header>
                                        <Accordion.Body className="p-0">
                                            {product.description && product.description.map((info, index) =>
                                                <Row key={index} style={{
                                                    backgroundColor: index % 2 === 0 ? "#f1f1f1" : "#f8f9fa",
                                                    padding: "10px 20px",
                                                    borderBottom: "1px solid #dee2e6",
                                                    margin: "auto"
                                                }}>
                                                    <Col
                                                        xs={6}
                                                        as="h2"
                                                        role="h2"
                                                        className="product-characteristic"
                                                    >{info.title}</Col>
                                                    <Col
                                                        xs={6}
                                                        as="h2"
                                                        role="h2"
                                                        className="product-characteristic"
                                                    >{info.description}</Col>
                                                </Row>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Col>
                        </Row>
                    </aside>
                </section>

                <section>
                    <Row className="m-auto">
                        <Col
                            md={6} xs={12}
                            className="d-flex justify-content-between"
                        >
                            <p className="info-count-comments">Відгуки покупців {`(${commentsProduct.length})`}</p>
                            <Button
                                className="container-button btn-create-comment"
                                variant="dark"
                                size="lg"
                                onClick={() => setShowModal(true)}
                            >
                                Залишити відгук
                            </Button>
                        </Col>
                    </Row>
                    {
                        loadComment ? "йде завантаження відгуків та коментарів"
                            :
                            !commentsProduct.length ?
                                <Row className="mb-4 mx-auto fs-4">
                                    <Col md={6} xs={12}>
                                        <h5 className="info-empty-comments">відгуків чи коментарів тут немає :(</h5>
                                    </Col>
                                </Row>
                                : commentsProduct.map((comment, index) =>
                                    <React.Fragment key={comment._id}>
                                        <Row
                                            as="article"
                                            role="article"
                                            className="m-auto my-4"
                                        >
                                            <Col
                                                md={6} xs={12}
                                                className="body-userData-view"
                                            >
                                                <Row>
                                                    <Col as="header" role="rowheader" xs={6}
                                                         className="userData-view"
                                                    >
                                                        <Image
                                                            width={25}
                                                            height={25}
                                                            alt="image_account_icon"
                                                            className="me-2"
                                                            src={process.env.REACT_APP_API_URL + 'account.png'}
                                                        />
                                                        {comment.username}
                                                    </Col>
                                                    <Col xs={6} className="d-flex justify-content-end">
                                                        {comment.commentDate}
                                                        {userData.userId == comment.userId ? (comment.isRemove ? '' :
                                                            <span>
                                                                <span className="ms-2">
                                                                    <Image width={25}
                                                                           height={25}
                                                                           onClick={() => {
                                                                               setChangeCommentData(comment.commentData)
                                                                               setCommentUserId(comment._id)
                                                                               setShowModalChangeComment(true)
                                                                           }}
                                                                           alt="image_edit_icon"
                                                                           src={process.env.REACT_APP_API_URL + "edit.png"}
                                                                    />
                                                                </span>
                                                                    <span className="ms-2">
                                                                    <Image width={25}
                                                                           height={25}
                                                                           onClick={() => {
                                                                               setCommentUserId(comment._id)
                                                                               setToggleShowRemoveComment(true)
                                                                           }}
                                                                           src={process.env.REACT_APP_API_URL + "icons8-close-24.png"}
                                                                    />
                                                                </span>
                                                            </span>)
                                                            :
                                                            ""
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={1}>
                                                        {comment.isGetOrder && <Image
                                                            width={25}
                                                            height={25}
                                                            alt="image_but_parchase_icon"
                                                            src={process.env.REACT_APP_API_URL + 'buyPurchase.png'}
                                                        />}
                                                    </Col>
                                                    <Col
                                                        xs={5}
                                                        style={{
                                                            fontWeight: "600"
                                                        }}
                                                        className="text-muted"
                                                    >
                                                        {comment.isGetOrder && "Купив товар"}
                                                    </Col>
                                                    <Col xs={6} className="d-flex align-items-center justify-content-end">
                                                        {comment.isGetOrder && comment.rating !== 0 ? <RatingStar rating={(comment.rating)}/> : ''}
                                                    </Col>
                                                </Row>
                                                <hr/>
                                                <Row>
                                                    <Col
                                                        xs={12}
                                                        style={ comment.isRemove ? {
                                                            fontStyle: "italic",
                                                            color: "rgb(143,143,143)"
                                                        } :
                                                            {
                                                                wordWrap: "break-word",
                                                                wordBreak: "break-all"
                                                            }
                                                        }
                                                    >
                                                        {comment.commentData}
                                                        {comment.isChanged && !comment.isRemove ?
                                                            <Row
                                                                style={{
                                                                    fontSize: "14px",
                                                                    fontStyle: "italic",
                                                                    color: "rgb(143, 143, 143)",
                                                                }}
                                                                className="d-flex text-end py-0 my-0"
                                                            >
                                                                <Col>
                                                            <span>
                                                                змінено
                                                                <Image
                                                                    className="ms-1"
                                                                    width={15}
                                                                    height={15}
                                                                    src={process.env.REACT_APP_API_URL + 'edited.png'}
                                                                />
                                                            </span>
                                                                </Col>
                                                            </Row>
                                                            : ""
                                                        }
                                                    </Col>
                                                </Row>
                                                <hr style={ comment.isChanged && !comment.isRemove ? {
                                                    marginTop: "2px"
                                                } : {}}
                                                />
                                                <Row>
                                                    <Col xs={6} className="text-center">
                                                        <div
                                                            onClick={() => {
                                                                setShowModalResponse(true)
                                                                setCommentUserId(comment._id);
                                                                setMainCommentUserId(comment._id);
                                                            }}
                                                            className="d-flex justify-content-center"
                                                        >
                                                            <Image
                                                                width={30}
                                                                height={30}
                                                                alt="image_write_icon"
                                                                src={process.env.REACT_APP_API_URL + "write.png"}
                                                            />
                                                            відповісти
                                                        </div>
                                                    </Col>
                                                    <Col
                                                        xs={6}
                                                        className="text-center"
                                                        onClick={() => {
                                                            setToggleShowResponseComments((prevState) => {
                                                                const newState = [...prevState];
                                                                newState[index] = !newState[index];
                                                                return newState;
                                                            });
                                                        }}
                                                    >
                                                        <Image
                                                            width={30}
                                                            height={30}
                                                            className="me-1"
                                                            alt="image_responsive_icon"
                                                            src={process.env.REACT_APP_API_URL + "responsiveness.png"}
                                                        />
                                                        відповіді
                                                        <span
                                                            className="ms-1 text-muted"
                                                            style={{
                                                                fontSize: "18px",
                                                                fontWeight: "600"
                                                            }}
                                                        >{comment.responseComments.length ? `(${comment.responseComments.length})` : ''}
                                                </span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        {comment.responseComments.map((responseComment, dIndex) => {
                                            return (
                                                <React.Fragment key={responseComment._id}>
                                                    {dIndex === 0 && toggleShowResponseComments[index] ?
                                                        <Row>
                                                            <Col md={6} sm={10} xs={12}>
                                                                <h3 className="response-toCommentUser">{`Ответы пользователю ${comment.username}:`}</h3>
                                                            </Col>
                                                        </Row> : ''}
                                                    <Row
                                                        as="article"
                                                        role="article"
                                                        className="m-auto my-3" key={dIndex} style={{
                                                        display: toggleShowResponseComments[index] ? "block" : "none"
                                                    }}>
                                                        <Col md={6} sm={10} xs={12}>
                                                            <Row>
                                                                <Col
                                                                    xs={1}
                                                                    className="d-flex justify-content-around"
                                                                >
                                                                    <div style={{
                                                                        width: "2%",
                                                                        margin: "50% auto",
                                                                        height: "80%",
                                                                        backgroundColor: "#d5d5d5",
                                                                    }}/>
                                                                </Col>
                                                                <Col
                                                                    xs={11}
                                                                    style={{
                                                                        border: "1px solid rgb(209 209 209)",
                                                                        borderRadius: "7px",
                                                                        fontSize: "20px",
                                                                        padding: "7px 20px"
                                                                    }}
                                                                >
                                                                    <Row>
                                                                        <Col
                                                                            as="header"
                                                                            role="rowheader"
                                                                            xs={6}
                                                                            className="response-commentUsername">
                                                                            <Image
                                                                                width={25}
                                                                                height={25}
                                                                                alt="image_account_icon"
                                                                                className="me-2"
                                                                                src={process.env.REACT_APP_API_URL + 'account.png'}
                                                                            />
                                                                            <p className="mb-0">
                                                                                {responseComment.username}
                                                                            </p>
                                                                        </Col>
                                                                        <Col xs={6} className="d-flex justify-content-end mt-1 response-commentDate">
                                                                            {responseComment.commentDate}
                                                                            {userData.userId == responseComment.userId ? (responseComment.isRemove ? '' :
                                                                                    <span>
                                                                                <span className="ms-2">
                                                                                    <Image width={25}
                                                                                           height={25}
                                                                                           onClick={() => {
                                                                                               setChangeCommentData(responseComment.commentData)
                                                                                               setSelectComUId(responseComment._id)
                                                                                               setCommentUserId(comment._id)
                                                                                               setShowResponseToggle(true)
                                                                                               setShowModalChangeComment(true)
                                                                                           }}
                                                                                           alt="image_edit_icon"
                                                                                           src={process.env.REACT_APP_API_URL + "edit.png"}
                                                                                    />
                                                                                </span>
                                                                                    <span className="ms-2">
                                                                                    <Image width={25}
                                                                                           height={25}
                                                                                           onClick={() => {
                                                                                               setCommentUserId(comment._id)
                                                                                               setSelectComUId(responseComment._id)
                                                                                               setToggleShowRemoveComment(true)
                                                                                               setShowResponseToggle(true)

                                                                                           }}
                                                                                           alt="image_close_icon"
                                                                                           src={process.env.REACT_APP_API_URL + "icons8-close-24.png"}
                                                                                    />
                                                                                </span>
                                                                            </span>)
                                                                                :
                                                                                ""
                                                                            }
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs={1}>
                                                                            {responseComment.isGetOrder && <Image
                                                                                width={25}
                                                                                height={25}
                                                                                src={process.env.REACT_APP_API_URL + 'buyPurchase.png'}
                                                                            />}
                                                                        </Col>
                                                                        <Col
                                                                            xs={5}
                                                                            style={{
                                                                                fontWeight: "600"
                                                                            }}
                                                                            className="text-muted"
                                                                        >
                                                                            {responseComment.isGetOrder && "Купив товар"}
                                                                        </Col>
                                                                    </Row>
                                                                    <hr className="my-1"/>
                                                                    <Row>
                                                                        <Col className="d-flex align-items-center">
                                                                            <Image
                                                                                src={process.env.REACT_APP_API_URL + 'turn-right.png'}
                                                                                width={23}
                                                                                height={23}
                                                                            />
                                                                            <p
                                                                                className="response-sentTo text-muted mb-0"
                                                                            >
                                                                                відповідь користувачу {responseComment.sendTo}
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                    <hr className="mt-1"/>
                                                                    <Row>
                                                                        <Col
                                                                            xs={12}
                                                                            className="response-commentData"
                                                                            style={ responseComment.isRemove ? {
                                                                                fontStyle: "italic",
                                                                                color: "rgb(143,143,143)"
                                                                            } : {
                                                                                wordWrap: "break-word",
                                                                                wordBreak: "break-all",
                                                                            }}
                                                                        >
                                                                            {responseComment.commentData}
                                                                            {responseComment.isChanged && !responseComment.isRemove ?
                                                                                <Row
                                                                                    style={{
                                                                                        fontSize: "14px",
                                                                                        fontStyle: "italic",
                                                                                        color: "rgb(143, 143, 143)",
                                                                                    }}
                                                                                    className="d-flex text-end py-0 my-0"
                                                                                >
                                                                                    <Col>
                                                                                <span>
                                                                                    змінено
                                                                                    <Image
                                                                                        className="ms-1"
                                                                                        width={15}
                                                                                        height={15}
                                                                                        src={process.env.REACT_APP_API_URL + 'edited.png'}
                                                                                    />
                                                                                </span>
                                                                                    </Col>
                                                                                </Row>
                                                                                : ""
                                                                            }
                                                                        </Col>
                                                                    </Row>
                                                                    <hr/>
                                                                    <Row>
                                                                        <Col xs={12} className="text-center button-response-to-response">
                                                                            <div
                                                                                onClick={() => {
                                                                                    setShowModalResponse(true)
                                                                                    setCommentUserId(responseComment._id);
                                                                                    setMainCommentUserId(comment._id);
                                                                                }}
                                                                                className="d-flex justify-content-center"
                                                                            >
                                                                                <Image width={30} height={30} src={process.env.REACT_APP_API_URL + "write.png"}/>
                                                                                відповісти
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </React.Fragment>
                                            )}
                                        )}
                                    </React.Fragment>
                                )
                    }
                </section>
            </div>
            <OldViews/>
        </>
    );
};

export default SelectedDevice;