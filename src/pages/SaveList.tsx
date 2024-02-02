import React, {useEffect, useState} from 'react';
import {FC} from "react/index";
import {getSaveList} from "../http/saveListAPI";
import { Helmet } from 'react-helmet';
import {Image, Row} from "react-bootstrap";
import ProductSaveList from "../components/ProductSaveList";
import {AppSlice} from "../store/reducers/AppSlice";
import OldViews from "../components/OldViews";
import "../moduleCSS/LoadSpiner.css";
import {UseAppDispatch} from "../hooks/redux";
const {loadingApp} = AppSlice.actions;

const SaveList:FC = () => {
    const [saveList, setSaveList] = useState();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const dispatch = UseAppDispatch();

    const removeDescriptionHTML = () => {
        const existingDescription = document.head.querySelector('meta[name="description"]');
        if (existingDescription) {
            document.head.removeChild(existingDescription);
        }
    }

    useEffect(() => {
        (async() => {
            const response = await getSaveList();
            if (response === "не авторизован") {
                dispatch(loadingApp());
                window.location.reload();
            }
            setSaveList(response);
            setIsLoading(false);
        })()
    }, [])

    const handlerRemove = (id: string) => {
        setSaveList((prevState) => prevState.filter( prev => prev._id !== id ))
    }
    if (isLoading) {
        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Сторінка збережених товарів користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <div className="container-spinner">
                    <div className="load-spinner"></div>
                </div>
            </>
        )
    }

    if (saveList.length === 0) {
        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Сторінка збережених товарів користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <h1 className="fs-1 mt-4 mb-5">Список збережень</h1>
                <div className="d-flex justify-content-center align-items-center text-muted notSaves">
                    <div>
                        У вас немає збережених товарів
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
        <React.Fragment>
            <main>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Сторінка збережених товарів користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <div style={{minHeight: "60vh"}}>
                    <h1>Список збережень</h1>
                    <Row>
                        {saveList.map((product, id) =>
                            <ProductSaveList
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
                                countSales={product.countSales}
                                img={product.img[0]}
                                wasInUsed={product.wasInUsed}
                                handlerRemove={handlerRemove}
                            />
                        )}
                    </Row>
                </div>
            </main>
            <aside>
                <OldViews/>
            </aside>
        </React.Fragment>
    );
};

export default SaveList;