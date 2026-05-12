import React, { useEffect, useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { fetchBasket, removeFromBasket } from "../http/basketApi";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts.js";

const Basket = observer(() => {
    const { basket } = useContext(Context);
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchBasket().then(data => basket.setItems(data));
    }, [basket]);

    const remove = (id) => {
        removeFromBasket(id).then(() => {
            basket.setItems(basket.items.filter(item => item.thingId !== id));
        });
    };

    if (basket.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4 px-4 text-center">
                <svg width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <p className="text-xl font-semibold text-gray-700">Корзина пуста</p>
                <p className="text-gray-400 text-sm">Добавьте товары, чтобы они появились здесь</p>
                <button
                    onClick={() => navigate(SHOP_ROUTE)}
                    className="mt-2 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Перейти в магазин
                </button>
            </div>
        );
    }

    return (
        <div className="w-[92%] mx-auto mt-6 pb-12">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Корзина</h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Items list */}
                <div className="flex-1 flex flex-col gap-3">
                    {basket.items.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-3 sm:gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#DADADA] rounded-xl flex-shrink-0 overflow-hidden">
                                <img
                                    src={`${BASE_URL}/${item.thing.img}`}
                                    alt={item.thing.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                                    {item.thing.brand?.name || ''}
                                </p>
                                <p className="font-semibold text-sm sm:text-base leading-tight truncate">{item.thing.name}</p>
                                <p className="text-base sm:text-lg font-black mt-0.5">{item.thing.price?.toLocaleString()} ₽</p>
                            </div>
                            <button
                                onClick={() => remove(item.thingId)}
                                className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
                                title="Удалить"
                            >
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order summary */}
                <div className="lg:w-72 xl:w-80">
                    <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
                        <h4 className="font-bold text-base mb-4">Детали заказа</h4>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>Товары ({basket.items.length})</span>
                            <span>{basket.totalPrice?.toLocaleString()} ₽</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <span>Доставка</span>
                            <span className="text-green-600 font-medium">Бесплатно</span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between mb-5">
                            <span className="font-bold">Итого</span>
                            <span className="font-black text-xl">{basket.totalPrice?.toLocaleString()} ₽</span>
                        </div>
                        <button className="w-full py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all">
                            Оформить заказ
                        </button>
                        <button
                            onClick={() => navigate(SHOP_ROUTE)}
                            className="w-full mt-2 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                        >
                            Продолжить покупки
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Basket;
