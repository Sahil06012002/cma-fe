import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";


import { toast } from "react-toastify";
import axios from "axios";

interface ProductFormData {
  title: string;
  description: string;
  product_tag: string;
  company: string;
  dealer: string;
  photos: FileList | null;
}

const AddProductForm = () => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    if (!data.photos || data.photos.length > 10) {
      toast.error("You can upload up to 10 photos only.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("product_tag", data.product_tag);
    formData.append("company", data.company);
    formData.append("dealer", data.dealer);

    // Append images to FormData
    Array.from(data.photos).forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("User not authenticated.");
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/product", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");
      console.log(response.data); // Handle success response
    } catch (error) {
      toast.error("Error adding product.");
      console.error(error); // Handle error response
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="title">Product Title</Label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Product title is required." }}
            render={({ field }) => (
              <Input {...field} id="title" placeholder="Enter product title" />
            )}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Product description is required." }}
            render={({ field }) => (
              <Textarea {...field} id="description" placeholder="Enter product description" />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="product_tag">Product Tag</Label>
          <Controller
            name="product_tag"
            control={control}
            render={({ field }) => (
              <Input {...field} id="product_tag" placeholder="Enter product tag" />
            )}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="company">Company</Label>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Input {...field} id="company" placeholder="Enter company name" />
            )}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="dealer">Dealer</Label>
          <Controller
            name="dealer"
            control={control}
            render={({ field }) => (
              <Input {...field} id="dealer" placeholder="Enter dealer name" />
            )}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="photos">Product Photos (Max: 10)</Label>
          <Controller
            name="photos"
            control={control}
            rules={{ required: "Please upload at least one photo." }}
            render={({ field }) => (
              <Input {...field} type="file" accept="image/*" multiple />
            )}
          />
          {errors.photos && <p className="text-red-500 text-sm">{errors.photos.message}</p>}
        </div>

        <div className="flex justify-center mt-6">
          <Button type="submit" loading={loading} className="w-full">
            Add Product
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddProductForm;
