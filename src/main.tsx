import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import App from './App.tsx'
import Home from './pages/Home'
import Products from './pages/Products'
import Product from './pages/Product'
import CreateProduct from './pages/CreateProduct'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />} >
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
