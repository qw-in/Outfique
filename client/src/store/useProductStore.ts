/* eslint-disable @typescript-eslint/no-unused-vars */
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Product {// har product ye structure follow karega
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  gender: string;
  sizes: string[];
  colors: string[];
  price: number;
  stock: number;
  rating?: number;
  soldCount: number;
  images: string[];
}

interface ProductState {   //Yeh state ke structure ko define karta hai
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchAllProductsForAdmin: () => Promise<void>;
    createProduct: (productData: FormData) => Promise<Product>;
    updateProduct: (id: string, productData: FormData) => Promise<Product>;
    deleteProduct: (id: string) => Promise<boolean>;  
    //setProducts: (products: Product[]) => void;
    getProductById: (id: string) => Promise<Product | null>;

  }

  export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,
    fetchAllProductsForAdmin: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(
          `${API_ROUTES.PRODUCTS}/get-admin-products`,
          {
            withCredentials: true,
          }
        );
  
        set({ products: response.data, isLoading: false });
      } catch {
        set({ error: "Failed to fetch product", isLoading: false });
      }
    },

    createProduct: async (productData: FormData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(
          `${API_ROUTES.PRODUCTS}/create-new-product`,
          productData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        set({ isLoading: false });
        return response.data;
      } catch (e) {
        set({ error: "Failed to create product", isLoading: false });
      }
    },


    updateProduct: async (id: string, productData: FormData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.put(
          `${API_ROUTES.PRODUCTS}/${id}`,
          productData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        set({ isLoading: false });
        return response.data;
      } catch (e) {
        set({ error: "Failed to update product", isLoading: false });
      }
    },


    deleteProduct: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, {
          withCredentials: true,
        });
        set({ isLoading: false });
        return response.data.success;//response.data res.json k andr ko read karta hai
      } catch (e) {
        set({ error: "Failed to delete product", isLoading: false });
      }
    },


    getProductById: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_ROUTES.PRODUCTS}/${id}`, {
          withCredentials: true,
        });
        set({ isLoading: false });
        return response.data;
      } catch (e) {
        set({ error: "Failed to create product", isLoading: false });
        return null;
      }
    },
  }));