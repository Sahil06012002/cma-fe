import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductDetail {
  title: string;
  id: number;
  product_tag: string;
  dealer: string;
  description: string;
  company: string;
  user_id: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchProductDetail = async () => {
      try {
        const response = await axios.get<{ "product details": ProductDetail }>(`http://127.0.0.1:8000/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProductDetail(response.data["product details"]);
      } catch (err) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProductDetail();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Card className="max-w-md mx-auto mt-8 border border-gray-300 shadow-sm">
      <CardHeader>
        <CardTitle>{productDetail?.title || "-"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm"><strong>Description:</strong> {productDetail?.description || "-"}</p>
        <p className="text-sm"><strong>Product Tag:</strong> {productDetail?.product_tag || "-"}</p>
        <p className="text-sm"><strong>Dealer:</strong> {productDetail?.dealer || "-"}</p>
        <p className="text-sm"><strong>Company:</strong> {productDetail?.company || "-"}</p>
      </CardContent>
    </Card>
  );
};

export default ProductDetail;
