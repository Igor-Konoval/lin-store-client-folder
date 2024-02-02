import React, {useState} from 'react';
import {FC} from "react/index";
import {Button, Modal} from "react-bootstrap";
import {createDate, getAllComments, IGetAllComments, removeComment, removeResponseComment} from "../http/commentApi";
import {IRemoveComment} from "../models/IRemoveComment";

const RemoveComment:FC<IRemoveComment> = (
    {
        show,
        showRemoveResponse,
        onHide,
        responseCommentUserId,
        productId,
        commentUserId,
        setErrorMessage,
        setShowAlertDis,
        setCommentsProduct
    }) => {

    const [isFetching, setIsFetching] = useState<boolean>(false);

    const fetchRemoveComment = async () => {
        if (isFetching) {
            onHide(false)
            return;
        }
        setIsFetching(true);

        try {
            if (show === true && !showRemoveResponse) {
                const response = await removeComment(productId, commentUserId, createDate())

                if (response === "не авторизован") {
                    setErrorMessage({
                        errorTitle: "Помилка відправлення",
                        errorData: "Термін вашої авторизації минув, оновіть сторінку та авторизуйтесь для повторного надсилання повідомлення"
                    });
                    setShowAlertDis(true);
                }

                const comments: IGetAllComments[] = await getAllComments(productId);
                setCommentsProduct(comments)

                onHide(false)

                if (response.error) {

                    setErrorMessage({
                        errorTitle: response.error.title,
                        errorData: response.error.data
                    });
                    setShowAlertDis(true);
                }
            }
            if (showRemoveResponse === true) {
                const response = await removeResponseComment(productId, responseCommentUserId, commentUserId)
                const resComments: IGetAllComments[] = await getAllComments(productId);
                setCommentsProduct(resComments)

                if (response === "не авторизован") {
                    setErrorMessage({
                        errorTitle: "Помилка відправлення",
                        errorData: "Термін вашої авторизації минув, оновіть сторінку та авторизуйтесь для повторного надсилання повідомлення"
                    });
                    setShowAlertDis(true);
                }

                onHide(false)

                if (response.error) {

                    setErrorMessage({
                        errorTitle: response.error.title,
                        errorData: response.error.data
                    });
                    setShowAlertDis(true);
                }
            }

        } catch (e) {
            console.log(e.message)
        } finally {
            setIsFetching(false);
        }
    }

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
                    Ви дійсно хочете видалити коментар?
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button
                    variant="dark"
                    size="lg"
                    onClick={fetchRemoveComment}
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

export default RemoveComment;