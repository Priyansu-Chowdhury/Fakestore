import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { close } from "@/store/slices/cart-sheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { removeFromCart, updateQuantity } from "@/store/slices/cart";
import { useGetProductsByIdsMutation } from "@/store/products/products";
import { Product } from "@/types/types";

const CartSheet: React.FC = () => {
  const dispatch = useDispatch();
  const cartSheet = useSelector((state: RootState) => state.cartSheet);
  const cart = useSelector((state: RootState) => state.cart);

  const [getProductsByIds, { isLoading, isError }] =
    useGetProductsByIdsMutation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const itemIds = cart.items.map((item) => item._id);

    const missingItems = itemIds.filter(
      (id) => !products.some((product) => product._id === id)
    );

    if (missingItems.length > 0) {
      getProductsByIds(missingItems).then((response) => {
        if (response?.data?.data) {
          setProducts((prevProducts) => [
            ...prevProducts,
            ...response.data.data,
          ]);
        }
      });
    }
  }, [cart.items, getProductsByIds, products]);

  const totalPrice = React.useMemo(() => {
    return cart.items.reduce((total, item) => {
      const product = products.find((p) => p._id === item._id);
      const price = product?.price ? parseFloat(product.price) : 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart.items, products]);

  // Handlers
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Loading your cart...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-red-600">Failed to load cart items.</p>
      </div>
    );
  }

  return (
    <Sheet open={cartSheet.isOpen} onOpenChange={() => dispatch(close())}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-grow mt-6 mb-4 h-[calc(100vh-200px)]">
          {cart.items.length === 0 ? (
            <p className="text-center text-gray-500">
              Your cart is empty. Add items to see them here!
            </p>
          ) : (
            cart.items.map((item) => {
              const product = products.find((p) => p._id === item._id);
              return (
                <div
                  key={item._id}
                  className="flex items-center py-4 border-b last:border-b-0"
                >
                  <img
                    src={product?.imageUrl || "/placeholder.svg"}
                    alt={product?.name || "Product Image"}
                    className="relative w-16 h-16 mr-4 rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-sm font-semibold">
                      {product?.name || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ${parseFloat(product?.price || "0").toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 w-8 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          )}
        </ScrollArea>

        <SheetFooter className="flex flex-col items-stretch gap-4 sm:flex-row sm:justify-between sm:space-x-0">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          <Button
            className="w-full sm:w-auto"
            disabled={cart.items.length === 0}
          >
            Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
