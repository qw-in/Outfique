import express from "express";
import { createCoupon, deleteCoupon, getAllCoupons } from "../controllers/couponController";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";


const router = express.Router();

router.use(authenticateJwt , isSuperAdmin)

router.post("/create-coupon", createCoupon)
router.get("/fetch-all-coupons", getAllCoupons)
router.delete("/delete-coupon/:id", deleteCoupon)



export default router;
