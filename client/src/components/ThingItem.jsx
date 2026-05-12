import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import {LOGIN_ROUTE, THING_ROUTE} from "../utils/consts.js";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";
import {deleteThing} from "../http/thingApi.js";
import {addToBasket} from "../http/basketApi.js";

const BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5001';

const ThingItem = observer(({thing, onDeleted}) => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [addingToCart, setAddingToCart] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToBasket = async (e) => {
        e.stopPropagation();
        if (!user.isAuth) { navigate(LOGIN_ROUTE); return; }
        setAddingToCart(true);
        try {
            await addToBasket(thing.id);
            setAdded(true);
            setTimeout(() => setAdded(false), 2500);
        } catch (e) { console.error(e); }
        finally { setAddingToCart(false); }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm(`Удалить "${thing.name}"?`)) return;
        try {
            await deleteThing(thing.id);
            if (onDeleted) onDeleted(thing.id);
        } catch (e) { alert(e, "Ошибка при удалении"); }
    }

    return (
        <div
            className="flex flex-col w-full bg-white rounded-2xl shadow-sm cursor-pointer overflow-hidden relative group"
            onClick={() => navigate(THING_ROUTE + "/" + thing.id)}
        >
            {user.isAuth && user.user?.role === 'ADMIN' && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-xs"
                    title="Удалить"
                >✕</button>
            )}

            {/* Image */}
            <div className="flex justify-center items-center bg-[#DADADA] rounded-xl w-full aspect-square sm:h-56 md:h-64 p-1">
                <img
                    src={`${BASE_URL}/${thing.img}`}
                    className="w-full h-full object-contain"
                    alt={thing.name}
                />
            </div>

            {/* Info */}
            <div className="flex flex-col px-2.5 py-2">
                <p className="text-[10px] uppercase text-gray-400 font-medium tracking-wider leading-none">
                    {thing.brand?.name || 'Бренд не указан'}
                </p>
                <p className="text-[15px] sm:text-[18px] font-bold leading-tight mt-0.5 line-clamp-2">
                    {thing.name}
                </p>
                <p className="text-[11px] sm:text-[13px] text-gray-500 mt-0.5">{thing.type?.name}</p>

                <div className="flex justify-between items-center mt-1.5">
                    <p className="text-[15px] sm:text-[17px] font-black">
                        {thing.price?.toLocaleString()} ₽
                    </p>
                    {/* Quick add to cart button */}
                    <button
                        onClick={handleAddToBasket}
                        disabled={addingToCart}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                            added ? 'bg-green-500 text-white' : 'bg-black text-white hover:scale-110 active:scale-95'
                        } disabled:opacity-50`}
                        title="В корзину"
                    >
                        {added
                            ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ThingItem;
