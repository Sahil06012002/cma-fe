import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
interface Product {
    id: number;
    title: string;
    product_tag: string;
    dealer: string;
    description: string;
    company: string;
    user_id: number;
  }

const Product = () => {
    const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get<{ "product list": Product[] }>("http://127.0.0.1:8000/product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(response.data["product list"]);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const handleCardClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };


  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <Card key={product.id} className="border border-gray-300 shadow-sm cursor-pointer" onClick={() => handleCardClick(product.id)}>
          <CardHeader>
            <CardTitle>{product.title || "-"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm"><strong>Description:</strong> {product.description || "-"}</p>
            <p className="text-sm"><strong>Product Tag:</strong> {product.product_tag || "-"}</p>
            <p className="text-sm"><strong>Company:</strong> {product.company || "-"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Product;
