import React, {useContext, useEffect} from 'react';
import TypeBar from "../components/TypeBar.jsx";
import BrandBar from "../components/BrandBar.jsx";
import ThingList from "../components/ThingList.jsx";
import PriceBar from "../components/PriceBar.jsx";
import {Context} from "../main.jsx";
import {fetchBrands, fetchThings, fetchTypes} from "../http/thingApi.js";
import Pages from "../components/Pages.jsx";
import {observer} from "mobx-react-lite";

const Shop = observer(() => {
    const {thing} = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => thing.setTypes(data));
        fetchBrands().then(data => thing.setBrands(data));
    }, [thing]);

    useEffect(() => {
        thing.setLoading(true);
        const typeId = thing.selectedType?.id || null;
        const brandId = thing.selectedBrand?.id || null;
        const search = thing.searchQuery || null;

        fetchThings(typeId, brandId, thing.page, thing.limit, search, thing.minPrice, thing.maxPrice)
            .then(data => {
                thing.setTotalCount(data.count || 0);
                thing.setThings(data.rows || []);
            })
            .catch(err => {
                console.error("Ошибка загрузки:", err);
                thing.setThings([]);
            })
            .finally(() => thing.setLoading(false));
    }, [thing, thing.selectedType, thing.selectedBrand, thing.page, thing.limit, thing.searchQuery, thing.minPrice, thing.maxPrice]);

    return (
        <div className="flex flex-row w-11/12 mx-auto px-4 mt-4">
            <div className="w-64 flex-shrink-0">
                <TypeBar />
            </div>

            <div className="flex flex-col flex-1 ml-6">
                <div className="flex flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex-1">
                        <BrandBar />
                    </div>
                    <div className="w-72">
                        <PriceBar />
                    </div>
                </div>

                <ThingList />
                <Pages/>
            </div>
        </div>
    );
});

export default Shop;