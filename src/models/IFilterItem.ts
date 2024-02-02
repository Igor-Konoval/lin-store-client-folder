import IFilter from "./IFilter";

export interface FiltrationProps {
    onSelect?: () => {},
    title: string,
    typeFilter: IFilter[],
    selectValue: IFilter,
    removeValue: () => {}
}