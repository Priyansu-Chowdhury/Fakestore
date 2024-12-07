import { Request, Response } from "express";
import { asyncHandler } from "../utils/error.handler";
import { AppError } from "../utils/app.error";
import { Product } from "../models/product.model";
import { generateRandomProducts } from "../faker/fake-data";

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({});
  if (!products.length) {
    throw new AppError("No products found", 404);
  }
  res.json({ success: true, data: products });
});

export const createProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { count = 5 } = req.body;
    const products = await generateRandomProducts(count);

    const savedProducts = await Product.insertMany(products);

    return res.status(201).json({ success: true, data: savedProducts });
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.json({ success: true, data: product });
  }
);

export const getProductsByIds = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } });
    if (!products.length) {
      throw new AppError("Products not found", 404);
    }
    res.json({ success: true, data: products });
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.json({ success: true, data: product });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.json({ success: true, data: {} });
  }
);
