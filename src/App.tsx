import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import LogIn from './pages/login'
import SignUp from './pages/signup'
import Product from './pages/product'
import ProductDetails from './pages/product-details'
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className='h-screen'>
      <ToastContainer/>
      <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
    </div>
  )
}

export default App
