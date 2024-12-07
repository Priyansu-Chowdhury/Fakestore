import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { removeFromCart, updateQuantity } from "@/store/slices/cart";
import { Link } from "react-router-dom";
import { useGetProductsByIdsMutation } from "@/store/products/products";
import { Product } from "@/types/types";

const Cart: React.FC = () => {
  const dispatch = useDispatch();
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your Shopping Cart
      </h1>
      {cart.items.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <Link to="/products">
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <ScrollArea className="h-[calc(100vh-300px)]">
                {cart.items.map((item) => {
                  const product = products.find((p) => p._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className="flex items-center py-4 border-b last:border-b-0"
                    >
                      <img
                        src={product?.imageUrl || "/placeholder.svg"}
                        alt={product?.name || "Product Image"}
                        className="relative w-20 h-20 mr-4 rounded"
                      />
                      <div className="flex-grow">
                        <h2 className="text-lg font-semibold">
                          {product?.name || "Unknown Product"}
                        </h2>
                        <p className="text-gray-600">
                          $
                          {parseFloat(
                            product?.price?.toString() || "0"
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-4"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full mt-6" size="lg">
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Cart;
