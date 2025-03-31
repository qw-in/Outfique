import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { prisma } from "../server";

export const createCoupon = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { code, discountPercent, startDate , endDate, usageLimit } = req.body;

        const newlyCreatedCoupon = await prisma.coupon.create({
            data:{
                code,
                discountPercent:parseInt(discountPercent),
                startDate:new Date(startDate),
                endDate:new Date(endDate),
                usageLimit:parseInt(usageLimit),
                usageCount:0
            }
        })

        res.status(201).json({ success: true, message: "Coupon created successfully!", coupon: newlyCreatedCoupon });
            
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create coupon!" });
    }
}

export const getAllCoupons = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {

        const fetchAllCoupons = await prisma.coupon.findMany({
            orderBy:{
                createdAt:"desc"
            }
        });

        res.status(200).json({ success: true, message: "All coupons fetched successfully!", coupons: fetchAllCoupons });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to get all coupons!" });
    }
}

export const deleteCoupon = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

         await prisma.coupon.delete({
            where:{
                id:id
            }
        })

        res.status(200).json({ success: true, message: "Coupon deleted successfully!", id:id });
        
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to delete coupon!" });
    }
}

