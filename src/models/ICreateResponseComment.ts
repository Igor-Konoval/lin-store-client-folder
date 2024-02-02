import {IErrorMessage} from "./ISelectedDevice";
import {IGetAllComments} from "../http/commentApi";

export interface ICreateResponseComment {
    show: boolean,
    onHide: (value: false) => {},
    productId: string,
    commentUserId: string,
    mainCommentUserId: string,
    setErrorMessage: IErrorMessage,
    setShowAlertDis: (value: boolean) => {},
    setCommentsProduct: (comments: IGetAllComments[]) => {},
}