import React, {useContext} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts.js";
import {login, registration} from "../http/userApi.js";
import {Context} from "../main.jsx";


const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const {user} = useContext(Context)

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const click = async () => {
        try{
            let data
            if(isLogin) {
                data = await login(email, password);
            }else{
                data = await registration(email, password);
            }
            user.setUser(data);
            user.setIsAuth(true)
            navigate(SHOP_ROUTE);
        }catch(err){
            alert(err.response.data.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm mb-30">

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                    <button
                        onClick={() => navigate(LOGIN_ROUTE)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                            isLogin
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200 '
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Войти
                    </button>
                    <button
                        onClick={() => navigate(REGISTRATION_ROUTE)}
                        className={`flex-1 py-2 text-sm font-medium transition-all ${
                            !isLogin
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200 '
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Регистрация
                    </button>
                </div>

                <div className="space-y-4">

                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Пароль</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                        />
                    </div>

                    <button
                        className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all "
                        onClick={click}
                    >
                        {isLogin ? 'Войти' : 'Создать аккаунт'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Auth;