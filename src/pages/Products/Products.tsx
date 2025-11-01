
import { useEffect } from "react";
import { useSearchParams, useNavigate } from 'react-router'
import ProductCard from "../../components/ProductCard";
import { useProductsStore } from '../../../store';

export default function AllProductPage() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const {
        products,
        error,
        fetchProducts,
        getFilteredProducts,
        getCountLikedProducts,
        setFilter,
        currentFilter,
        hasLoaded, } = useProductsStore();

    const filteredProducts = getFilteredProducts();
    const countLiked = getCountLikedProducts();

    // Синхронизация с URL при загрузке
    useEffect(() => {
        const urlFilter = searchParams.get('filter') as 'all' | 'favorites' | null;
        if (urlFilter && (urlFilter === 'all' || urlFilter === 'favorites')) {
            setFilter(urlFilter);
        }
    }, [searchParams, setFilter]);

    // Обновление URL при смене фильтра
    const handleFilterChange = (filter: 'all' | 'favorites') => {
        setFilter(filter);
        const params = new URLSearchParams(searchParams);
        params.set('filter', filter);
        navigate(`?${params.toString()}`, { replace: true });
    };

    useEffect(() => {
        if (products.length === 0 || hasLoaded) {
            fetchProducts();
        }
    }, [fetchProducts, hasLoaded]);

    if (error) {
        return (
            <div className="px-8 py-10">
                <h1 className="mb-4">Список продуктов</h1>
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">Ошибка: {error}</p>
                </div>
            </div>
        );
    }

    return (
            <div className="px-8 py-10">
                <h1 className="mb-4">Список продуктов</h1>
                {products.length === 0 ? <div className="px-8 py-10">
                    <div className="flex justify-center items-center h-40">
                        <p>Загрузка...</p>
                    </div>
                </div> : <>
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => handleFilterChange('all')} // ← просто передаем функцию
                            className={`px-4 py-2 rounded-md ${currentFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                        >
                            Все товары
                        </button>
                        <button
                            onClick={() => handleFilterChange('favorites')} // ← просто передаем функцию
                            className={`relative px-4 py-2 rounded-md ${currentFilter === 'favorites' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                        >
                            Избранное
                            <span className="absolute right-1 top-0 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center">
                                {countLiked}</span>
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {countLiked === 0 && currentFilter === 'favorites' && <p>Нет избранных товаров</p>}
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                image={product.image}
                                description={product.description}
                                href={`/product/${product.id}`}
                                isLiked={product.isLiked}
                            />
                        ))}
                    </div>
                </>}

            </div>
    );
}