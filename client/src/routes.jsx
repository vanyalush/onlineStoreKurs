import Admin from "./pages/Admin.jsx";
import {ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, THING_ROUTE} from "./utils/consts.js";
import Basket from "./pages/Basket.jsx";
import Auth from "./pages/Auth.jsx";
import ThingPage from "./pages/ThingPage.jsx";
import Shop from "./pages/Shop.jsx";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin,
    },
    {
        path: BASKET_ROUTE,
        Component: Basket,
    }
]
export const publicRoutes = [
    {
        path: REGISTRATION_ROUTE,
        Component: Auth,
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth,
    },
    {
        path: SHOP_ROUTE,
        Component: Shop,
    },
    {
        path: THING_ROUTE + '/:id',
        Component: ThingPage,
    },
]