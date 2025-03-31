import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs";
import { Prisma } from "@prisma/client";

// create a product
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    //upload all images to cloudinary
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce",
      })
    );

    const uploadresults = await Promise.all(uploadPromises);
    const imageUrls = uploadresults.map((result) => result.secure_url);

    console.log(files);


    const newlyCreatedProduct = await prisma.product.create({
      data: {
        name,
        brand,
        category,
        description,
        gender,
        sizes: sizes.split(","),
        colors: colors.split(","),
        price: parseFloat(price),
        stock: parseInt(stock),
        images: imageUrls,
        soldCount: 0,
        rating: 0,
      },
    });

    //clean the uploaded files
    if (files.length > 0) {
      files.forEach((file) => {
        if (file.path) {
          fs.unlinkSync(file.path); // Only unlink if path exists
        }
      });
    }
    res.status(201).json(newlyCreatedProduct);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

//fetch all products (admin side)
export const getAllProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

//fetch single product
export const getProductByID = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

//update a product(admin)
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
      rating,
    } = req.body;

    console.log(req.body, "req.body");

    //homework -> you can also implement image update func

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        brand,
        category,
        description,
        gender,
        sizes: sizes.split(","),
        colors: colors.split(","),
        price: parseFloat(price),
        stock: parseInt(stock),
        rating: parseInt(rating),
      },
    });

    res.status(200).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
}

//delete a product(admin)
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id },
    });
    res.status(200).json({ product, success: true, message: "Product deleted successfully!" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

//fetch products with filters (client side)


