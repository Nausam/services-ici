"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { createPermissionRequest } from "@/lib/actions/permissions.actions";
import NewDropdown from "../NewDropdown";
import { permissionRequestSchema } from "@/lib/validations";
import { permissionOptions } from "@/constants";
import { Textarea } from "../ui/textarea";

const PermissionRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof permissionRequestSchema>>({
    resolver: zodResolver(permissionRequestSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      company: "",
      permissionType: "",
      reason: "",
      startDate: "",
      endDate: "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof permissionRequestSchema>
  ) => {
    setIsSubmitting(true);
    try {
      const newRequest = await createPermissionRequest(values);

      if (newRequest && "permissionType" in newRequest) {
        form.reset();
        router.push("/");
        toast({
          title: `${newRequest.permissionType} ހަމަޖެހުނު އެންމެ އަވަހަކަށް، ހުއްދަ ލިބުނުކަމުގެ ސްލިޕް ވައިބާ ނަންބަރަށް ލިބިގެންދާނެ`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      toast({
        title: "ރެޖިސްޓޭޝަން ތަކެއް ލިބެން ފެށިއްޖެ",
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
        <p className="font-dhivehi text-xl text-right text-red-600">
          ނޯޓް: ކީބޯޑް ދިވެހިބަހަށް ބަދަލު ކުރުމަށްފަހު ލިޔުއްވާ! އިތުރު
          މަޢުލޫމާތު ހޯއްދެވުމަށް 9892099 އަށް ގުޅުއްވުން އެދެން!
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  ފުރިހަމަ ނަން
                </p>
                <FormControl>
                  <Input {...field} className="rounded-md text-right" />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  ކުންފުނި (ކުންފުންޏެއް ނޫންނަމަ ހުސްކޮށް ދޫކޮށްލައްވާ!)
                </p>
                <FormControl>
                  <Input {...field} className="rounded-md text-right" />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  {" "}
                  ފޯނު ނަންބަރު{" "}
                </p>
                <FormControl>
                  <Input {...field} className="rounded-md text-right" />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permissionType"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  ހުއްދައިގެ ބާވަތް
                </p>
                <FormControl>
                  <NewDropdown
                    value={field.value}
                    onChangeHandler={field.onChange}
                    options={permissionOptions}
                    placeholder="ހުއްދައިގެ ބާވަތް"
                  />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem dir="rtl" className="text-right">
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  {" "}
                  ފަށާ ދުވަސް
                </p>
                <FormControl dir="rtl" className="text-right">
                  <Input
                    dir="rtl"
                    type="date"
                    {...field}
                    className="rounded-md text-right"
                  />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  ނިމޭ ދުވަސް
                </p>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="rounded-md text-right"
                  />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  ސަބަބު
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    className="rounded-md text-right font-dhivehi"
                  />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="bg-cyan-700 text-white font-dhivehi text-lg"
        >
          {isSubmitting ? "ރެޖިސްޓާ ކުރަނީ..." : "ރެޖިސްޓާ ކުރައްވާ"}
        </Button>
      </form>
    </Form>
  );
};

export default PermissionRequestForm;
