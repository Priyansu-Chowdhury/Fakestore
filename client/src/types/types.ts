enum ProductTag {
  FEATURED = "featured",
  NEW = "new",
  SALE = "sale",
  BESTSELLER = "bestseller",
  LIMITED = "limited",
}

export interface Product {
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
