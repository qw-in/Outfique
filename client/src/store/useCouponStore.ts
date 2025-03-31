/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import axios from "axios";
import { API_ROUTES } from "../utils/api";

export interface Coupon {
    id: string;
    code: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usageCount: number;
  }
  
  interface CouponStore {
    couponList: Coupon[];
    isLoading: boolean;
    error: string | null;
    fetchCoupons: () => Promise<void>;
    createCoupon: (
      coupon: Omit<Coupon, "id" | "usageCount">
    ) => Promise<Coupon | null>;
    deleteCoupon: (id: string) => Promise<boolean>;
  }

  export const useCouponStore = create<CouponStore>((set) => ({
    couponList: [],
    isLoading: false,
    error: null,
    fetchCoupons: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
              `${API_ROUTES.COUPON}/fetch-all-coupons`,
              { withCredentials: true }
            );
            set({ couponList: response.data.couponList, isLoading: false });
          } catch (e) {
            set({ isLoading: false, error: "Failed to fetch coupons" });
          }
        
    },
    createCoupon: async (coupon) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_ROUTES.COUPON}/create-coupon`,
                coupon,
                { withCredentials: true }
            );
            set({ isLoading: false });
            return response.data.coupon;
        } catch (error) {
            set({ isLoading: false, error: "Failed to create coupon" });
            return null;
        }
    },
    deleteCoupon: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.delete(
                `${API_ROUTES.COUPON}/delete-coupon/${id}`,
                { withCredentials: true }
            );
            set({ isLoading: false });
            return response.data.success;
        } catch (error) {
            set({ isLoading: false, error: "Failed to delete coupon" });
            return false;
        }
    }
}))
           
