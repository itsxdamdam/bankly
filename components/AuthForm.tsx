"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formSchema = authFormSchema(type);

  // Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    // Do something with the form values.
    try {
      // sign up with Appwrite and create plaid token

      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };

        const newUser = await signUp(userData);

        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) router.push("/");
      }
    } catch (error: any) {
      setError(error.message || "Please check input fields properly");
    } finally {
      setIsLoading(false);
    }
    // ✅ This will be type-safe and validated.
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="icons/logo.svg"
            width={34}
            height={34}
            alt="Horizbank logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizbank
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-bold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}

            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      name="firstName"
                      control={form.control}
                      label="First Name"
                      placeholder="Enter your First Name"
                    />
                    <CustomInput
                      name="lastName"
                      control={form.control}
                      label="Last Name"
                      placeholder="Enter your Last Name"
                    />
                  </div>

                  <CustomInput
                    name="address1"
                    control={form.control}
                    label="Address"
                    placeholder="Enter your specific Address"
                  />

                  <CustomInput
                    name="city"
                    control={form.control}
                    label="City"
                    placeholder="Enter your specific City"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      name="state"
                      control={form.control}
                      label="State"
                      placeholder="Example: NY"
                    />
                    <CustomInput
                      name="postalCode"
                      control={form.control}
                      label="Postal Code"
                      placeholder="Example: 10022"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      name="dateOfBirth"
                      control={form.control}
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                    />
                    <CustomInput
                      name="ssn"
                      control={form.control}
                      label="SSN"
                      placeholder="Example: 2344"
                    />
                  </div>
                </>
              )}
              <CustomInput
                name="email"
                control={form.control}
                label="Email"
                placeholder="Enter your email"
              />
              <CustomInput
                name="password"
                control={form.control}
                label="Password"
                placeholder="Enter your password"
              />

              <div className="flex flex-col gap-4">
                {error && <p className="text-red-600">{error}</p>}
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
              <p>{user}</p>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Dont have an account?"
                : "Already have an account"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
