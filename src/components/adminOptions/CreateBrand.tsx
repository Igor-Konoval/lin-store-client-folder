import React, {useState} from 'react';
import {FC} from "react/index";
import {Button, Form, Modal} from "react-bootstrap";
import {IAdminModal} from "../../models/IAdminModal";
import {createBrand} from "../../http/createProduct";
import {fetchBrand, fetchFilter} from "../../store/reducers/ProductsActionCreator";
import {UseAppDispatch} from "../../hooks/redux";

interface IBrand {
    name: string
}

const CreateBrand:FC<IAdminModal> = ({show, onHide}) => {
    const [brand, setBrand] =  useState<string>('');
    const dispatch = UseAppDispatch()
    const addBrand = async () => {
        const data: IBrand = {
            name: brand
        }
        await createBrand(data).then(data => {
            dispatch(fetchBrand('brand'));
            onHide()
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Поле для добавления нового брэнда</Form.Label>
                        <Form.Control onChange={(e) => setBrand(e.target.value)} placeholder="sony, xiaomi..."></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
                <Button onClick={addBrand}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBrand;