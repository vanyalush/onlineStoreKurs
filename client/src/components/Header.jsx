import React, {useContext, useState} from 'react';
import {Context} from "../main.jsx";
import {Button} from "react-bootstrap";
import {LOGIN_ROUTE, SHOP_ROUTE, BASKET_ROUTE} from "../utils/consts.js";
import {observer} from "mobx-react-lite";
import {Link, useNavigate} from "react-router-dom";
import AdminModal from "../pages/Admin.jsx";

const Header = observer(() => {
    const {user, thing} = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
        setMobileMenuOpen(false);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        thing.setSearchQuery(searchInput.trim());
        navigate(SHOP_ROUTE);
        setMobileSearchOpen(false);
        setMobileMenuOpen(false);
    }

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        if (e.target.value === '') thing.setSearchQuery('');
    }

    return (
        <div className="bg-black sticky top-0 z-40">
            {/* Desktop & Tablet */}
            <div className="hidden sm:flex h-14 items-center w-[92%] mx-auto flex-row justify-between gap-4">
                <Link className="headline4 no-underline text-white shrink-0" to={SHOP_ROUTE}>HEAVPLCE</Link>
                <form onSubmit={handleSearch} className="flex-1 max-w-md flex items-center">
                    <div className="flex w-full rounded-lg overflow-hidden border border-[#333] focus-within:border-[#666]">
                        <input type="text" value={searchInput} onChange={handleSearchChange}
                               placeholder="Поиск товаров..."
                               className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 py-1.5 outline-none placeholder-gray-500"/>
                        <button type="submit" className="bg-[#1a1a1a] px-3 text-gray-400 hover:text-white transition-colors">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
                {user.isAuth ?
                    <div className="flex flex-row items-center gap-2">
                        <button onClick={() => navigate(BASKET_ROUTE)} className="text-white hover:text-gray-300 transition-colors p-1">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                        </button>
                        {user.user?.role === 'ADMIN' &&
                            <Button variant="outline-light" className="w-auto text-sm" onClick={() => setOpen(true)}>Админ</Button>}
                        <Button variant="outline-light" className="text-sm" onClick={logout}>Выйти</Button>
                        <AdminModal isOpen={open} onClose={() => setOpen(false)} />
                    </div>
                    :
                    <Link to={LOGIN_ROUTE}><Button variant="outline-light" className="text-sm">Войти</Button></Link>
                }
            </div>

            {/* Mobile top bar */}
            <div className="flex sm:hidden h-14 items-center px-4 justify-between">
                <Link className="font-bold text-lg no-underline text-white" to={SHOP_ROUTE}>HEAVPLCE</Link>
                <div className="flex items-center gap-3">
                    <button onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false); }} className="text-white p-1">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                        </svg>
                    </button>
                    {user.isAuth && (
                        <button onClick={() => navigate(BASKET_ROUTE)} className="text-white p-1">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                        </button>
                    )}
                    <button onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileSearchOpen(false); }} className="text-white p-1">
                        {mobileMenuOpen
                            ? <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></svg>
                            : <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/></svg>
                        }
                    </button>
                </div>
            </div>

            {/* Mobile search bar */}
            {mobileSearchOpen && (
                <div className="sm:hidden bg-black border-t border-[#222] px-4 pb-3">
                    <form onSubmit={handleSearch} className="flex items-center">
                        <div className="flex w-full rounded-lg overflow-hidden border border-[#333] focus-within:border-[#666]">
                            <input autoFocus type="text" value={searchInput} onChange={handleSearchChange}
                                   placeholder="Поиск товаров..."
                                   className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 py-2 outline-none placeholder-gray-500"/>
                            <button type="submit" className="bg-[#1a1a1a] px-3 text-gray-400 hover:text-white">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-black border-t border-[#222] px-4 pb-4 flex flex-col gap-2">
                    {user.isAuth ? (
                        <>
                            {user.user?.role === 'ADMIN' && (
                                <button className="text-white text-left py-2.5 border-b border-[#222] text-sm"
                                        onClick={() => { setOpen(true); setMobileMenuOpen(false); }}>
                                    Панель администратора
                                </button>
                            )}
                            <button className="text-gray-400 text-left py-2.5 text-sm hover:text-white" onClick={logout}>
                                Выйти
                            </button>
                            <AdminModal isOpen={open} onClose={() => setOpen(false)} />
                        </>
                    ) : (
                        <Link to={LOGIN_ROUTE} className="text-white py-2.5 text-sm no-underline" onClick={() => setMobileMenuOpen(false)}>
                            Войти / Зарегистрироваться
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
});

export default Header;
