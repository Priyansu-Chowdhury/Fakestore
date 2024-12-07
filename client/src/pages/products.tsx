"use client";

import React, { useEffect, useRef } from "react";
import ProductCard from "@/components/product/product-card";
import ProductSkeleton from "@/components/product/product-loading";
import { useGetProductsQuery } from "@/store/products/products";
import { gsap } from "gsap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CartSheet from "@/components/sheet/cart";

const Products: React.FC = () => {
  const { data: response, isLoading, isError } = useGetProductsQuery();
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && response?.success && productsRef.current) {
      gsap.fromTo(
        productsRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [isLoading, response]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">
          Our Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || response?.success === false) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading the products. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">
          Our Products
        </h1>
        <div
          ref={productsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {response?.data?.map((product) => (
            <div key={product._id}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
      <CartSheet />
    </>
  );
};

export default Products;
