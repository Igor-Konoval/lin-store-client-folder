import axios from "axios";
import {UserCheckSlice} from "../reducers/UserCheckSlice";
import {AppDispatch} from "../store";
import {logout} from "../../http/userAPI";
import {$authHost} from "../../http/interceptors";
const {userCheckError, userCheckSuccess, fetchUserCheck, userLogoutSuccess, userLogoutError, fetchLogoutCheck} = UserCheckSlice.actions;

export const check = (fingerprint: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(fetchUserCheck());
        const {data} = await $authHost.post<string>('user/auth',
            {
                fingerprint
            });
        // if (data !== "не авторизован" && data !== "failed" && data !== "пользователь" && status === 200) {
        if (data.split(' ')[0] === "ok") {

            localStorage.clear();
            localStorage.setItem("bTok", data.split(' ')[1]);
            dispatch(userCheckSuccess());
        } else {
            dispatch(userCheckError(data));
            localStorage.clear();
        }
    } catch (e) {
        dispatch(userCheckError(e.message));
    }
}

export const logoutDispatch = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(fetchLogoutCheck());
        const data = await logout()
        if (data === "ok") {
            localStorage.clear()
            dispatch(userLogoutSuccess());
            window.location.reload();
        } else {
            localStorage.clear()
            dispatch(userLogoutError(data));
        }
    } catch (e) {
        dispatch(userLogoutError(e.message));
    }
}