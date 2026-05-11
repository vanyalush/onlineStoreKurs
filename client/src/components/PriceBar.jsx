import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main";

const PriceBar = observer(() => {
    const {thing} = useContext(Context);

    return (
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2 border border-transparent hover:border-gray-200 transition-all">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Цена</span>

            <div className="flex items-center gap-1">
                <input
                    type="number"
                    placeholder="от"
                    className="w-14 bg-transparent text-xs outline-none font-medium placeholder:text-gray-400"
                    value={thing.minPrice || ''}
                    onChange={e => thing.setMinPrice(Number(e.target.value))}
                />
                <div className="w-[1px] h-3 bg-gray-300"></div>
                <input
                    type="number"
                    placeholder="до"
                    className="w-14 bg-transparent text-xs outline-none font-medium placeholder:text-gray-400"
                    value={thing.maxPrice || ''}
                    onChange={e => thing.setMaxPrice(Number(e.target.value))}
                />
            </div>

            {(thing.minPrice > 0 || thing.maxPrice > 0) && (
                <button
                    onClick={() => {thing.setMinPrice(0); thing.setMaxPrice(0)}}
                    className="flex items-center justify-center hover:text-red-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
});

export default PriceBar;