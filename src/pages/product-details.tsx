import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BASE_URL from "@/constants";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";
import EditProductForm from "./edit-product-form";

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
    const navigate = useNavigate();
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const [productImages, setProductImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [visibility,setVisibility] = useState(false)
  
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
    const handleBack = () => {
        navigate("/product"); 
      };

      const handleDelete = async () => {
        const token = localStorage.getItem("access_token");
    
        if (token) {
          try {
            const response = await axios.delete(`${BASE_URL}/product/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.status === 200) {
              navigate("/product"); 
            }
          } catch (err) {
            setError("Failed to delete product.");
          }
        } else {
          setError("User not authenticated.");
        }
      };

      const handleVisibility = () => {
        setVisibility(!visibility)
      }
      const onUpdate = (updataed_product : ProductDetail) => {
        setProductDetail(updataed_product)
      }
  
    return (
      <div className="m-10">
        <div className="flex justify-between">
        <Button onClick={handleBack} className="mb-4">
        ← Back
      </Button> 

        <div className="flex felx-column gap-2">
        <Button onClick={handleDelete} className="mb-4 bg-red-600 hover:bg-red-700">
          Delete
        </Button>
        <Button onClick={handleVisibility} className="mb-4">
          Edit
        </Button>
        </div>
      
      </div>
        <div className="flex max-w-4xl mx-auto mt-8 border border-gray-300 shadow-sm p-4">
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
            <div>
              {
                visibility && <Modal onClose={handleVisibility}>
                <EditProductForm productDetails={productDetail} onClose={handleVisibility} onUpdate={onUpdate}></EditProductForm>
              </Modal>
              }
            </div>

      </div>
    );
  };
  
  export default ProductDetail;