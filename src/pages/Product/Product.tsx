// pages/Product/Product.tsx
import { useParams } from 'react-router';
import ProductDetail from '../../components/ProductDetail';

const Product = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div className="p-8">
                <h1>Ошибка</h1>
                <p>Продукт не найден</p>
            </div>
        );
    }
    
    return <ProductDetail productId={id} />;
};

export default Product;