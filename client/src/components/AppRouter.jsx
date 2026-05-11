import React, {useContext} from 'react';
import {authRoutes, publicRoutes} from "../routes.jsx";
import { SHOP_ROUTE} from "../utils/consts.js";
import {Navigate, Route, Routes} from "react-router-dom";
import {Context} from "../main.jsx"
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const {user} = useContext(Context)

    console.log(user)
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component/>} />
            )}
            {publicRoutes.map(({path,Component}) =>
                <Route key={path} path={path} element={<Component/>} />
            )}
            <Route path="*" element={<Navigate to={SHOP_ROUTE}/>}/>
        </Routes>
    );
});

export default AppRouter;