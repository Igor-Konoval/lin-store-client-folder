import {IErrorMessage} from "./ISelectedDevice";
import {IGetAllComments} from "../http/commentApi";

export interface ICreateComment {
    show: boolean,
    onHide: (value: boolean) => {},
    productId: string,
    setShowAlertDis: (value: boolean) => {},
    setErrorMessage: IErrorMessage,
    setCommentsProduct: (comments: IGetAllComments[]) => {},
}