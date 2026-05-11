import {makeAutoObservable} from "mobx";

export default class ThingStore {
    constructor() {
        this._types = []
        this._brands = []
        this._things = []
        this._selectedType = {}
        this._selectedBrand = {}
        this._isLoading = true;
        this._page = 1;
        this._totalCount = 0;
        this._limit = 9;
        this._searchQuery = '';
        this._minPrice = 0;
        this._maxPrice = 0;
        makeAutoObservable(this)
    }
    setTypes(types) {
        this._types = types
    }
    setBrands(brands) {
        this._brands = brands
    }
    setThings(things) {
        this._things = things; this._isLoading = false;
    }
    setLoading(loading) {
        this._isLoading = loading;
    }
    setSelectedType(type) {
        this._selectedType = type; this._page = 1;
    }
    setSelectedBrand(brand) {
        this._selectedBrand = brand; this._page = 1;
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count;
    }
    setLimit(limit) {
        this._limit = limit;
    }
    setSearchQuery(query) {
        this._searchQuery = query; this._page = 1;
    }
    setMinPrice(price) {
        this._minPrice = price
    }
    setMaxPrice(price) {
        this._maxPrice = price
    }

    get types() {
        return this._types;
    }
    get brands() {
        return this._brands;
    }
    get things() {
        return this._things;
    }
    get selectedType() {
        return this._selectedType;
    }
    get selectedBrand() {
        return this._selectedBrand;
    }
    get totalCount() {
        return this._totalCount;
    }
    get page() {
        return this._page;
    }
    get limit() {
        return this._limit;
    }
    get isLoading() {
        return this._isLoading;
    }
    get searchQuery() {
        return this._searchQuery;
    }
    get minPrice() {
        return this._minPrice
    }
    get maxPrice() {
        return this._maxPrice
    }
}
