"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import { ShadInput } from "../ui/shad-input";
import { toast } from "@/hooks/use-toast";

type FormType = "sign-in" | "sign-up";

// **Schema for Validation**
const authFormSchema = (formType: FormType) =>
  z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    fullName:
      formType === "sign-up"
        ? z.string().min(2, "Name must be at least 2 characters").max(50)
        : z.string().optional(),
  });

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (type === "sign-up") {
        await createAccount({
          fullName: values.fullName || "",
          email: values.email,
          password: values.password,
        });

        toast({
          title: "Account created successfully! Please log in.",
          variant: "default",
        });
      } else {
        const user = await signInUser({
          email: values.email,
          password: values.password,
        });

        if (user.sessionId) {
          toast({
            title: "Login successful!",
            variant: "default",
          });
          window.location.href = "/";
        } else {
          toast({
            title: "Login failed!",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      setErrorMessage(
        type === "sign-up"
          ? "Failed to create account. Please try again."
          : "Failed to sign in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
        <h1 className="form-title">
          {type === "sign-in" ? "Sign In" : "Sign Up"}
        </h1>

        {type === "sign-up" && (
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Full Name</FormLabel>
                  <FormControl>
                    <ShadInput
                      placeholder="Enter your full name"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>
                <FormControl>
                  <ShadInput
                    type="email"
                    placeholder="Enter your email"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Password</FormLabel>
                <FormControl>
                  <ShadInput
                    type="password"
                    placeholder="Enter your password"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="form-submit-button"
          disabled={isLoading}
        >
          {type === "sign-in" ? "Sign In" : "Sign Up"}
          {isLoading && (
            <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              width={24}
              height={24}
              className="ml-2 animate-spin"
            />
          )}
        </Button>

        {errorMessage && <p className="error-message">*{errorMessage}</p>}

        {/* <div className="body-2 flex justify-center">
          <p className="text-slate-600">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="ml-1 font-bold text-cyan-600"
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </div> */}
      </form>
    </Form>
  );
};

export default AuthForm;
