import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/modal";
import AddProductForm from "./add-product-form";
import { Button } from "@/components/ui/button";
import BASE_URL from "@/constants";

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const fetchProducts = async (keyword: string = "") => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<{ "product list": Product[] }>(
        `${BASE_URL}/product${keyword ? `?keyword=${keyword}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data["product list"]);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      fetchProducts(e.target.value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handleCardClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const toggleAddProductModal = () => {
    setShowAddProductModal(!showAddProductModal);
  };

  const addProductToList = (newProduct: Product) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };
  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search products..."
          value={searchKeyword}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <Button onClick={toggleAddProductModal} className="ml-4">
          Add Product
        </Button>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="border border-gray-300 shadow-sm cursor-pointer"
              onClick={() => handleCardClick(product.id)}
            >
              <CardHeader>
                <CardTitle>{product.title || "-"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <strong>Description:</strong> {product.description || "-"}
                </p>
                <p className="text-sm">
                  <strong>Product Tag:</strong> {product.product_tag || "-"}
                </p>
                <p className="text-sm">
                  <strong>Company:</strong> {product.company || "-"}
                </p>
              </CardContent>
            </Card>

          ))}

        {showAddProductModal && (
        <Modal onClose={toggleAddProductModal}>
            <AddProductForm onClose={toggleAddProductModal} addProductToList={addProductToList} />
        </Modal>
      )}
        </div>
      )}
    </div>
  );
};

export default Product;
