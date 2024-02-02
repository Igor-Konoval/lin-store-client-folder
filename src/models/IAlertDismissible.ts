import {IErrorMessage} from "./ISelectedDevice";

export interface IAlertDismissible {
    showAlertDis: boolean,
    setShowAlertDis: (value: boolean) => {},
    errorMessage: IErrorMessage
}