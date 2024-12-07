import express from "express";
import {
  getProducts,
  createProducts,
  deleteProduct,
  getProductById,
  updateProduct,
  getProductsByIds,
} from "../controllers/product.controllers";

const router = express.Router();

router.get("/", getProducts);
router.post("/new", createProducts);
router.get("/:id", getProductById);
router.post("/ids", getProductsByIds);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
