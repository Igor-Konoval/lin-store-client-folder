import React, {useState} from 'react';
import {FC} from "react/index";
import {Col, Dropdown, Form, Image} from "react-bootstrap";
import "../moduleCSS/FilterItem.css"
import SelectedFilter from "./SelectedFilter";
import {FiltrationProps} from "../models/IFilterItem";

const FilterItem:FC<FiltrationProps> = ({typeFilter, title, onSelect, selectValue, removeValue}) => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <button
            className="d-flex flex-row flex-nowrap align-items-center btn filterItem-a"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}

        </button>
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
                        // autoFocus
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
        <Col
        >
            <Dropdown className="container-filterItem">
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    {title}
                    <Image
                        className="filterItem-img"
                        src={process.env.REACT_APP_API_URL + "list.png"}/>
                </Dropdown.Toggle>
                {selectValue.name !== "Категории"
                    ? (selectValue.name !== "Бренды" ? <SelectedFilter removeValue={removeValue} title={selectValue.name}/> : "" ) : ""
                }

                <Dropdown.Menu as={CustomMenu}>
                    {typeFilter.map(filtration =>
                        <Dropdown.Item
                            onClick={(e) => onSelect(filtration)}
                            key={filtration._id}
                            eventKey={filtration._id}>
                            {filtration.name}
                        </Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </Col>
    );
};

export default FilterItem;