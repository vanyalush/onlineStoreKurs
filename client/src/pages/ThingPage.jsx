import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {fetchOneThing} from "../http/thingApi.js";
import {addToBasket} from "../http/basketApi.js";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";
import {BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE} from "../utils/consts.js";

const BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5001';

const ThingPage = observer(() => {
    const {id} = useParams();
    const {user} = useContext(Context);
    const navigate = useNavigate();

    const [thing, setThing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetchOneThing(id)
            .then(data => setThing(data))
            .catch(() => navigate(SHOP_ROUTE))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToBasket = async () => {
        if (!user.isAuth) { navigate(LOGIN_ROUTE); return; }
        setAddingToCart(true);
        try {
            await addToBasket(thing.id);
            setAdded(true);
            setTimeout(() => setAdded(false), 2500);
        } catch (e) { console.error(e); }
        finally { setAddingToCart(false); }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <svg className="animate-spin" width="32" height="32" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
            </div>
        );
    }

    if (!thing) return null;

    return (
        <div className="w-[92%] mx-auto mt-6 sm:mt-10 mb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
                <button onClick={() => navigate(SHOP_ROUTE)} className="hover:text-black transition-colors">Магазин</button>
                <span>›</span>
                {thing.type?.name && (<><span>{thing.type.name}</span><span>›</span></>)}
                <span className="text-black font-medium">{thing.name}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                {/* Image */}
                <div className="md:w-5/12 flex-shrink-0">
                    <div className="bg-[#DADADA] rounded-2xl flex items-center justify-center overflow-hidden"
                        style={{aspectRatio: '3/4', maxHeight: '520px'}}>
                        <img
                            src={`${BASE_URL}/${thing.img}`}
                            alt={thing.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 py-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                            {thing.brand?.name || ''}
                        </span>
                        {thing.type?.name && (
                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                                {thing.type.name}
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">{thing.name}</h1>

                    <div className="flex items-baseline gap-3 mb-5">
                        <span className="text-3xl sm:text-4xl font-black">{thing.price?.toLocaleString()} ₽</span>
                    </div>

                    {thing.size && (
                        <div className="mb-5">
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Размер</p>
                            <div className="flex gap-2 flex-wrap">
                                {thing.size.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                                    <span key={s} className="px-3 sm:px-4 py-1.5 border border-black rounded-lg text-sm font-medium">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {thing.description && (
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Описание</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{thing.description}</p>
                        </div>
                    )}

                    {thing.info?.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Характеристики</p>
                            <div className="flex flex-col gap-2">
                                {thing.info.map(item => (
                                    <div key={item.id} className="flex justify-between border-b border-gray-100 pb-1.5">
                                        <span className="text-sm text-gray-500">{item.title}</span>
                                        <span className="text-sm font-medium">{item.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4">
                        <button
                            onClick={handleAddToBasket}
                            disabled={addingToCart}
                            className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                added ? 'bg-green-500 text-white scale-[0.98]'
                                    : 'bg-black text-white hover:scale-[1.02] active:scale-[0.98]'
                            } disabled:opacity-60`}
                        >
                            {added ? '✓ Добавлено в корзину' : addingToCart ? 'Добавляем...' : 'В корзину'}
                        </button>
                        {user.isAuth && (
                            <button
                                onClick={() => navigate(BASKET_ROUTE)}
                                className="h-12 px-5 rounded-xl border border-black text-sm font-medium hover:bg-black hover:text-white transition-all duration-200 sm:w-auto w-full"
                            >
                                Перейти в корзину
                            </button>
                        )}
                    </div>

                    {!user.isAuth && (
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            <button onClick={() => navigate(LOGIN_ROUTE)} className="underline hover:text-black">Войдите</button>, чтобы добавить в корзину
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ThingPage;
