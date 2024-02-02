import React, { useState} from 'react';
import {FC} from "react/index";
import { Dropdown, Form} from "react-bootstrap";
import "../moduleCSS/FilterItem.css"
import RangeSelect from "./RangeSelect";
import {IRangeProps} from "../models/IBarRange";

const BarRange:FC<IRangeProps> = ({minPrice, maxPrice, onPriceChange}) => {

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            style={{
                borderRadius: "58px",
                color: 'black',
                backgroundColor: "rgb(243,243,243)",
                textDecoration: 'none',
                fontSize: '19px',
                padding: "15px 21px"
            }}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}

        </a>
    ));

    const CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            const [value, setValue] = useState('');

            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <Form.Control
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Type to filter..."
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                    />
                    <ul className="list-unstyled">
                        {React.Children.toArray(children).filter(
                            (child) =>
                                !value || child.props.children.toLowerCase().startsWith(value),
                        )}
                    </ul>
                </div>
            );
        },
    );

    return (
        <Dropdown className="mt-5">
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                Цена
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                <RangeSelect minPrice={minPrice} maxPrice={maxPrice} onPriceChange={onPriceChange}/>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default BarRange;