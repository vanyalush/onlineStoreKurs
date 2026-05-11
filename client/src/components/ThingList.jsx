import ThingItem from "./ThingItem.jsx";
import {useContext} from "react";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";

const ThingList = observer(() => {
    const {thing} = useContext(Context);

    const handleDeleted = (id) => {
        thing.setThings(thing.things.filter(t => t.id !== id));
        thing.setTotalCount(thing.totalCount - 1);
    }

    if (thing.isLoading) {
        return (
            <div className="flex justify-center items-center h-48 text-gray-400">
                <svg className="animate-spin mr-2" width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Загрузка...
            </div>
        );
    }

    if (!thing.things.length) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <p className="text-lg">Товары не найдены</p>
                <p className="text-sm mt-1">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {thing.things.map(t =>
                <ThingItem key={t.id} thing={t} onDeleted={handleDeleted} />
            )}
        </div>
    );
});

export default ThingList;
