import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BASE_URL from "@/constants";

interface ProductDetail {
  title: string;
  id: number;
  product_tag: string;
  dealer: string;
  description: string;
  company: string;
  user_id: number;
}
interface ProductDetailResponse {
    "product details": ProductDetail;
    product_images: string[];
  }
const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const [productImages, setProductImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const token = localStorage.getItem("access_token");
  
      const fetchProductDetail = async () => {
        try {
          const response = await axios.get<ProductDetailResponse>(`${BASE_URL}/product/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setProductDetail(response.data["product details"]);
          setProductImages(response.data.product_images);
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
      <div className="flex max-w-4xl mx-auto mt-8 border border-gray-300 shadow-sm p-4">
        {/* Left side: Product details */}
        <div className="flex-1 mr-8">
          <Card>
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
        </div>
  
        {/* Right side: Product images */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Product Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {productImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Product Image ${index + 1}`}
                className="w-full h-auto object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductDetail;