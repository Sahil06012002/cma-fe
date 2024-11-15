import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LogIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/product");
    }
  }, [navigate]);

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await axios.post("http://127.0.0.1:8000/user/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;
      console.log("token-------------->"+access_token)
      localStorage.setItem("access_token", access_token);

      navigate("/product");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="******" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                {loading ? "Loading..." : "Log In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LogIn;
