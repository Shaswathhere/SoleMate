import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';

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
  loading: boolean;
  error: Error | null;
  addProduct: (product: ShoeData) => void;
  getUserProducts: (sellerId: string) => ShoeData[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ShoeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsList: ShoeData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<ShoeData, 'ShoeId'>;
        productsList.push({ ...data, ShoeId: doc.id });
      });
      setProducts(productsList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products: ", err);
      setError(err);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addProduct = (product: ShoeData) => {
    // This now optimistically adds the product to the local state.
    // Firestore's real-time listener will soon overwrite this with the official data.
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const getUserProducts = (sellerId: string): ShoeData[] => {
    return products.filter(product => product.SellerID === sellerId);
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, addProduct, getUserProducts }}>
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