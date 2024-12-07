import mongoose from "mongoose";

interface ProductDocument extends mongoose.Document {
  _id: string;
  name: string;
  shortName: string;
  description: string;
  price: string;
  color: string;
  department: string;
  material: string;
  imageUrl: string;
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
  color: {
    type: String,
    required: true, // FORMAT: HSL
  },
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
});

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export { Product };
