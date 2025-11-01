
import { useEffect, useState } from "react";
import { useProductsStore } from '../../../store';

interface ProductDetailProps {
    productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
    const { products, fetchProduct } = useProductsStore();
    const [hasTriedFetch, setHasTriedFetch] = useState(false);

    const product = products.find(p => p.id.toString() === productId);

    useEffect(() => {
        if (!product && !hasTriedFetch) {
            fetchProduct(productId);
            setHasTriedFetch(true);
        }
    }, [product, productId, fetchProduct, hasTriedFetch]);

    if (!product) {
        return <div className="flex justify-center items-center h-40"><p>Загрузка...</p></div>;
    }

    return (
        <div className="px-8 py-10">
            <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
            {product.image && (
                <img
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="w-full max-w-md h-auto mb-4"
                />
            )}
            <p className="text-gray-700">{product.description}</p>
        </div>
    );
}