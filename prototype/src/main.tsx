import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { CartProvider } from "./cart";
import { ProtoNav } from "./components/ProtoNav";
import { Access } from "./pages/Access";
import { Drop } from "./pages/Drop";
import { Product } from "./pages/Product";
import { Confirmation } from "./pages/Confirmation";
import { Compare } from "./pages/Compare";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Access />} />
          <Route path="/drop" element={<Drop />} />
          <Route path="/produit/:slug" element={<Product />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/comparer" element={<Compare />} />
        </Routes>
        <ProtoNav />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
