"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { FileUploader } from "@/components/waste-management/FileUploader";
import {
  createHomeCards,
  updateHomeCards,
  uploadImage,
} from "@/lib/actions/home.actions";
import { HomeCard } from "@/types";
import { useParams, useRouter } from "next/navigation";
import H_DropDown from "./H_DropDown";
import { useUser } from "@/providers/UserProvider";

const quizSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, " ސުރުހީ ލިޔުއްވާ! "),
  description: z.string().min(7, " އިތުރު ތަފްސީލު ލިޔުއްވާ! "),
  link: z.string().min(5, " އައިޑީކާޑް ނަންބަރު ލިޔުއްވާ! "),
  buttonText: z.string().min(1, "އެންމެން ޖަހައްސަވާނެ"),
  dueDate: z.string().min(1, "އެންމެން ޖަހައްސަވާނެ"),
  image: z.string().min(1, "އެންމެން ޖަހައްސަވާނެ"),
  hidden: z.boolean().default(false),
  imageId: z.string().optional(),
  category: z.string().min(1, " ސުރުހީ ލިޔުއްވާ! "),
});

type HomeCardFormProps = {
  type: "Create" | "Update";
  HomeCard?: HomeCard;
};

const HomeCardForm = ({ type, HomeCard }: HomeCardFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const { id } = useParams();

  const { isAdmin, isSuperAdmin } = useUser();

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      id: HomeCard?.id || "",
      title: HomeCard?.title || "",
      description: HomeCard?.description || "",
      link: HomeCard?.link || "",
      buttonText: HomeCard?.buttonText || "",
      dueDate: HomeCard?.dueDate || "",
      image: HomeCard?.image || "",
      imageId: HomeCard?.imageId || "",
      hidden: HomeCard?.hidden || false,
      category: HomeCard?.category || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof quizSchema>) => {
    setIsSubmitting(true);

    try {
      let image = HomeCard?.image || "";
      let imageId = HomeCard?.imageId || "";

      if (file) {
        const uploadResult = await uploadImage(file);
        image = uploadResult.url;
        imageId = uploadResult.id;
      }

      if (type === "Create") {
        const newHomeCard = await createHomeCards({
          title: values.title,
          description: values.description,
          link: values.link,
          buttonText: values.buttonText,
          dueDate: values.dueDate,
          image: image,
          imageId,
          hidden: values.hidden,
          category: values.category,
        });

        if (newHomeCard) {
          form.reset();
          router.push("/"); // Redirect after creation
          toast({
            title: `${newHomeCard.title} ކްރިއޭޓް ކުރެވިއްޖެ`,
            variant: "default",
          });
        }
      } else if (type === "Update") {
        const updatedHomeCard = await updateHomeCards(id as string, {
          title: values.title,
          description: values.description,
          link: values.link,
          buttonText: values.buttonText,
          dueDate: values.dueDate,
          image: image,
          imageId,
          hidden: values.hidden,
          category: values.category,
        });

        if (updatedHomeCard) {
          console.log("Card Updated:", updatedHomeCard);
          toast({
            title: `${updatedHomeCard.title} އަޕްޑޭޓް ކުރެވިއްޖެ`,
            variant: "default",
          });
          router.push("/"); // Redirect after update
        }
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast({
        title: "ފޯމުގައި އެއްވުމަކުން ނުފެނުނު",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSuperAdmin && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-8 bg-white shadow-lg p-8 rounded-lg"
            dir="rtl"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <p className="font-dhivehi text-xl text-right text-cyan-950">
                      ސުރުހީ
                    </p>
                    <FormControl>
                      <Input
                        placeholder=" ސުރުހީ "
                        {...field}
                        className="rounded-md font-dhivehi border-gray-300  text-right "
                      />
                    </FormControl>
                    <FormMessage className="font-dhivehi text-md" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <p className="font-dhivehi text-xl text-right text-cyan-950">
                      ތަފްސީލު
                    </p>
                    <FormControl>
                      <Input
                        placeholder=" ތަފްސީލު "
                        {...field}
                        className="rounded-md font-dhivehi border-gray-300  text-right "
                      />
                    </FormControl>
                    <FormMessage className="font-dhivehi text-md" />
                  </FormItem>
                )}
              />

              {/* Link */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <p className="font-dhivehi text-xl text-right text-cyan-950">
                      ލިންކު (އިނގިރޭސިން)
                    </p>
                    <FormControl>
                      <Input
                        placeholder=" ލިންކު "
                        {...field}
                        className="rounded-md font-dhivehi border-gray-300  text-right "
                        allowAllLanguages
                      />
                    </FormControl>
                    <FormMessage className="font-dhivehi text-md" />
                  </FormItem>
                )}
              />

              {/* Button Text */}
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <p className="font-dhivehi text-xl text-right text-cyan-950">
                      ބަޓަން ޓެކްޓް
                    </p>
                    <FormControl>
                      <Input
                        placeholder=" ބަޓަން ޓެކްޓް "
                        {...field}
                        className="rounded-md font-dhivehi border-gray-300  text-right "
                        allowAllLanguages
                      />
                    </FormControl>
                    <FormMessage className="font-dhivehi text-md" />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate" // Assuming this is for date selection
                render={({ field }) => (
                  <FormItem>
                    <p
                      dir="rtl"
                      className="font-dhivehi text-xl text-right text-cyan-950"
                    >
                      މުއްދަތު
                    </p>
                    <FormControl>
                      <input
                        type="datetime-local" // Native date picker
                        placeholder=" މުއްދަތު "
                        {...field}
                        className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-right font-dhivehi shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-cyan-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <p className="font-dhivehi text-xl text-right text-cyan-950">
                      {" "}
                      ޖިންސު{" "}
                    </p>
                    <FormControl>
                      <H_DropDown
                        value={field.value}
                        onChangeHandler={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden Toggle */}
              <FormField
                control={form.control}
                name="hidden"
                render={({ field }) => (
                  <FormItem>
                    <p className="font-dhivehi text-xl text-right text-cyan-950">
                      ފޮރުވާފަ؟
                    </p>
                    <FormControl>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded-md text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                        />
                        <span className="mr-2 font-dhivehi text-cyan-800">
                          {field.value ? "ފޮރުވާ" : "ދައްކާ"}
                        </span>
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-6">
              {/* Image Upload */}
              <p className="font-dhivehi text-xl text-right text-cyan-950">
                ފޮޓޯ
              </p>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploader
                        onFieldChange={field.onChange}
                        imageUrl={field.value}
                        setFile={setFile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-start">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-cyan-700 text-white hover:bg-cyan-600 transition duration-300 px-6 py-3 rounded-md shadow-md font-dhivehi text-xl"
              >
                {isSubmitting
                  ? type === "Create"
                    ? " ކްރިއޭޓް ކުރަނީ..."
                    : " އަޕްޑޭޓް ކުރަނީ..."
                  : type === "Create"
                  ? "ކްރިއޭޓް"
                  : "އަޕްޑޭޓް"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default HomeCardForm;
