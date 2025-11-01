
import { useState } from "react";
import { useProductsStore } from '../../../store';
import InputTitle from "../InputTitle";
import InputDesc from "../InputDesc";
import InputImage from "../InputImage";


const initialFormData = {
    title: '',
    description: '',
    image: '',
    isLiked: false,
}

const AddProduct = () => {

    const { addProduct, toggleHasLoaded } = useProductsStore();

    const [formData, setFormData] = useState(initialFormData);
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = () => {
        const newProduct = {
            title: formData.title,
            description: formData.description,
            image: imageUrl,
            isLiked: false
        };
        toggleHasLoaded();
        addProduct(newProduct);
    };
    return (
        <div className="px-8 py-10">
            <h1>Добавление продукта</h1>
            <div className="flex flex-col gap-y-4 w-md">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <InputTitle
                        id="title"
                        label="Название"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    <InputDesc
                        id="description"
                        label="Описание"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    <InputImage
                        id="product-image"
                        label="Изображение товара"
                        onImageUpload={(url) => setImageUrl(url)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                        Добавить
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AddProduct;