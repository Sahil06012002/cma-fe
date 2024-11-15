import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";


import { toast } from "react-toastify";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema } from "@/schema";
import { z } from "zod";

interface AddProductFormProps {
  onClose: () => void;
  addProductToList: (newProduct: any) => void;
}

const AddProductForm = ({ onClose, addProductToList }: AddProductFormProps) => {
    const [loading, setLoading] = useState(false);
  
    const form = useForm({
      resolver: zodResolver(ProductSchema),
      defaultValues: {
        title: "",
        product_tag: "",
        dealer: "",
        description: "",
        company: "",
        // images: []
      }
    });
  
    const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
      // if (!data.images || data.images.length > 10) {
      //   toast.error("You can upload up to 10 photos only.");
      //   return;
      // }
  
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("product_tag", data.product_tag || "");
      formData.append("company", data.company || "");
      formData.append("dealer", data.dealer || "");
  
      // Append images to FormData
      // Array.from(data.images).forEach((image, index) => {
      //   formData.append(`photos[${index}]`, image || []);
      // });
  
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("User not authenticated.");
          return;
        }
        console.log("post called------>")
  
        const response = await axios.post("http://127.0.0.1:8000/product", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        toast.success("Product added successfully!");
        const newProduct = response.data["added product"];
        addProductToList(newProduct);
        onClose();
        console.log(response.data);
      } catch (error) {
        toast.error("Error adding product.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="max-w-lg mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
  
            {/* <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Images (Max 10)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
  
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Add Product"}
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
    );
  };
  
  export default AddProductForm;
