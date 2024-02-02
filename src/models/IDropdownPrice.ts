export interface IRangeProps {
    minPrice: number;
    maxPrice: number;
    onPriceChange: () => {};
    removeValue: () => {};
}