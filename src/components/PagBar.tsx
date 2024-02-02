import React, {useMemo} from 'react';
import {FC} from "react/index";
import {Pagination} from "react-bootstrap";
import {UseAppDispatch, UseAppSelector} from "../hooks/redux";
import {ProductItemsSlice} from "../store/reducers/ProductItemsSlice";
import {fetchProducts} from "../store/reducers/ProductsActionCreator";
const {productsPage} = ProductItemsSlice.actions;
const PagBar:FC = () => {

    const selectSortPrice = UseAppSelector(state => state.TypesFilterSlice.sortPrice);
    const currentPage = UseAppSelector(state => state.ProductItemsSlice.currentPage);
    const searchTerm = UseAppSelector(state => state.ProductItemsSlice.searchTerm);
    const {minPrice, maxPrice} = UseAppSelector(state => state.ProductItemsSlice.prices);
    const totalPages = UseAppSelector(state => state.ProductItemsSlice.totalPages);
    const selectedType = UseAppSelector(state => state.ProductItemsSlice.type);
    const selectedBrand = UseAppSelector(state => state.ProductItemsSlice.brand);

    const dispatch = UseAppDispatch();

    const pages = useMemo(() => {
        const calculatedPages = [];
        for (let i = 0; i < totalPages; i++) {
            calculatedPages.push(1 + i);
        }
        return calculatedPages;
    }, [totalPages]);

    return (
        <div className="d-flex justify-content-center align-content-center">
            <Pagination className="mt-5">
                <Pagination.First onClick={() => {
                    dispatch(productsPage(1))
                    window.history.pushState({}, '', `/products/p=${1}/brand=${selectedBrand.name !== "Бренды" ? selectedBrand.name : "_"}/type=${selectedType.name !== "Категории" ? selectedType.name : "_"}/search=${searchTerm ? encodeURIComponent(searchTerm).replace(/%20/g, '_') : "_"}`);
                    dispatch(fetchProducts(searchTerm, 1, 25, selectedType.name, selectedBrand.name, maxPrice, minPrice, selectSortPrice));
                    window.scrollTo({
                        top: 0
                    })
                }}/>
                {pages.map(value =>
                    <Pagination.Item onClick={(e) => {
                        dispatch(productsPage(value))
                        window.history.pushState({}, '', `/products/p=${value}/brand=${selectedBrand.name !== "Бренды" ? selectedBrand.name : "_"}/type=${selectedType.name !== "Категории" ? selectedType.name : "_"}/search=${searchTerm ? encodeURIComponent(searchTerm).replace(/%20/g, '_') : "_"}`);

                        dispatch(fetchProducts(searchTerm, value, 25, selectedType.name, selectedBrand.name, maxPrice, minPrice, selectSortPrice));
                        window.scrollTo({
                            top: 0
                        })
                    }}
                     active={currentPage === value} key={value}>{value}</Pagination.Item>
                )}
                <Pagination.Last onClick={() => {
                    dispatch(productsPage(pages.length))
                    window.history.pushState({}, '', `/products/p=${pages.length}/brand=${selectedBrand.name !== "Бренды" ? selectedBrand.name : "_"}/type=${selectedType.name !== "Категории" ? selectedType.name : "_"}/search=${searchTerm ? encodeURIComponent(searchTerm).replace(/%20/g, '_') : "_"}`);
                    dispatch(fetchProducts(searchTerm, pages.length, 25, selectedType.name, selectedBrand.name, maxPrice, minPrice, selectSortPrice));
                    window.scrollTo({
                        top: 0
                    })
                }}/>
            </Pagination>
        </div>

    );
};

export default PagBar;