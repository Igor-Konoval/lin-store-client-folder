import {IErrorMessage} from "./ISelectedDevice";
import {IGetAllComments} from "../http/commentApi";

export interface IChangeComment {
    show: boolean,
    showChangeResponse: boolean,
    onHide: () => {},
    productId: string,
    commentUserId: string,
    changeCommentData: string,
    responseCommentUserId: string,
    setChangeCommentData: string,
    setShowAlertDis: () => {},
    setErrorMessage: IErrorMessage,
    setCommentsProduct: (comments: IGetAllComments[]) => {},
}