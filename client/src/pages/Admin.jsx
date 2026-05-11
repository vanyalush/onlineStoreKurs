import {useContext, useState, useEffect} from "react";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";
import {createBrand, createType, createThing, deleteThing, fetchThings} from "../http/thingApi.js";

const BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5001';

const AdminModal = observer(({isOpen, onClose}) => {
    const {thing} = useContext(Context);

    const [tab, setTab] = useState("type");
    const [value, setValue] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [size, setSize] = useState("");
    const [file, setFile] = useState(null);
    const [typeId, setTypeId] = useState("");
    const [brandId, setBrandId] = useState("");
    const [saving, setSaving] = useState(false);

    // Для вкладки удаления
    const [allThings, setAllThings] = useState([]);
    const [loadingThings, setLoadingThings] = useState(false);
    const [deleteSearch, setDeleteSearch] = useState("");

    useEffect(() => {
        if (tab === "delete" && isOpen) {
            setLoadingThings(true);
            fetchThings(null, null, 1, 100)
                .then(data => setAllThings(data.rows || []))
                .finally(() => setLoadingThings(false));
        }
    }, [tab, isOpen]);

    if (!isOpen) return null;

    const selectFile = e => setFile(e.target.files[0]);

    const addType = () => {
        if (!value) return;
        createType({name: value}).then(newType => {
            thing.setTypes([...thing.types, newType]);
            setValue("");
        }).catch(() => alert("Ошибка"));
    }

    const addBrand = () => {
        if (!value) return;
        createBrand({name: value}).then(newBrand => {
            thing.setBrands([...thing.brands, newBrand]);
            setValue("");
        }).catch(() => alert("Ошибка"));
    }

    const addThing = async () => {
        if (!name || !price || !brandId || !typeId) {
            alert("Заполните название, цену, бренд и категорию!");
            return;
        }
        setSaving(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('size', size);
        formData.append('brandId', brandId);
        formData.append('typeId', typeId);
        if (file) formData.append('img', file);
        try {
            await createThing(formData);
            alert("Товар добавлен!");
            setName(""); setPrice(0); setSize(""); setDescription(""); setTypeId(""); setBrandId(""); setFile(null);
        } catch (e) {
            alert("Ошибка при создании товара");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Удалить "${name}"?`)) return;
        try {
            await deleteThing(id);
            setAllThings(prev => prev.filter(t => t.id !== id));
            thing.setThings(thing.things.filter(t => t.id !== id));
        } catch (e) {
            alert("Ошибка при удалении");
        }
    }

    const filteredThings = allThings.filter(t =>
        t.name.toLowerCase().includes(deleteSearch.toLowerCase())
    );

    const tabs = [
        { id: "type", label: "Добавить тип" },
        { id: "brand", label: "Добавить бренд" },
        { id: "product", label: "Добавить товар" },
        { id: "delete", label: "Удалить товар" },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="relative w-full max-w-xl mx-4 rounded-xl overflow-hidden"
                style={{ background: "#0f0f0f", border: "1px solid white" }}
            >
                {/* Header */}
                <div className="flex items-center px-4 py-2" style={{ borderBottom: "1px solid #1e1e1e" }}>
                    <span className="text-white text-sm font-medium">Админ панель</span>
                    <button onClick={onClose} className="w-8 h-8 ml-auto text-white hover:opacity-60">✕</button>
                </div>

                {/* Nav */}
                <div className="flex flex-col" style={{ borderBottom: "1px solid #1e1e1e" }}>
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id)}
                            className="w-full px-4 py-2.5 text-left text-sm text-white flex justify-between items-center transition-all hover:bg-[#1a1a1a]"
                            style={{ background: tab === item.id ? "#222" : "transparent", borderLeft: tab === item.id ? "2px solid white" : "2px solid transparent" }}
                        >
                            {item.label}
                            <span style={{ color: tab === item.id ? "#fff" : "#555", fontSize: 12 }}>›</span>
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="p-5 max-h-96 overflow-y-auto">

                    {/* Добавить тип */}
                    {tab === "type" && (
                        <div>
                            <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Название типа</label>
                            <div className="flex gap-2">
                                <input
                                    value={value}
                                    onChange={e => setValue(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addType()}
                                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#555] outline-none"
                                    placeholder="Например: Футболки"
                                />
                                <button className="bt w-auto px-4 text-sm" onClick={addType}>+ Добавить</button>
                            </div>
                            {thing.types.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-[10px] text-[#555] uppercase mb-1">Существующие типы:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {thing.types.map(t => (
                                            <span key={t.id} className="text-xs bg-[#1a1a1a] text-[#888] px-2 py-1 rounded">{t.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Добавить бренд */}
                    {tab === "brand" && (
                        <div>
                            <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Название бренда</label>
                            <div className="flex gap-2">
                                <input
                                    value={value}
                                    onChange={e => setValue(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addBrand()}
                                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#555] outline-none"
                                    placeholder="Например: Nike"
                                />
                                <button className="bt w-auto px-4 text-sm" onClick={addBrand}>+ Добавить</button>
                            </div>
                            {thing.brands.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-[10px] text-[#555] uppercase mb-1">Существующие бренды:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {thing.brands.map(b => (
                                            <span key={b.id} className="text-xs bg-[#1a1a1a] text-[#888] px-2 py-1 rounded">{b.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Добавить товар */}
                    {tab === "product" && (
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Название</label>
                                    <input value={name} onChange={e => setName(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#555]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Цена ₽</label>
                                    <input value={price} onChange={e => setPrice(Number(e.target.value))} type="number"
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#555]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Бренд</label>
                                    <select value={brandId} onChange={e => setBrandId(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none">
                                        <option value="">Выберите бренд</option>
                                        {thing.brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Категория</label>
                                    <select value={typeId} onChange={e => setTypeId(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none">
                                        <option value="">Выберите категорию</option>
                                        {thing.types?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] uppercase tracking-widest text-[#666]">Размер</label>
                                <input value={size} onChange={e => setSize(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white mt-1 outline-none" placeholder="XS, S, M, L, XL..." />
                            </div>
                            <div>
                                <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Описание</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none resize-none" style={{height: 64}} placeholder="Описание товара..." />
                            </div>
                            <div>
                                <label className="block border border-dashed border-[#2a2a2a] rounded-lg p-4 text-center text-xs text-[#555] cursor-pointer hover:border-[#444]">
                                    <input type="file" onChange={selectFile} className="hidden" accept="image/*" />
                                    {file ? `✓ ${file.name}` : "📷 Выбрать фото"}
                                </label>
                            </div>
                            <div className="flex justify-end mt-1">
                                <button className="bt w-auto px-6 text-sm" onClick={addThing} disabled={saving}>
                                    {saving ? "Сохранение..." : "Сохранить товар"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Удалить товар */}
                    {tab === "delete" && (
                        <div>
                            <input
                                value={deleteSearch}
                                onChange={e => setDeleteSearch(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none mb-3"
                                placeholder="Поиск по названию..."
                            />
                            {loadingThings ? (
                                <p className="text-sm text-[#555] text-center py-4">Загрузка...</p>
                            ) : filteredThings.length === 0 ? (
                                <p className="text-sm text-[#555] text-center py-4">Товары не найдены</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {filteredThings.map(t => (
                                        <div key={t.id} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-2">
                                            <img
                                                src={`${BASE_URL}/${t.img}`}
                                                className="w-10 h-10 object-contain rounded bg-[#2a2a2a]"
                                                alt={t.name}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{t.name}</p>
                                                <p className="text-xs text-[#666]">{t.brand?.name} · {t.price?.toLocaleString()} ₽</p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(t.id, t.name)}
                                                className="shrink-0 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default AdminModal;
