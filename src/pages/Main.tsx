import React from 'react';
import {FC} from "react/index";
import ProductList from "../components/ProductList";
import FilterBar from "../components/FilterBar";
import OldViews from "../components/OldViews";

const Main:FC = () => {
    return (
        <>
            <section>
                <FilterBar/>
                <main>
                    <ProductList/>
                </main>
            </section>
            <aside>
                <OldViews/>
            </aside>
        </>
    );
};

export default Main;