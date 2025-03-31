import express from "express";
import { addFeatureBanner, fetchFeatureBanner, getFeaturedProducts, updateFeaturedProducts } from "../controllers/settingsController";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = express.Router();

router.post("/banners", authenticateJwt, isSuperAdmin, upload.array("images", 5), addFeatureBanner);
router.get("/get-banners", authenticateJwt, fetchFeatureBanner);
router.post("/update-feature-products", authenticateJwt, isSuperAdmin, updateFeaturedProducts);
router.get("/fetch-feature-products", authenticateJwt, getFeaturedProducts);

export default router;
