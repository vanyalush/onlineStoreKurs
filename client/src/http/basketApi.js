import {$authHost} from "./index.js";

export const fetchBasket = async () => {
    const {data} = await $authHost.get("/api/basket");
    return data;
}

export const addToBasket = async (thingId) => {
    const {data} = await $authHost.post("/api/basket", {thingId});
    return data;
}

export const removeFromBasket = async (thingId) => {
    const {data} = await $authHost.delete("/api/basket/" + thingId);
    return data;
}

export const clearBasket = async () => {
    const {data} = await $authHost.delete("/api/basket");
    return data;
}