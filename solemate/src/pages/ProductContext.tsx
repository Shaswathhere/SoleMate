import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export interface ShoeData {
  ShoeId: string;
  ShoeName: string;
  Description: string;
  Price: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  Brand: string;
  SellerName: string;
  SellerID: string;
}

interface ProductContextType {
  products: ShoeData[];
  addProduct: (product: ShoeData) => void;
  getUserProducts: (sellerId: string) => ShoeData[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ShoeData[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productsList = productSnapshot.docs.map(doc => {
          const data = doc.data() as ShoeData;
          console.log("Fetched product:", { id: doc.id, ...data }); // Log each product
          return { ...data, ShoeId: doc.id };
        });
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);


  const addProduct = (product: ShoeData) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const getUserProducts = (sellerId: string): ShoeData[] => {
    return products.filter(product => product.SellerID === sellerId);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, getUserProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};