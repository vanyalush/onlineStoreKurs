import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";

const TypeBar = observer(() => {
    const {thing} = useContext(Context);

    return (
        <div className="w-36 mt-2 shrink-0">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 px-1">Категории</p>
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => thing.setSelectedType({})}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !thing.selectedType?.id
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Все
                </button>
                {thing.types.map(type =>
                    <button
                        key={type.id}
                        onClick={() => thing.setSelectedType(type)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            type.id === thing.selectedType?.id
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {type.name}
                    </button>
                )}
            </div>
        </div>
    );
});

export default TypeBar;
