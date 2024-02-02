import React, {FC, useState} from "react";
import {createDate, createResponseCommentUser, getAllComments, IGetAllComments} from "../http/commentApi";
import {Button, Form, Modal} from "react-bootstrap";
import {ICreateResponseComment} from "../models/ICreateResponseComment";

const CreateResponseComment:FC<ICreateResponseComment> = (
    {
        show,
        onHide,
        productId,
        commentUserId,
        mainCommentUserId,
        setErrorMessage,
        setShowAlertDis,
        setCommentsProduct,
    }) => {

    const [textValue, setTextValue] = useState<string>('');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const fetchResponseComment = async () => {
        if (isFetching) {
            onHide(false)
            return;
        }
        setIsFetching(true);

        try {
            const response = await createResponseCommentUser(productId, commentUserId, mainCommentUserId, textValue, createDate())

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
                    Створення відповіді користувачу
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label className="fs-4 text-muted">Поле для відповіді:</Form.Label>
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
                                    await fetchResponseComment();
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
                    onClick={fetchResponseComment}
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

export default CreateResponseComment