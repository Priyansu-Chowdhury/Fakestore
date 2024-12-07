import React from "react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";
import { open } from "@/store/slices/cart-sheet";

const ROUTES = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/products",
    name: "Products",
  },
];

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  return (
    <header className="py-4 flex justify-between items-center">
      <nav>
        <ul className="flex space-x-4">
          {ROUTES.map((route) => (
            <li key={route.name}>
              <Link
                to={`${route.path}`}
                className="text-primary transition-all duration-300"
              >
                <Button
                  size={"sm"}
                  className={cn(
                    "bg-transparent hover:bg-gray-100 text-primary transition-all duration-300 focus-within:bg-gray-100 text-base",
                    {
                      "bg-gray-100": location.pathname === route.path,
                    }
                  )}
                >
                  {route.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {location.pathname === "/products" ? (
        <>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => dispatch(open())}
          >
            <ShoppingBag size={18} />
          </Button>
        </>
      ) : (
        <Link to="/cart">
          <Button size={"icon"} variant={"ghost"}>
            <ShoppingBag size={18} />
          </Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
