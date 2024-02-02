import React, {useEffect} from 'react';
import {FC} from "react/index";
import {UseAppDispatch, UseAppSelector} from "../hooks/redux";
import Product from "./Product";
import { Helmet } from 'react-helmet';
import {Row} from "react-bootstrap";
import {fetchProducts} from "../store/reducers/ProductsActionCreator";
import {ProductItemsSlice} from "../store/reducers/ProductItemsSlice";
import PagBar from "./PagBar";
import "../moduleCSS/LoadSpiner.css"
import "../moduleCSS/ProductList.css"
const {productsTypeId, setSearchValue, productsBrandId} = ProductItemsSlice.actions;
const {productsPage} = ProductItemsSlice.actions;

const ProductList:FC = () => {
    const dispatch = UseAppDispatch();

    const productList = UseAppSelector((state => state.ProductItemsSlice.products));
    const totalProducts = UseAppSelector((state => state.ProductItemsSlice.totalProducts));
    const isLoading = UseAppSelector(state => state.ProductItemsSlice.isLoading);
    const {minPrice, maxPrice} = UseAppSelector(state => state.ProductItemsSlice.prices);
    const resultSearchTerm = UseAppSelector(state => state.ProductItemsSlice.searchTerm);

    const firstPathSegments = window.location.pathname.split('/').filter(segment => segment);
    const searchTermSeg = firstPathSegments.find(segment => segment.startsWith('search='));
    const type = firstPathSegments.find(segment => segment.startsWith('type='));
    const brand = firstPathSegments.find(segment => segment.startsWith('brand='));
    const page = firstPathSegments.find(segment => segment.startsWith('p='));

    const isValidType = (type === undefined || type === "type=" ? undefined : decodeURIComponent(type));
    const isValidBrand = (brand === undefined || brand === "brand=" ? undefined : decodeURIComponent(brand));
    const isValidSearchTerm = (searchTermSeg === undefined ? undefined : decodeURIComponent(searchTermSeg));
    const queryP = page === undefined ? "=1" : decodeURIComponent(page);
    const isValidP = !Number.isNaN(+queryP.split("=")[1]) ? +queryP.split("=")[1] : 1;

    useEffect(() => {
        if (isValidType !== undefined) {
            dispatch(productsTypeId({
                name: isValidType.split("=")[1] !== "_" ? isValidType.split("=")[1] : "Категории",
                _id: null
            }));
        } else {
            dispatch(productsTypeId({
                name: "Категории",
                _id: null
            }));
        }

        if (isValidBrand !== undefined) {
            dispatch(productsBrandId({
                name: isValidBrand.split("=")[1] !== "_" ? isValidBrand.split("=")[1] : "Бренды",
                _id: null
            }));
        } else {
            dispatch(productsBrandId({
                name: "Бренды",
                _id: null
            }));
        }

        if (!Number.isNaN(isValidP)) {
            dispatch(productsPage(isValidP));
        }
        else {
            dispatch(productsPage(1));
        }

        if (isValidSearchTerm !== undefined) {
            dispatch(setSearchValue(isValidSearchTerm.split("=")[1] !== "_" ? isValidSearchTerm.split("=")[1].split("_").join(" ") : ""));
        } else {
            dispatch(setSearchValue(""));
        }

        const handlePopState = async () => {

            const pathSegments = window.location.pathname.split('/').filter(segment => segment); // Разбиваем путь на сегменты
            const searchTerm = pathSegments.find(segment => segment.startsWith('search='));
            const type = pathSegments.find(segment => segment.startsWith('type='));
            const brand = pathSegments.find(segment => segment.startsWith('brand='));
            const page = pathSegments.find(segment => segment.startsWith('p='));

            const isValidType = (type === undefined || type === "type=" ? undefined : decodeURIComponent(type));
            const isValidBrand = (brand === undefined || brand === "brand=" ? undefined : decodeURIComponent(brand));
            const isValidSearchTerm = searchTerm === undefined ? undefined : decodeURIComponent(searchTerm);
            const queryPage = page === undefined ? "=1" : decodeURIComponent(page);
            const isValidPage = !Number.isNaN(+queryPage.split("=")[1]) ? +queryPage.split("=")[1] : 1;

            await dispatch(fetchProducts(
                isValidSearchTerm !== undefined ? isValidSearchTerm.split("=")[1] !== "_" ? isValidSearchTerm.split("=")[1].split("_").join(" ") : "" : "",
                isValidPage,
                25,
                isValidType !== undefined ? isValidType.split("=")[1] !== "_" ? isValidType.split("=")[1] : null : null,
                isValidBrand !== undefined ? isValidBrand.split("=")[1] !== "_" ? isValidBrand.split("=")[1] : null : null,
                maxPrice,
                minPrice,
                null
            ));

            if (isValidType !== undefined) {
                dispatch(productsTypeId({
                    name: isValidType.split("=")[1] !== "_" ? isValidType.split("=")[1] : "Категории",
                    _id: null
                }));
            } else {
                dispatch(productsTypeId({
                    name: "Категории",
                    _id: null
                }));
            }

            if (isValidBrand !== undefined) {
                dispatch(productsBrandId({
                    name: isValidBrand.split("=")[1] !== "_" ? isValidBrand.split("=")[1] : "Бренды",
                    _id: null
                }));
            } else {
                dispatch(productsBrandId({
                    name: "Бренды",
                    _id: null
                }));
            }

            if (!Number.isNaN(isValidPage)) {
                dispatch(productsPage(isValidPage));
            }
            else {
                dispatch(productsPage(1));
            }

            if (isValidSearchTerm !== undefined) {
                dispatch(setSearchValue(isValidSearchTerm.split("=")[1] !== "_" ? isValidSearchTerm.split("=")[1].split("_").join(" ") : ""));
            } else {
                dispatch(setSearchValue(""));
            }
        };

        if (productList.length === 0) {
            dispatch(fetchProducts(
                isValidSearchTerm !== undefined ? isValidSearchTerm.split("=")[1] !== "_" ? isValidSearchTerm.split("=")[1].split("_").join(" ") : "" : "",
                isValidP,
                25,
                isValidType !== undefined ? isValidType.split("=")[1] !== "_" ? isValidType.split("=")[1] : null : null,
                isValidBrand !== undefined ? isValidBrand.split("=")[1] !== "_" ? isValidBrand.split("=")[1] : null : null,
                maxPrice,
                minPrice,
                null
            ));
            const existingDescription = document.head.querySelector('meta[name="description"]');
            if (existingDescription) {
                document.head.removeChild(existingDescription);
            }
        }
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    },[]);

    if (isLoading) {
        return (
            <>
                <Helmet>
                    <title>{`Інтернет-магазин Lin-Store | Завантаження сторінки`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store – різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <div className="container-spinner">
                    <div className="load-spinner"></div>
                </div>
            </>
        )
    }

    return (
        <section>
            {isValidSearchTerm !== undefined && isValidSearchTerm !== "search=_" && isValidType !== undefined && isValidType !== "type=_"
            && isValidBrand !== undefined && isValidBrand !== "brand=_" ?
                <>
                    <Helmet>
                        <title>{`Купити товари в Lin-Store - Результати пошуку Бренд: ${isValidBrand.split("=")[1]}, Тип: ${isValidType.split("=")[1]}, Пошук: ${resultSearchTerm}`}</title>
                    </Helmet>
                    <Helmet>
                        <meta name="description"
                              content={`Широкий вибір на ${isValidType.split("=")[1]} від бренду ${isValidBrand.split("=")[1]}. Знайдено ${totalProducts} товарів. Купуйте вигідно у Lin-Store.`}/>
                    </Helmet>
                </>
                :
                (isValidSearchTerm === undefined || isValidSearchTerm === "search=_") && (isValidType !== undefined && isValidType !== "type=_")
                && (isValidBrand !== undefined && isValidBrand !== "brand=_") ?
                    <>
                        <Helmet>
                            <title>{`Придбати ${isValidType.split("=")[1]} ${isValidBrand.split("=")[1]} в Lin-Store - Відмінні пропозиції за вигідною ціною!`}</title>
                        </Helmet>
                        <Helmet>
                            <meta name="description"
                                  content={`Широкий вибір на ${isValidType.split("=")[1]} від бренду ${isValidBrand.split("=")[1]}. Знайдено ${totalProducts} товарів. Купуйте вигідно у Lin-Store.`}/>
                        </Helmet>
                    </> :
                    (isValidSearchTerm === undefined || isValidSearchTerm === "search=_") && (isValidType === undefined || isValidType === "type=_")
                    && (isValidBrand !== undefined && isValidBrand !== "brand=_") ?
                        <>
                            <Helmet>
                                <title>{`Купити товари ${isValidBrand.split("=")[1]} в Lin-Store - Відмінні пропозиції за вигідною ціною!`}</title>
                            </Helmet>
                            <Helmet>
                                <meta name="description"
                                      content={`Широкий вибір товарів від бренду ${isValidBrand.split("=")[1]}. Знайдено ${totalProducts} товарів. Купуйте вигідно у Lin-Store.`}/>
                            </Helmet>
                        </> :
                        (isValidSearchTerm === undefined || isValidSearchTerm === "search=_") && (isValidType !== undefined && isValidType !== "type=_")
                        && (isValidBrand === undefined || isValidBrand === "brand=_") ?
                            <>
                                <Helmet>
                                    <title>{`Придбати ${isValidType.split("=")[1]} в Lin-Store - Відмінні пропозиції за вигідною ціною!`}</title>
                                </Helmet>
                                <Helmet>
                                    <meta name="description"
                                          content={`Широкий вибір на ${isValidType.split("=")[1]}. Знайдено ${totalProducts} товарів. Купуйте вигідно у Lin-Store.`}/>
                                </Helmet>
                            </> :
                            resultSearchTerm && isValidType === undefined
                            && isValidBrand === undefined ?
                                <>
                                    <Helmet>
                                        <title>{`Купити товари в Lin-Store - Результати пошуку: ${resultSearchTerm}`}</title>
                                    </Helmet>
                                    <Helmet>
                                        <meta name="description"
                                              content={`Знайти товари швидко та зручно. Результати пошуку: ${resultSearchTerm}. Знайдено ${totalProducts} товарів. Купуйте вигідно у Lin-Store.`}/>
                                    </Helmet>
                                </> :
                                <Helmet>
                                    <title>{`Інтернет-магазин Lin-Store`}</title>
                                    <meta name="description"
                                          content="Інтернет-магазин Lin-Store – різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                                </Helmet>
            }

            <Row className="d-flex flex-wrap m-auto mt-3">
                {resultSearchTerm &&
                    <h1 className="info-searchTerm">
                        {`Результати пошуку "${resultSearchTerm}"`}
                    </h1>
                }
                {
                    totalProducts !== null ?
                        <h2
                            className="info-count-products"
                        >
                            {`Знайдено товарів ${totalProducts}`}
                        </h2>
                        :
                        null
                }
                {productList.map((product, id) =>
                    <Product
                        key={id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        totalRating={product.totalRating}
                        countRating={product.countRating}
                        shortDescription={product.shortDescription}
                        isActive={product.isActive}
                        count={product.count}
                        colors={product.colors}
                        img={product.img[0]}
                        countSales={product.countSales}
                        wasInUsed={product.wasInUsed}
                    />)}
                <PagBar />
            </Row>
        </section>
    );
};

export default ProductList;