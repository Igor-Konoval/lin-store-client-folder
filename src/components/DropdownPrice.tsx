import React, {FC, useState} from 'react';
import {Col, Dropdown, Image, Row} from 'react-bootstrap';
import RangeSelect from './RangeSelect';
import "../moduleCSS/DropdownPrice.css"
import SelectedFilter from "./SelectedFilter";
import {UseAppSelector} from "../hooks/redux";
import {IRangeProps} from "../models/IDropdownPrice";

const DropdownPrice: FC<IRangeProps> = ({ minPrice, maxPrice, onPriceChange, removeValue }) => {

    const fixedPrices = UseAppSelector(state => state.ProductItemsSlice.fixedPrices)

    const [rangeWidth, setRangeWidth] = useState<number>(0);

    const checkPrice = () => {
        if (fixedPrices.maxPrice === null || fixedPrices.minPrice === null) {
            return true;
        }
        if (maxPrice === null || minPrice === null) {
            return true;
        }
        return (fixedPrices.maxPrice == maxPrice && fixedPrices.minPrice == minPrice)
    }


    return (
        <Col
            className="my-auto"
        >
            <Dropdown className="container-dropdownPrice-toggle"
            >
                <Dropdown.Toggle
                    className="dropdownPrice-toggle"
                >
                    Ціна
                    <Image
                        className="dropdown-toggle-img"
                        src={process.env.REACT_APP_API_URL + 'dollar.png'}
                    />
                </Dropdown.Toggle>
                {
                    !checkPrice() && <SelectedFilter removeValue={removeValue} prices={{minPrice, maxPrice}}/>
                }
                <Dropdown.Menu
                    className="dropdownMenu-content"
                >
                    <Row
                        className="rangeSelect-container"
                    >
                        <Col>
                            <RangeSelect minPrice={minPrice} maxPrice={maxPrice} onPriceChange={onPriceChange} onWidthChange={setRangeWidth} />
                        </Col>
                    </Row>
                </Dropdown.Menu>
            </Dropdown>
        </Col>
    );
};

export default DropdownPrice;
