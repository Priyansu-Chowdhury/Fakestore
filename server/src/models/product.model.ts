import mongoose from "mongoose";

enum ProductTag {
  FEATURED = "featured",
  NEW = "new",
  SALE = "sale",
  BESTSELLER = "bestseller",
  LIMITED = "limited",
}

interface ProductDocument extends mongoose.Document {
  _id: string;
  name: string;
  shortName: string;
  description: string;
  price: string;
  color: string[];
  department: string;
  material: string;
  imageUrl: string;
  tags: ProductTag[];
}

const productSchema = new mongoose.Schema<ProductDocument>({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  color: [
    {
      type: String,
      required: true, // FORMAT: HSL
    },
  ],
  department: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    enum: Object.values(ProductTag),
    default: [ProductTag.NEW],
    required: true,
  },
});

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export { Product };
