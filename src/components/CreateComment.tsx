import React, {useEffect, useState} from 'react';
import {FC} from "react/index";
import {Button, Form, Modal} from "react-bootstrap";
import {createDate, createCommentUser, getAllComments, IGetAllComments} from "../http/commentApi"
import SelectRatingStar from "./SelectRatingStar";
import {AppSlice} from "../store/reducers/AppSlice";
import {checkOrderProduct} from "../http/orderAPI";
import {UseAppDispatch, UseAppSelector} from "../hooks/redux";
import {ICreateComment} from "../models/ICreateComment";
const {loadingApp} = AppSlice.actions;

const CreateComment:FC<ICreateComment> = (
    {
        show,
        onHide,
        productId,
        setShowAlertDis,
        setErrorMessage,
        setCommentsProduct,
    }) => {

    const auth = UseAppSelector(state => state.UserCheckSlice.isAuth);
    const [textValue, setTextValue] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [infoOrder, setInfoOrder] = useState({isGetProduct: false, isSetRating: false})
    const dispatch = UseAppDispatch();

    useEffect(() => {
        if (auth) {
            (async () => {
                // const flag = await checkOrderProduct(productId).then(response => response.isGetProduct === false ? setFlagOrder(false) : setFlagOrder(true))
                const response = await checkOrderProduct(productId);
                if (response === "не авторизован") {
                    dispatch(loadingApp());
                    window.location.reload();
                }
                setInfoOrder(response.message);
            })()
        }
    }, [])

    const fetchComment = async () => {
        if (isFetching) {
            onHide(false);
            return;
        }
        setIsFetching(true);

        try {
            const response = await createCommentUser(productId, rating, textValue, createDate());
            if (response === "не авторизован") {

                setErrorMessage({
                    errorTitle: "Помилка відправлення",
                    errorData: "Термін вашої авторизації минув, оновіть сторінку та авторизуйтесь для повторного надсилання повідомлення"
                });
                setShowAlertDis(true);
            }
            const comments: IGetAllComments[] = await getAllComments(productId);
            setCommentsProduct(comments)

            onHide(false);
            setRating(0);
            if (response.error) {

                setErrorMessage({
                    errorTitle: response.error.title,
                    errorData: response.error.data
                });
                setShowAlertDis(true);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setIsFetching(false)
        }
    };

    return (
        <Modal
            centered={true}
            size="lg"
            show={show}
            onHide={onHide}
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {infoOrder.isGetProduct ? "Створення відгуку" : "Створення коментаря"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    { infoOrder.isGetProduct && !infoOrder.isSetRating ? <Form.Group>
                        <Form.Label className="fs-4 text-muted">
                            Вкажіть на скільки ви оцінюєте товар:
                        </Form.Label>
                        <div className="d-flex justify-content-center my-3">
                            <SelectRatingStar handlerRating={setRating}/>
                        </div>
                    </Form.Group> : ""}
                    <Form.Group>
                        <Form.Label className="fs-4 text-muted">
                            {infoOrder.isGetProduct ? "Поле для відгуку:" : "Поле для коментаря"}
                        </Form.Label>
                        <Form.Control
                            as={"textarea"}
                            size="lg"
                            value={textValue}
                            onChange={(e) => {
                                if (textValue.length > 200) {
                                    return false
                                }
                                setTextValue(e.target.value)
                            }}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    await fetchComment();
                                }
                            }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="dark"
                    size="lg"
                    onClick={fetchComment}
                >
                    {isFetching ? "Йде відправка..." : "Підтвердити"}
                </Button>
                <Button
                    className="ms-3"
                    variant="outline-secondary"
                    size="lg"
                    onClick={onHide}
                >
                    Скасувати
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateComment;