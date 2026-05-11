import { makeAutoObservable } from "mobx";

export default class BasketStore {
    constructor() {
        this._items = [];
        makeAutoObservable(this);
    }

    setItems(items) {
        this._items = items;
    }

    get items() {
        return this._items;
    }

    get totalPrice() {
        return this._items.reduce((sum, item) => sum + (item.thing?.price || 0), 0);
    }
}