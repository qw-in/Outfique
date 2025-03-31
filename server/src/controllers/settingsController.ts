import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs";


export const addFeatureBanner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: "No files uploaded"
            })
            return;
        }

        const UploadPromises = files.map(file => cloudinary.uploader.upload(file.path, {
            folder: 'ecommerce-feature-banners'
        }));

        const results = await Promise.all(UploadPromises);

        const banners = await Promise.all(results.map(res => prisma.featureBanner.create({
            data: {
                imageUrl: res.secure_url
            }
        })));

        files.forEach(file => fs.unlinkSync(file.path));

        res.status(201).json({
            success: true,
            message: "Feature banners added successfully",
            banners
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to add feature banner",
            error: error
        })
    }
}

export const fetchFeatureBanner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const banners = await prisma.featureBanner.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({
            success: true,
            banners
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch feature banner",
            error: error
        })
    }
}

export const updateFeaturedProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { productIds } = req.body;

        if (!Array.isArray(productIds) || productIds.length > 8) {
            res.status(400).json({
                success: false,
                message: "Invalid product IDs or too many requests"
            })
            return;
        }

        //reset all products to not featured
        await prisma.product.updateMany({
            data: {
                isFeatured: false
            }
        })

        //set selected products to featured
        await prisma.product.updateMany({
            where: {
                id: {
                    in: productIds
                }
            },
            data: {
                isFeatured: true
            }
        })

        res.status(200).json({
            success: true,
            message: "Featured products updated successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to update featured products",
            error: error
        })
    }
}

export const getFeaturedProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const featuredProducts = await prisma.product.findMany({
            where: {
                isFeatured: true
            }
        });

        res.status(200).json({
            success: true,
            featuredProducts
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get featured products",
            error: error
        })
    }
}

