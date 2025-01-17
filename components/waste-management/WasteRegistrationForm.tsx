"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createRegistration, uploadImage } from "@/lib/actions/waste.actions";
import Image from "next/legacy/image";
import { createRegistrationSchema } from "@/lib/validations";
import { Registration } from "@/types";
import { registrationDefaultValues } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Dropdown from "./Dropdown";
import { FileUploader } from "./FileUploader";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type ProductFormProps = {
  type: "Create" | "Update";
  registration?: Registration;
};

const WasteRegistrationForm = ({ type, registration }: ProductFormProps) => {
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const initialValues =
    registration && type === "Update"
      ? {
          ...registration,
        }
      : registrationDefaultValues;

  const form = useForm<z.infer<typeof createRegistrationSchema>>({
    resolver: zodResolver(createRegistrationSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (
    values: z.infer<typeof createRegistrationSchema>
  ) => {
    setIsSubmitting(true);

    try {
      let idCard = registration?.idCard || "";

      if (file) {
        idCard = await uploadImage(file);
      }

      if (type === "Create") {
        const newRegistration = await createRegistration({
          fullName: values.fullName,
          address: values.address,
          idCard,
          contactNumber: values.contactNumber,
          category: values.category,
        });

        if (newRegistration) {
          form.reset();
          // router.push(`/shop/${newRegistration.id}`);
          // alert("Product created successfully!");
          toast({
            title: ` ކުނި އުކާލުމާއި ކުނި ނައްތާލުމުގެ ހިދުމަތަށް ${newRegistration.fullName} ރަޖިސްޓްރީ ކުރެވިއްޖެ`,
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error(
        `Failed to ${type === "Create" ? "create" : "update"} product:`,
        error
      );

      toast({
        title: `Failed to ${type === "Create" ? "create" : "update"} product`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8 bg-white shadow-lg p-8 rounded-lg"
        dir="rtl"
      >
        <p className="font-dhivehi text-xl text-right text-cyan-700">
          {" "}
          ނޯޓް: ކީބޯޑް ދިވެހިބަހަށް ބަދަލު ކުރުމަށްފަހު ލިޔުއްވާ!
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          {/* Full Name */}

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right">
                  {" "}
                  ފުރިހަމަ ނަން{" "}
                </p>
                <FormControl>
                  <Input
                    placeholder=" ފުރިހަމަ ނަން "
                    {...field}
                    className="rounded-md font-dhivehi border-gray-300  text-right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right">
                  {" "}
                  އެޑްރެސް / ކުންފުނި / މުައައްސަސާ{" "}
                </p>
                <FormControl>
                  <Input
                    placeholder=" އެޑްރެސް  "
                    {...field}
                    className="rounded-md font-dhivehi border-gray-300 text-right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right"> ކެޓެގަރީ </p>
                <FormControl>
                  <Dropdown
                    value={field.value}
                    onChangeHandler={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Number */}
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right">
                  {" "}
                  ފޯނު ނަންބަރު{" "}
                </p>
                <FormControl>
                  <Input
                    placeholder=" ފޯނު ނަންބަރު "
                    {...field}
                    className="rounded-md font-dhivehi border-gray-300  text-right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-6">
          {/* Image Upload */}
          <p className="font-dhivehi text-xl text-right">އައިޑީ ކާޑް</p>
          <FormField
            control={form.control}
            name="idCard"
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

        {/* Submit Button */}
        <div className="flex justify-start">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-cyan-700 text-white hover:bg-cyan-600 transition duration-300 px-6 py-3 rounded-md shadow-md font-dhivehi text-xl"
          >
            {isSubmitting ? "Submitting..." : " ރަޖިސްޓާ ކުރައްވާ "}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WasteRegistrationForm;
