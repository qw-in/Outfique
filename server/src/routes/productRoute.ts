import express from 'express';
import {createProduct,getAllProducts,getProductByID,deleteProduct,updateProduct} from '../controllers/productController';
import { authenticateJwt, isSuperAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/create-new-product', authenticateJwt , isSuperAdmin, upload.array('images',5) ,createProduct);
router.get('/get-admin-products',authenticateJwt , isSuperAdmin, getAllProducts);
router.get('/:id',authenticateJwt, getProductByID);
router.put('/:id',authenticateJwt,isSuperAdmin,updateProduct);
router.delete('/:id',authenticateJwt,isSuperAdmin,deleteProduct);

export default router;