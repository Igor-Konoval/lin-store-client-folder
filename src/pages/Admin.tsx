import React, {useState} from 'react';
import {FC} from "react/index";
import CreateBrand from "../components/adminOptions/CreateBrand";
import CreateType from "../components/adminOptions/CreateType";
import CreateProduct from "../components/adminOptions/CreateProduct";
import {Button} from "react-bootstrap";

const Admin:FC = () => {

    const [brandVisible, setBrandVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);

    return (
        <>
            <Button style={{borderRadius: 50}} variant="outline-dark" size="lg" onClick={()=> setBrandVisible(true)}>Добавить брэнд</Button>
            <Button style={{borderRadius: 50}} variant="outline-dark" size="lg" onClick={()=> setTypeVisible(true)}>Добавить тип</Button>
            <Button style={{borderRadius: 50}} variant="outline-dark" size="lg" onClick={()=> setProductVisible(true)}>Добавить продукт</Button>

            <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
            <CreateType show={typeVisible} onHide={()=> setTypeVisible(false)}/>
            <CreateProduct show={productVisible} onHide={()=> setProductVisible(false)}/>
        </>
    );
};

export default Admin;