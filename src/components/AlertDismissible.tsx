import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import {FC} from "react/index";
import {IAlertDismissible} from "../models/IAlertDismissible";

const AlertDismissible:FC<IAlertDismissible> = ({showAlertDis, setShowAlertDis, errorMessage}) => {

    return (
        <Alert
            show={showAlertDis}
            variant="info"
            style={{
                backgroundColor: "rgb(255 255 255)",
                position: "fixed",
                bottom: "32%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "45%",
                borderRadius: "10px",
                zIndex: "10",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}
        >
            <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                Oops! {errorMessage.errorTitle}
            </div>
            <p style={{ margin: "10px 0", fontSize: "20px" }}>
                {errorMessage.errorData}
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => setShowAlertDis(false)} variant="info">
                    Зрозумів, дякую!
                </Button>
            </div>
        </Alert>
    );
}

export default AlertDismissible;