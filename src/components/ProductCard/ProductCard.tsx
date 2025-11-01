
import { Link } from 'react-router';
import { useProductsStore } from '../../../store';
import { Heart, Trash } from 'lucide-react';
import Image from '../Image';

interface ProductCardProps {
    id: string;
    image: string;
    description: string;
    href: string;
    isLiked: boolean;
}

const ProductCard = ({ id, image, description, href, isLiked }: ProductCardProps) => {
    const { delProductById, toggleLike } = useProductsStore();

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault(); //отключает дефолтное поведение
        e.stopPropagation(); //отключает всплытие события вверх 
        toggleLike(id);
    };

    // Удаление товара
    const handleDelete = (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();
        delProductById(productId);
    };

    const truncatedDescription = description.length > 100
        ? `${description.substring(0, 100)}...`
        : description;

    return (
        <Link key={id} to={href} className="block w-[220px] h-64">
            <div className="h-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                {/* Image container */}
                <div className="relative aspect-[4/3]">
                    <Image
                        src={image}
                        alt={description}
                        fill
                        className="object-cover"
                        sizes="220px"
                        priority={false}
                    />
                    {/* Like button */}
                    <button
                        onClick={handleLikeClick}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                        <Heart
                            size={20}
                            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}
                        />
                    </button>
                    {/* Delete button */}
                    <button
                        onClick={(e) => handleDelete(e, id)}
                        className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                        <Trash
                            size={20}
                            className="text-gray-600"
                        />
                    </button>
                </div>

                {/* Description */}
                <div className="p-4">
                    <p className="text-gray-700 text-sm line-clamp-3">
                        {truncatedDescription}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;