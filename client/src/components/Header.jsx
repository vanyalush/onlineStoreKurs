import React, {useContext, useState} from 'react';
import {Context} from "../main.jsx";
import {Button} from "react-bootstrap";
import {LOGIN_ROUTE, SHOP_ROUTE} from "../utils/consts.js";
import {observer} from "mobx-react-lite";
import {Link, useNavigate} from "react-router-dom";
import AdminModal from "../pages/Admin.jsx";

const Header = observer(() => {
    const {user, thing} = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    const logout = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
    }

    const handleSearch = (e) => {
        e.preventDefault();
        thing.setSearchQuery(searchInput.trim());
        navigate(SHOP_ROUTE);
    }

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        if (e.target.value === '') {
            thing.setSearchQuery('');
        }
    }

    return (
        <div className="bg-black h-14 flex items-center sticky top-0 z-40">
            <div className="w-9/12 mx-auto flex flex-row justify-between items-center gap-4">
                <Link className="headline4 no-underline text-white shrink-0" to={SHOP_ROUTE}>HEAVPLCE</Link>

                {/* Поиск */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md flex items-center">
                    <div className="flex w-full rounded-lg overflow-hidden border border-[#333] focus-within:border-[#666]">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchChange}
                            placeholder="Поиск товаров..."
                            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 py-1.5 outline-none placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            className="bg-[#1a1a1a] px-3 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                </form>

                {user.isAuth ?
                    <div className="flex flex-row items-center gap-2">
                        {user.user?.role === 'ADMIN' &&
                            <Button variant="outline-light" className="w-auto text-sm" onClick={() => setOpen(true)}>Админ</Button>
                        }
                        <Button variant="outline-light" className="text-sm" onClick={logout}>Выйти</Button>
                        <AdminModal isOpen={open} onClose={() => setOpen(false)} />
                    </div>
                    :
                    <Link to={LOGIN_ROUTE}>
                        <Button variant="outline-light" className="text-sm">Войти</Button>
                    </Link>
                }
            </div>
        </div>
    );
});

export default Header;
