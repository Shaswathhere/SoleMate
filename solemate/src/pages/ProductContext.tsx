// ProductContext.tsx - Global state management for products
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [products, setProducts] = useState<ShoeData[]>([
    // Initial sample products
    {
      ShoeId: "1",
      ShoeName: "adidas Multix Originals Shoes Sep...",
      Description: "Comfortable running shoes with modern design",
      Price: 350,
      imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+1",
      category: "running",
      createdAt: "2024-01-15T08:30:00Z",
      Brand: "Adidas",
      SellerName: "John Doe",
      SellerID: "user_001"
    },
    {
      ShoeId: "2",
      ShoeName: "Nike Air Max Premium Collection",
      Description: "Premium Nike Air Max with superior comfort",
      Price: 450,
      imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Nike",
      category: "lifestyle",
      createdAt: "2024-01-14T10:15:00Z",
      Brand: "Nike",
      SellerName: "John Doe",
      SellerID: "user_001"
    }
  ]);

  const addProduct = (product: ShoeData) => {
    setProducts(prevProducts => [...prevProducts, product]);
    console.log('Product added to global state:', product);
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
