export interface ISelectedFilter {
    title?: string,
    prices?: IPrices,
    sortTitle?: string | null,
    removeValue: () => {}
}