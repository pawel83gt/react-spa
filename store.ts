
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  isLiked: boolean;
}

interface ProductsStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
  currentFilter: 'all' | 'favorites';
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  delProductById: (id: string) => void; //изменяет массив products
  toggleLike: (id: string) => void;
  setFilter: (filter: "all" | "favorites") => void;
  getFilteredProducts: () => Product[];
  getCountLikedProducts: () => number;
  addProduct: (productData: Omit<Product, 'id'>) => void;
  toggleHasLoaded: () => void;
}

const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({

      products: [],
      loading: false,
      error: null,
      hasLoaded: false,
      currentFilter: 'all',

      //получение товаров
      fetchProducts: async () => {
        try {
          set({ loading: true, error: null });

          const response = await fetch("https://709da460ccc6f370.mokky.dev/monitors");

          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
          }

          const data = await response.json();
          set({ products: data, loading: false, hasLoaded: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Произошла ошибка",
            loading: false
          });
        }
      },

      //получение одного товара по id
      fetchProduct: async (id: string) => {
        try {
          set({ loading: true, error: null });

          const response = await fetch(`https://709da460ccc6f370.mokky.dev/monitors/${id}`);
          console.log(response);
          if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

          const data = await response.json();

          // ✅ ВАЖНО: добавляем товар в массив products
          set(state => ({
            products: [...state.products, data], // добавляем к существующим
            loading: false,
            hasLoaded: true
          }));
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Произошла ошибка",
            loading: false
          });
        }
      },

      delProductById: async (id: string) => {
        try {

          set(state => {
            const newProducts = state.products.filter(product => product.id !== id);
            return { products: newProducts };
          });

          const response = await fetch(`https://709da460ccc6f370.mokky.dev/monitors/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error(`Ошибка удаления: ${response.status}`);
          }

        } catch (err) {
          console.error('Ошибка при удалении товара:', err);
        }
      },

      toggleLike: async (id: string) => {
        set(state => ({
          products: state.products.map(product => {
            if (product.id === id) {
              const newLikeStatus = !product.isLiked;

              fetch(`https://709da460ccc6f370.mokky.dev/monitors/${id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  isLiked: newLikeStatus
                })
              }).then(response => {
                if (!response.ok) {
                  if (response.status === 404) {
                    alert(`❌ Товар с ID ${id} не найден на сервере\nЛайк изменен только локально`);
                  } else if (response.status === 500) {
                    alert('❌ Ошибка сервера');
                  } else {
                    alert(`❌ Ошибка ${response.status}: Не удалось обновить лайк`);
                  }
                } else {
                  console.log('✅ Like обновлен на сервере');
                }
              }).catch(() => {
                alert('❌ Ошибка сети: Не удалось соединиться с сервером');
              });

              return { ...product, isLiked: newLikeStatus };
            }
            return product;
          })
        }));
      },

      getFilteredProducts: () => {
        const { products, currentFilter } = get();

        if (currentFilter === 'favorites') {
          return products.filter(product => product.isLiked);
        }

        return products; // 'all' - возвращаем все
      },

      // Методы для смены фильтра (меняют только currentFilter)
      setFilter: (filter: "all" | "favorites") => {
        set({ currentFilter: filter });
      },

      getCountLikedProducts: () => {
        const { products } = get();
        return products.filter(product => product.isLiked).length;
      },

      toggleHasLoaded: () => {
        set({
          hasLoaded: false
        });
      },

      addProduct: (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
          ...productData,
          id: generateId().toString(),
          isLiked: false
        };

        console.log('Adding product with ID:', newProduct.id);

        set(state => ({
          products: [...state.products, newProduct],
          hasLoaded: false
        }));
      },
    }),
    {
      name: 'products-store',
    }
  )
);        