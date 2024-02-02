import React from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FC} from "react/index";
import {IOverlayComponent} from "../models/IOverlayComponent";

const OverlayComponent:FC<IOverlayComponent> = ({messageValue, component}) => {
    const renderOverlay = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {messageValue}
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderOverlay}
        >
            {component}
        </OverlayTrigger>
    );
}

export default OverlayComponent;