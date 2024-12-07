"use client";

import React, { useRef, useEffect } from "react";

import { Product } from "@/types/types";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "../ui/button";
import { addToCart, removeFromCart } from "@/store/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";

const ProductCard: React.FC<Product> = ({
  name,
  shortName,
  price,
  imageUrl,
  _id,
}) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current;
      const image = card.querySelector("img");
      const content = card.querySelector(".content");

      gsap.set(card, { y: 0 });
      gsap.set(image, { scale: 1 });
      gsap.set(content, { y: 0 });

      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -10, duration: 0.3, ease: "power2.out" });
        gsap.to(image, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        gsap.to(content, { y: -5, duration: 0.3, ease: "power2.out" });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(image, { scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(content, { y: 0, duration: 0.3, ease: "power2.out" });
      });
    }
  }, []);

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item = cart.items.find((item) => item._id === _id);

    if (item) {
      dispatch(removeFromCart(item._id));
      toast.success("Item removed from cart");
    } else {
      dispatch(
        addToCart({
          _id,
          quantity: 1,
        })
      );
      toast.success("Item added to cart");
    }
  };

  return (
    <Link
      to={`/products/${_id}`}
      ref={cardRef}
      className="block bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg group"
    >
      <div className="relative h-64 overflow-hidden">
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-2 flex justify-center w-full gap-2 transition-all duration-300">
          <Button
            size={"icon"}
            className="bg-blue-400 text-white transition-colors duration-300 group-hover:bg-blue-400/50 backdrop-blur-sm"
            onClick={handleCartToggle}
          >
            {cart.items.find((item) => item._id === _id) ? (
              <X className="h-6 w-6" />
            ) : (
              <ShoppingBag className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      <div className="content p-6">
        <h3 className="text-base font-semibold mb-2 text-primary transition-colors duration-300 group-hover:text-blue-600">
          {shortName}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {name}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            ${parseFloat(price).toFixed(2)}
          </p>
          <span className="text-xs font-medium text-gray-500 transition-colors duration-300 ">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
