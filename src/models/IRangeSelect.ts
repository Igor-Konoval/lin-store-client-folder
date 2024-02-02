export interface IRangeProps {
    minPrice: number;
    maxPrice: number;
    onPriceChange: (min: number, max: number) => void;
    onWidthChange: (width: number) => void;
}