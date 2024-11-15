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
import { SignUpSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const form = useForm({
      resolver: zodResolver(SignUpSchema),
      defaultValues: {
        username: "",
        password: "",
        email: "",
      },
    });
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
          navigate("/product");
        }
      }, [navigate]);
  
    const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
      setLoading(true);
      try {
        const response = await axios.post("http://127.0.0.1:8000/user/signup", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        console.log("Signup successful:", response.data);
        navigate("/product"); 
      } catch (error) {
        console.error("Signup failed:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="h-screen flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
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
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="JohnDoe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="johndoe@example.com" />
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
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Log In
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default SignUp;