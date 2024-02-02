import {ReactNode} from "react";
import {FC} from "react/index";

export default interface IRoutes {
    path: string,
    Component: FC
}