import IRoutes from "./models/IRoutes";
import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    COMMENTS_ROUTE,
    DEVICE_ROUTE,
    LOGIN_ROUTE,
    MAIN_ROUTE,
    ORDER_ROUTE,
    REGISTRATION_ROUTE,
    SAVE_LIST_ROUTE,
    RECOVERY_PASSWORD_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    ORDER_ROUTE_ACCEPT,
    ORDER_ROUTE_REJECT
} from "./utils/consts";
import Auth from "./pages/Auth";
import Main from "./pages/Main";
import SelectedDevice from "./pages/SelectedDevice";
import Basket from "./pages/Basket";
import Admin from "./pages/Admin";
import Order from "./pages/Order";
import Comments from "./pages/Comments";
import SaveList from "./pages/SaveList";
import RecoveryPassword from "./pages/RecoveryPassword";
import ForgotPassword from "./components/ForgotPassword";
import OAccept from "./pages/OAccept";
import OReject from "./pages/OReject";

export const authRoutes: IRoutes[] = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: ORDER_ROUTE,
        Component: Order
    },
    {
        path: COMMENTS_ROUTE,
        Component: Comments
    },
    {
        path: SAVE_LIST_ROUTE,
        Component: SaveList
    },
    {
        path: ORDER_ROUTE_ACCEPT,
        Component: OAccept
    },
    {
        path: ORDER_ROUTE_REJECT,
        Component: OReject
    }

]

export const publicRoutes: IRoutes[] = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: RECOVERY_PASSWORD_ROUTE,
        Component: RecoveryPassword
    },
    {
        path: FORGOT_PASSWORD_ROUTE,
        Component: ForgotPassword
    },
    {
        path: MAIN_ROUTE,
        Component: Main
    },
    {
        path: DEVICE_ROUTE + '/:productName',
        Component: SelectedDevice
    }
]