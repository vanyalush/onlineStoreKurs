import React, {useContext, useEffect, useState} from 'react';
import TypeBar from "../components/TypeBar.jsx";
import BrandBar from "../components/BrandBar.jsx";
import ThingList from "../components/ThingList.jsx";
import PriceBar from "../components/PriceBar.jsx";
import {Context} from "../main.jsx";
import {fetchBrands, fetchThings, fetchTypes} from "../http/thingApi.js";
import Pages from "../components/Pages.jsx";
import {observer} from "mobx-react-lite";

const Shop = observer(() => {
    const {thing} = useContext(Context);
    const [filtersOpen, setFiltersOpen] = useState(false);

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
        <div className="w-[92%] mx-auto mt-4 pb-8">

            {/* Mobile filter toggle button */}
            <div className="flex sm:hidden justify-between items-center mb-3">
                <p className="text-sm text-gray-500">{thing.totalCount} товаров</p>
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round"/>
                    </svg>
                    Фильтры {(thing.selectedType?.id || thing.selectedBrand?.id || thing.minPrice > 0 || thing.maxPrice > 0) && '•'}
                </button>
            </div>

            {/* Mobile filters drawer */}
            {filtersOpen && (
                <div className="sm:hidden bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-sm">Фильтры</span>
                        <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-black">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Категории</p>
                    <TypeBar />
                    <div className="mt-4">
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Бренды</p>
                        <BrandBar />
                    </div>
                    <div className="mt-4">
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Цена</p>
                        <PriceBar />
                    </div>
                    <button
                        onClick={() => setFiltersOpen(false)}
                        className="mt-4 w-full py-2 bg-black text-white rounded-xl text-sm font-medium"
                    >
                        Применить
                    </button>
                </div>
            )}

            <div className="hidden sm:flex flex-row gap-6">
                {/* Sidebar */}
                <div className="w-44 flex-shrink-0">
                    <TypeBar />
                </div>
                {/* Main content */}
                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-row flex-wrap justify-between items-start mb-4 gap-3">
                        <div className="flex-1 min-w-0">
                            <BrandBar />
                        </div>
                        <div className="shrink-0">
                            <PriceBar />
                        </div>
                    </div>
                    <ThingList />
                    <Pages />
                </div>
            </div>

            <div className="sm:hidden">
                <ThingList />
                <Pages />
            </div>
        </div>
    );
});

export default Shop;
