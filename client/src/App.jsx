import React, {useContext, useEffect} from 'react';
import './App.css'
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";
import Header from "./components/Header.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "./main.jsx";
import {check} from "./http/userApi.js";

const App = observer(() => {
    const {user} = useContext(Context)

    useEffect(() => {
        check()
            .then(data => {
                user.setUser(data);
                user.setIsAuth(true);
            })
            .catch(err => {
                console.log("Пользователь не авторизован:", err);
                user.setIsAuth(false);
            });
    }, []);
    return (
        <BrowserRouter>
            <Header/>
            <AppRouter/>
        </BrowserRouter>
    );
});

export default App;