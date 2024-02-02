import {IGetAllComments} from "../http/commentApi";

export interface IRemoveComment {
    show: boolean,
    showRemoveResponse: boolean,
    onHide: (a: boolean) => {},
    productId: string,
    responseCommentUserId: string,
    commentUserId: string,
    setErrorMessage: ({}) => {},
    setShowAlertDis: (a: boolean) => {},
    setCommentsProduct: (comments: IGetAllComments[]) => {},
}