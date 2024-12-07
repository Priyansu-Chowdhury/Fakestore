import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { gsap } from "gsap";

import Container from "./components/ui/container";
import Header from "./components/essentials/header";
import Footer from "./components/essentials/footer";
import { Toaster } from "sonner";

const Home = React.lazy(() => import("./pages/home"));
const Products = React.lazy(() => import("./pages/products"));
const Cart = React.lazy(() => import("./pages/cart"));
const ProductDetails = React.lazy(() => import("./pages/product/[id]"));

const PageReveal = () => {
  const revealRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(".top-reveal", {
        height: "0%",
        duration: 2,
        ease: "power2.inOut",
      })
        .to(
          ".bottom-reveal",
          {
            height: "0%",
            duration: 2,
            ease: "power2.inOut",
          },
          "<"
        )
        .set(".reveal-container", { display: "none" });
    }, revealRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={revealRef}>
      <div className="reveal-container fixed inset-0 flex z-50">
        <div className="top-reveal bg-gray-700 w-full h-1/2 absolute top-0" />
        <div className="bottom-reveal bg-gray-700 w-full h-1/2 absolute bottom-0" />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      {/* <PageReveal /> */}
      <Container>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
        <Toaster />
        <Footer />
      </Container>
    </Router>
  );
};

export default App;
