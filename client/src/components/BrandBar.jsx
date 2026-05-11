import {useContext} from "react";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";

const BrandBar = observer(() => {
    const {thing} = useContext(Context);

    return (
        <div className="flex flex-wrap bg-transparent mt-2 items-center gap-2 px-1">
            <button
                onClick={() => thing.setSelectedBrand({})}
                className={`px-3 py-1.5 rounded-xl text-sm transition-colors border ${
                    !thing.selectedBrand?.id
                        ? 'bg-black text-white border-black'
                        : 'text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
            >
                Все бренды
            </button>
            {thing.brands.map(brand =>
                <button
                    key={brand.id}
                    onClick={() => thing.setSelectedBrand(brand)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors border cursor-pointer ${
                        brand.id === thing.selectedBrand?.id
                            ? 'bg-black text-white border-black'
                            : 'text-gray-500 border-gray-200 hover:border-gray-400'
                    }`}
                >
                    {brand.name}
                </button>
            )}
        </div>
    );
});

export default BrandBar;
