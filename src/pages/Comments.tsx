    import React, {useEffect, useState} from 'react';
    import {FC} from "react/index";
    import {getUserComments, IGetAllComments, IUserComments} from "../http/commentApi";
    import {Col, Row, Accordion, Image} from "react-bootstrap";
    import {DEVICE_ROUTE} from "../utils/consts";
    import { Helmet } from 'react-helmet';
    import {AppSlice} from "../store/reducers/AppSlice";
    import {useHistory} from "react-router-dom";
    import RatingStar from "../components/RatingStar";
    import "../moduleCSS/Comments.css"
    import OldViews from "../components/OldViews";
    import "../moduleCSS/LoadSpiner.css";
    import {UseAppDispatch} from "../hooks/redux";
    const {loadingApp} = AppSlice.actions;
    const Comments:FC = () => {
    
        const [comments, setComments] = useState<IUserComments[]>([])
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const dispatch = UseAppDispatch();
    
        const history = useHistory();

        const removeDescriptionHTML = () => {
            const existingDescription = document.head.querySelector('meta[name="description"]');
            if (existingDescription) {
                document.head.removeChild(existingDescription);
            }
        }

        useEffect(() => {
            (async () => {
                const response = await getUserComments();
                if (response === "не авторизован") {
                    dispatch(loadingApp());
                    window.location.reload();
                }
    
                setComments(response);
                setIsLoading(false);
            })()
        }, [])
    
        if (isLoading) {
            return (
                <>
                    <Helmet>
                        {removeDescriptionHTML()}
                        <title>{`Lin-Store | Сторінка коментарів користувача`}</title>
                        <meta name="description"
                              content="Інтернет-магазин Lin-Store – різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                    </Helmet>
                    <div className="container-spinner">
                        <div className="load-spinner"></div>
                    </div>
                </>
            )
        }

        const checkRating = (rating: number) => {
            const maxRating = 5;
            const reRating = Math.round(rating)
    
            const filledStar = (
                <Image
                    key={`filled`}
                    alt="image_filled_star"
                    width={20}
                    height={20}
                    src={process.env.REACT_APP_API_URL + "fullstar.png"}
                />
            );
    
            const emptyStar = (
                <Image
                    key={`empty`}
                    alt="image_empty_star"
                    width={18}
                    height={18}
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
    
        if (comments.length === 0) {
            return (
                <>
                    <Helmet>
                        {removeDescriptionHTML()}
                        <title>{`Lin-Store | Сторінка коментарів користувача`}</title>
                        <meta name="description"
                              content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                    </Helmet>
                    <h1 className="fs-1 mt-4 mb-5">Коментарі користувача</h1>
                    <div className="d-flex justify-content-center align-items-center text-muted noСomments">
                        <div>
                            У вас поки немає коментарів
                            <Image
                                className="ms-1 opacity-75"
                                src={process.env.REACT_APP_API_URL + "pngegg.png"}
                                width={40}
                                height={40}
                            />
                        </div>
                    </div>
                    <OldViews/>
                </>
            )
        }
    
        const createCommentComponent = (userComment: IGetAllComments, index: number) => {
            return (
                <React.Fragment key={index}>
                    <Row
                        as="aside"
                        role="aside"
                    >
                        <Col
                            style={{
                                fontSize: "20px",
                                padding: "7px 20px"
                            }}
                        >
                            <Row>
                                <Col
                                    xs={5}
                                    className="comment-username"
                                >
                                    {userComment.username}
                                </Col>
                                <Col
                                    xs={7}
                                    className="d-flex justify-content-start comment-commentDate"
                                >
                                    {userComment.commentDate}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} className="d-flex align-items-center justify-content-end">
                                    {userComment.isGetOrder && userComment.rating !== 0 ?
                                        <RatingStar rating={(userComment.rating)}/> : ''}
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                                <Col
                                    xs={12}
                                    className="commentData"
                                    style={userComment.isRemove ? {
                                        fontStyle: "italic",
                                        color: "rgb(143,143,143)"
                                    } : {
                                        wordWrap: "break-word",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {userComment.commentData}
                                    {userComment.isChanged && !userComment.isRemove ?
                                        <Row
                                            style={{
                                                fontSize: "14px",
                                                fontStyle: "italic",
                                                color: "rgb(143, 143, 143)",
                                            }}
                                            className="d-flex text-end text-lg-center py-0 my-0"
                                        >
                                            <Col>
                                            <span>
                                                змінено
                                                <Image
                                                    className="ms-1"
                                                    alt="image_edit_icon"
                                                    width={15}
                                                    height={15}
                                                    src={process.env.REACT_APP_API_URL + 'edited.png'}
                                                />
                                            </span>
                                            </Col>
                                        </Row>
                                        :
                                        ""
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div
                        style={{
                            marginTop: "20px",
                            marginBottom: "12px",
                            height: "3px",
                            backgroundColor: "rgb(216 216 216 / 78%)",
                            borderRadius: "5px",
                            minWidth: "100%"
                        }}
                    >
                    </div>
                </React.Fragment>
        )
        }

        return (
            <>
                <Helmet>
                    {removeDescriptionHTML()}
                    <title>{`Lin-Store | Сторінка коментарів користувача`}</title>
                    <meta name="description"
                          content="Інтернет-магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!"/>
                </Helmet>
                <h1 className="fs-1 mt-4 mb-5">Коментарі користувача</h1>
                <main>
                    <div style={{minHeight: "60vh"}}>
                        <div className="mx-sm-5">
                            {comments.map((comment, index) => (
                                <Accordion key={comment._id}>
                                    <Accordion.Item
                                        className="my-4"
                                        eventKey={index.toString()}
                                    >
                                        <React.Fragment>
                                            <Accordion.Header>
                                                <Row
                                                    className="d-flex flex-nowrap justify-content-around p-1"
                                                    style={{width: "inherit"}}
                                                >
                                                    <Col xs={5} sm={4}
                                                         className="d-flex justify-content-center align-items-center">
                                                        <Image
                                                            className="comment-productImg"
                                                            style={{borderRadius: "14px", cursor: 'pointer'}}
                                                            alt="image_product"
                                                            src={comment.productImg[0]}
                                                            onClick={() => {
                                                                const encodedProductName = encodeURIComponent(comment.productName).replace(/%20/g, '_');
                                                                history.push(DEVICE_ROUTE + "/" + encodedProductName);
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col xs={7} sm={5}
                                                         className="d-flex flex-column ms-2 ms-sm-1 ms-lg-0">
                                                        <p
                                                            onClick={() => {
                                                                const encodedProductName = encodeURIComponent(comment.productName).replace(/%20/g, '_');
                                                                history.push(DEVICE_ROUTE + "/" + encodedProductName);
                                                            }}
                                                            className="comment-productName"
                                                        >
                                                            {comment.productName}
                                                        </p>
                                                        <p className="comment-productDesc text-muted">{comment.productShortDescription}</p>
                                                        <p className="d-flex my-1">
                                                            {checkRating(comment.productTotalRating)}
                                                            <span className="text-muted ms-1">
                                                        {`(${comment.productCountRating})`}
                                                    </span>
                                                        </p>
                                                    </Col>
                                                    <Col sm={3}
                                                         className="comment-showList"
                                                    >
                                                        <p>
                                                            показати/приховати
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {comment.userComments.map((userComment, index) =>
                                                    createCommentComponent(userComment, index)
                                                )}
                                            </Accordion.Body>
                                        </React.Fragment>
                                    </Accordion.Item>
                                </Accordion>
                            ))}
                        </div>
                    </div>
                </main>
                <aside>
                    <OldViews/>
                </aside>
            </>
        );
    };

    export default Comments;