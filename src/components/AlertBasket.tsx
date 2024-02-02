import React from 'react';
import {FC} from "react/index";
import {Overlay} from "react-bootstrap";
import {IAlertBasket} from "../models/IAlertBasket";

const AlertBasket:FC<IAlertBasket> = ({message, show, target}) => {

    return (
        <Overlay target={target.current} show={show} placement="top-start">
            {({
                  placement: _placement,
                  arrowProps: _arrowProps,
                  show: _show,
                  popper: _popper,
                  hasDoneInitialMeasure: _hasDoneInitialMeasure,
                  ...props
              }) => (
                <div
                    {...props}
                    style={{
                        position: 'absolute',
                        backgroundColor: 'rgb(45,181,201)',
                        padding: '7px 15px',
                        fontSize: "18px",
                        marginBottom: "10px",
                        zIndex: "1000000000",
                        color: 'white',
                        opacity: 0.9,
                        borderRadius: 8,
                        ...props.style,
                    }}
                >
                    {message}
                </div>
            )}
        </Overlay>
    );
};

export default AlertBasket;