import React from 'react';
import {FC} from "react/index";
import {Col, Dropdown, Image} from "react-bootstrap";
import SelectedFilter from "./SelectedFilter";
import "../moduleCSS/SortPrice.css"
import {ISortPrice} from "../models/ISortPrice";

const sortValue: string[] = ["від низької", "від високої", "за купленими", "за відгуками"]

const SortPrice:FC<ISortPrice> = ({selectSortPrice, removeSortPrice, changeSortPrice}) => {
    return (
        <Col>
            <Dropdown className="container-sortPrice-toggle">
                <Dropdown.Toggle
                    className="sortPrice-toggle"
                >
                    Сортувати
                    <Image
                        className="sortPrice-img"
                        src={process.env.REACT_APP_API_URL + 'icons8-sort-by-price-100.png'}
                    />
                </Dropdown.Toggle>
                {
                    selectSortPrice && <SelectedFilter removeValue={removeSortPrice} sortTitle={selectSortPrice}/>
                }
                <Dropdown.Menu>
                    {sortValue.map(value =>
                        <Dropdown.Item
                            onClick={() => {
                                changeSortPrice(value);
                            }}
                            key={value}
                        >
                            {value}
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </Col>
    );
};

export default SortPrice;