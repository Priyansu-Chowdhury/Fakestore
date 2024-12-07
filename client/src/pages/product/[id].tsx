"use client";

import React from "react";
import { useGetProductsByIdQuery } from "@/store/products/products";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, XCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { addToCart, removeFromCart } from "@/store/slices/cart";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const cart = useSelector((state: RootState) => state.cart);
  const {
    data: product,
    error,
    isLoading,
  } = useGetProductsByIdQuery(params.id || "", {
    refetchOnMountOrArgChange: true,
    skip: !params.id,
  });

  if (!params.id) return null;

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading the product details. Please try again
            later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Product Not Found</AlertTitle>
          <AlertDescription>
            The product you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleAddToCartToggle = () => {
    const item = cart.items.find((item) => item._id === product.data._id);
    if (item) {
      dispatch(removeFromCart(item._id));
      toast.success("Product removed from cart");
      return;
    }
    dispatch(
      addToCart({
        _id: product.data._id,
        quantity: 1,
      })
    );
    toast.success("Product added to cart");
  };

  return (
    <div className="px-4">
      <Link to="/products" className="flex items-center mb-4">
        <Button size="sm" variant={"ghost"} className="text-sm">
          <ArrowLeft className="mr-2" size={18} />
          Back to Products
        </Button>
      </Link>
      <div className="grid md:grid-cols-2 gap-4">
        <img
          src={product.data.imageUrl}
          alt={product.data.name}
          className="relative h-96 md:h-full rounded-lg overflow-hidden"
        />
        <div className="flex flex-col justify-between ">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.data.name}</h1>
            <p className="text-xl text-gray-600 mb-4">
              {product.data.shortName}
            </p>
            <p className="text-base text-gray-600 mb-4">
              {product.data.description}
            </p>
            <div className="text-lg text-gray-600 mb-4 flex items-center space-x-2">
              <div
                style={{
                  backgroundColor: product.data.color,
                }}
                className="rounded-full mr-2 w-6 h-6"
              />
            </div>
            <div className="text-base space-y-4 text-gray-600 mb-4">
              <p className="font-semibold">Department</p>
              <Badge variant={"secondary"}>{product.data.department}</Badge>
            </div>
            <div className="text-base space-y-4 text-gray-600 mb-4">
              <p className="font-semibold">Material</p>
              <Badge variant={"secondary"}>{product.data.material}</Badge>
            </div>
            <div className="text-base space-y-4 text-gray-600 mb-4">
              <p className="font-semibold">Price</p>
              <Badge variant={"secondary"}>
                ${parseFloat(product.data.price).toFixed(2)}
              </Badge>
            </div>
          </div>
          <div className="w-full flex md:flex-col gap-4 ">
            <Button
              size="lg"
              className="w-full"
              variant="expandIconOutline"
              Icon={
                cart.items.find((item) => item._id === product.data._id)
                  ? XCircle
                  : ShoppingCart
              }
              iconPlacement="left"
              onClick={handleAddToCartToggle}
            >
              {cart.items.find((item) => item._id === product.data._id)
                ? "Remove from Cart"
                : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              className="w-full"
              variant="expandIcon"
              Icon={CheckCircle}
              iconPlacement="left"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-96 md:h-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full md:w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
