import React, {useEffect, useMemo, useState} from 'react';
import {FC} from "react/index";
import IFilter from "../models/IFilter";
import FilterItem from "./FilterItem";
import {Button, Col, Image, Row} from "react-bootstrap";
import {UseAppDispatch, UseAppSelector} from "../hooks/redux";
import {fetchBrand, fetchCurrentPage, fetchFilter, fetchProducts} from "../store/reducers/ProductsActionCreator";
import {ProductItemsSlice} from "../store/reducers/ProductItemsSlice";
import "../moduleCSS/FilterBar.css"
import DropdownPrice from "./DropdownPrice";
import SortPrice from "./SortPrice";
import {TypesFilterSlice} from "../store/reducers/FilterSlice";
const {productsTypeId, productsBrandId, productPrices} = ProductItemsSlice.actions;
const {setSearchValue} = ProductItemsSlice.actions;
const {selectSortPrice} = TypesFilterSlice.actions;

const FilterBar:FC = () => {

    const dispatch = UseAppDispatch();
    const typesFilter:IFilter[] = UseAppSelector(state => state.TypesFilterSlice.filters)

    const brandsFilter: IFilter[] = UseAppSelector(state => state.BrandsFilterSlice.filters);

    const currentSortPrice = UseAppSelector(state => state.TypesFilterSlice.sortPrice);
    const searchTerm = UseAppSelector(state => state.ProductItemsSlice.searchTerm);
    const selectorType = UseAppSelector(state => state.ProductItemsSlice.type);
    const selectorBrand = UseAppSelector(state => state.ProductItemsSlice.brand);
    const selectorPrices = UseAppSelector(state => state.ProductItemsSlice.prices);
    const selectorFixedPrices = UseAppSelector(state => state.ProductItemsSlice.fixedPrices);

    const [selectMinPrice, setSelectMinPrice] = useState<number | null>(selectorPrices.minPrice);
    const [selectMaxPrice, setSelectMaxPrice] = useState<number | null>(selectorPrices.maxPrice);
    const [toggleFilterBar, setToggleFilterBar] = useState<boolean>(false);

    const [selectedSortPrice, setSelectedSortPrice] = useState<string | null>(null);

    const [selectType, setSelectType] = useState<IFilter>(selectorType);
    const [selectBrand, setSelectBrand] = useState<IFilter>(selectorBrand);

    useEffect(() => {
        setSelectType(selectorType);
        setSelectBrand(selectorBrand);
    }, [selectorType, selectorBrand])

    useEffect(() => {
        setSelectMinPrice(selectorPrices.minPrice);
        setSelectMaxPrice(selectorPrices.maxPrice);
    }, [selectorPrices])

    useEffect(() => {
        setSelectedSortPrice(currentSortPrice)
    }, [currentSortPrice])

    const handlerToggleFilterBar = () => {
        setToggleFilterBar((prevState: boolean) => !prevState)
    }
    const handlerSortPrice = (value: string) => {
        setSelectedSortPrice(value)
    }

    const handlerTypeSelect = (selectedType: IFilter) => {
        setSelectType(selectedType)
    }

    const handlerBrandSelect = (selectedBrand: IFilter) => {
        setSelectBrand(selectedBrand)
    }

    const handlerOnClick = () => {
        setToggleFilterBar(false)
        window.history.pushState({}, '', `/products/p=${1}/brand=${selectBrand.name !== "Бренды" ? selectBrand.name : "_"}/type=${selectType.name !== "Категории" ? selectType.name : "_"}/search=${searchTerm ? encodeURIComponent(searchTerm).replace(/%20/g, '_') : "_"}`);
        dispatch(fetchProducts(searchTerm, 1, 25, selectType.name, selectBrand.name, selectMaxPrice, selectMinPrice, selectedSortPrice));
        dispatch(fetchCurrentPage(1));
        dispatch(productsTypeId(selectType));
        dispatch(productsBrandId(selectBrand));
        dispatch(selectSortPrice(selectedSortPrice))
        setSelectType(selectorType);
        setSelectBrand(selectorBrand);
    }

    const handlerRangeSelect = (selectMinPrice: number, selectMaxPrice: number) => {
        setSelectMinPrice(+selectMinPrice);
        setSelectMaxPrice(+selectMaxPrice);
    }

    const handlerOnReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
        window.history.pushState({}, '', `/products`);
        await dispatch(fetchProducts(null, 1, 25, null, null, null, null, null));
        dispatch(fetchCurrentPage(1));
        dispatch(setSearchValue(""));
        dispatch(productsTypeId({name: "Категории", _id: null}));
        dispatch(productsBrandId({name: "Бренды", _id: null}));
        handlerOnRemoveSortPrice();
    }

    const handlerOnRemoveSortPrice = () => {
        if (currentSortPrice == selectedSortPrice) {
            dispatch(selectSortPrice(null))
        } else {
            setSelectedSortPrice(null);
            dispatch(selectSortPrice(null))
        }
    }

    const handlerOnRemoveBrand = () => {
        if (selectBrand.name == selectorBrand.name) {
            dispatch(productsBrandId({name: "Бренды", _id: null}));
        } else {
            setSelectBrand({name: "Бренды", _id: null})
        }
    }

    const handlerOnRemoveType = () => {
        if (selectType.name == selectorType.name) {
            dispatch(productsTypeId({name: "Категории", _id: null}));
        } else {
            setSelectType({name: "Категории", _id: null})
        }
    }

    const handlerOnRemovePrices = () => {
        if (selectorPrices.minPrice == selectMinPrice && selectorPrices.maxPrice == selectMaxPrice) {
            dispatch(productPrices(selectorFixedPrices))
        } else {
            setSelectMinPrice(selectorPrices.minPrice);
            setSelectMaxPrice(selectorPrices.maxPrice);
        }

    }

    useEffect(() => {
        dispatch(fetchFilter('type'));
        dispatch(fetchBrand('brand'));
    }, [])

    const memoFilterType = useMemo(() => (
        <FilterItem
            title={"Категорія"}
            typeFilter={typesFilter}
            onSelect={handlerTypeSelect}
            selectValue={selectType}
            removeValue={handlerOnRemoveType}
        />
    ), [typesFilter, selectType]);

    const memoFilterBrand = useMemo(() => (
        <FilterItem
            title={"Бренди"}
            typeFilter={brandsFilter}
            onSelect={handlerBrandSelect}
            selectValue={selectBrand}
            removeValue={handlerOnRemoveBrand}
        />
    ), [brandsFilter, selectBrand]);

    const memoPrices = useMemo(() => (
        <DropdownPrice
            minPrice={selectMinPrice}
            maxPrice={selectMaxPrice}
            onPriceChange={handlerRangeSelect}
            removeValue={handlerOnRemovePrices}
        />
    ), [selectMinPrice, selectMaxPrice, selectorPrices])

    const memoSortPrice = useMemo(() => (
        <SortPrice
            changeSortPrice={handlerSortPrice}
            selectSortPrice={selectedSortPrice}
            removeSortPrice={handlerOnRemoveSortPrice}
        />
    ), [selectedSortPrice])

    return (
        <section>
            <Row
                className="container-adaptive-filterBar p-0"
            >
                <Col sm={5} xs={7} className="px-0 controllers-adaptive-filterBar">
                    <Button
                        className="btn-toggle-filterBar d-flex flex-nowrap align-items-center"
                        variant="outline-secondary"
                        size={"sm"}
                        onClick={() => handlerToggleFilterBar()}
                    >
                        Показати фільтр
                        <Image
                            className={`mx-1 btn-toggle-img ${toggleFilterBar ? "" : "btn-toggle-img-hide"}`}
                            width={14}
                            height={19}
                            src={process.env.REACT_APP_API_URL + "down-filled-triangular-arrow.png"}
                        />
                    </Button>
                    <Button
                        onClick={(e) => handlerOnReset(e)}
                        className="btn-filter-clear-inBar"
                        size={"sm"}
                        variant="outline-secondary"
                    >Очистити
                    </Button>
                </Col>
                <Col sm={7} xs={12} className="container-selectFilters">
                    {selectedSortPrice && <span>{selectedSortPrice}</span>}
                    {selectBrand._id && <span>{selectBrand.name}</span>}
                    {selectType._id && <span>{selectType.name}</span>}
                    {(selectMaxPrice !== null && selectMinPrice !== null) ? selectMinPrice !== selectorFixedPrices.minPrice || selectMaxPrice !== selectorFixedPrices.maxPrice ? <span>{selectMinPrice + " грн - " + selectMaxPrice + " грн"}</span> : "" : ""}
                </Col>
            </Row>
            <Row
                className={`container-filterBar ${toggleFilterBar ? " open" : ""}`}
            >
                {memoFilterType}
                {memoSortPrice}
                {memoFilterBrand}
                {memoPrices}
                <Col
                    className="d-flex align-items-center"
                >
                    <Button
                        onClick={() => handlerOnClick()}
                        className="btn-filter-apply"
                        variant="outline-success"
                    >
                        Знайти
                    </Button>
                    <Button
                        onClick={(e) => handlerOnReset(e)}
                        className="btn-filter-clear"
                        variant="outline-success"
                    >Очистити
                    </Button>
                </Col>
            </Row>
        </section>
    );
};

export default FilterBar;