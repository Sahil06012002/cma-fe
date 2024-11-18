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
import BASE_URL from "@/constants";

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
        images: []
      }
    });
  
    const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
      if (!data.images || data.images.length > 10) {
        toast.error("You can upload up to 10 photos only.");
        return;
      }
  
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("product_tag", data.product_tag || "");
      formData.append("company", data.company || "");
      formData.append("dealer", data.dealer || "");
  
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          console.log("----------------------------------")
          console.log(typeof image)
          console.log(image)
          console.log("----------------------------------")

          formData.append("photos", image);
        });
      }


  
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("User not authenticated.");
          return;
        }  
        const response = await axios.post(`${BASE_URL}/product`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

  
        toast.success("Product added successfully!");
        const newProduct = response.data["added product"];
        console.log("type of new product")
        console.log(newProduct);
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

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      // Combine existing files with new ones
                      const existingFiles = Array.from(field.value || []);
                      const newFiles = Array.from(files);
                      field.onChange([...existingFiles, ...newFiles]);
                    }
                  }}
                />
              </FormControl>
              <div className="mt-2">
                {field.value && field.value.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {Array.from(field.value).map((file: File, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No files selected</p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
</div>

    );
  };
  
  export default AddProductForm;
