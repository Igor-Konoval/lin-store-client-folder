import React, {FC, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {IAdminModal} from "../../models/IAdminModal";
import {createType} from "../../http/createProduct";
import {UseAppDispatch} from "../../hooks/redux";
import {fetchFilter} from "../../store/reducers/ProductsActionCreator";
interface IType {
    name: string
}

const CreateType:FC<IAdminModal> = ({show, onHide}) => {

    const [type, setType] =  useState<string>('');
    const dispatch = UseAppDispatch();
    const addType = async () => {
        const data: IType = {
            name: type
        }
        await createType(data).then(data => {
            dispatch(fetchFilter('type'));
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
                    Добавить тип: смартфоны, часы...
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Поле для добавления нового типа</Form.Label>
                        <Form.Control onChange={(e) => setType(e.target.value)} placeholder="подшипники, наушники..."></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
                <Button onClick={addType}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;