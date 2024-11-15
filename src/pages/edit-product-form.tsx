import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProductSchema } from "@/schema";
import { z } from "zod";
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
interface EditProductFormProps {
  productDetails : ProductDetail | null ;
  onClose: () => void;
  onUpdate: (updatedProduct: any) => void;
}

const EditProductForm = ({ productDetails, onClose, onUpdate }: EditProductFormProps) => {
if (!productDetails) {
    return <div>Product not found!</div>; 
    }
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(EditProductSchema),
    defaultValues: productDetails,
  });

  const onSubmit = async (data: z.infer<typeof EditProductSchema>) => {
    const updatedProduct = {
      title: data.title,
      description: data.description || "",
      product_tag: data.product_tag || "",
      company: data.company || "",
      dealer: data.dealer || "",
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/product/${productDetails.id}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Product updated successfully!");
      onUpdate(response.data["updated product"]);
      onClose();
    } catch (error) {
      toast.error("Error updating product.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <div
        className="overflow-y-auto max-h-[80vh] p-4 border border-gray-200 rounded-lg"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Fields */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Product Title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product_tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Tag</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Product Tag" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dealer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dealer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Dealer Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Product Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Company Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Update Product"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="ml-2"
            >
              Cancel
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProductForm;
