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
import { uploadImage } from "@/lib/actions/waste.actions";

import { createQuranCompetitionRegistrationSchema } from "@/lib/validations";
import { QuranCompetitionRegistration } from "@/types";
import { QuranCompetitionregistrationDefaultValues } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

import { FileUploader } from "../waste-management/FileUploader";
import QDropdown from "./QDropDown";
import { Checkbox } from "../ui/checkbox";
import { createQuranCompetitionRegistration } from "@/lib/actions/quranCompetition.actions";

type ProductFormProps = {
  type: "Create" | "Update";
  registration?: QuranCompetitionRegistration;
};

const QuranRegistrationForm = ({ type, registration }: ProductFormProps) => {
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const initialValues =
    registration && type === "Update"
      ? {
          ...registration,
        }
      : QuranCompetitionregistrationDefaultValues;

  const form = useForm<
    z.infer<typeof createQuranCompetitionRegistrationSchema>
  >({
    resolver: zodResolver(createQuranCompetitionRegistrationSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (
    values: z.infer<typeof createQuranCompetitionRegistrationSchema>
  ) => {
    setIsSubmitting(true);

    try {
      let idCard = registration?.idCard || "";

      if (file) {
        idCard = await uploadImage(file);
      }

      if (type === "Create") {
        const newRegistration = await createQuranCompetitionRegistration({
          ...values,
          idCard: values.idCard,
        });

        if (newRegistration) {
          form.reset();
          router.push("/");
          toast({
            title: ` އިންނަމާދޫ ކައުންސިލްގެ 8 ވަނަ ޤުރުއާން މުބާރާތުގައި     ${newRegistration.fullName} ރަޖިސްޓްރީ ކުރެވިއްޖެ`,
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

        {/* Baiverivaa faraathuge */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-700">
            {" "}
            1. ބައިވެރިވާ ފަރާތުގެ މަޢުލޫމާތު
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

            {/* ID Card */}
            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">
                    އައިޑީކާޑް ނަންބަރު
                  </p>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value.startsWith("A")
                          ? field.value
                          : `A${field.value}`
                      } // Always starts with "A"
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        // Remove non-digit characters after "A"
                        const numericPart = inputValue
                          .replace(/^A/, "")
                          .replace(/\D/g, "");

                        // Update the value with "A" prefix and numeric part
                        field.onChange(`A${numericPart}`);
                      }}
                      placeholder="A123456"
                      className="rounded-md font-dhivehi border-gray-300 text-right font-bold tracking-widest"
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
                    ދާއިމީ އެޑްރެސް
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ދާއިމީ އެޑްރެސް "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sex */}
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right"> ޖިންސު </p>
                  <FormControl>
                    <QDropdown
                      value={field.value}
                      onChangeHandler={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">
                    {" "}
                    އުފަން ތާރީހް{" "}
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" އުފަން ތާރީހް "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
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
                  <p dir="rtl" className="font-dhivehi text-xl text-right">
                    ފޯނު ނަންބަރު
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
        </div>

        {/* Beleniveriyaage */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-700">
            {" "}
            2. ބެލެނިވެރިޔާގެ މަޢުލޫމާތު - ހަމައެކަނި 18 އަހަރުން ދަށުގެ
            ކުޑަކުދިންނަށް
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">
                    {" "}
                    ބެލެނިވެރިޔާގެ ނަން
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ބެލެނިވެރިޔާގެ ނަން "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID Card */}
            <FormField
              control={form.control}
              name="parentIdCardNumber"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">
                    އައިޑީކާޑް ނަންބަރު
                  </p>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value.startsWith("A")
                          ? field.value
                          : `A${field.value}`
                      } // Always starts with "A"
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        // Remove non-digit characters after "A"
                        const numericPart = inputValue
                          .replace(/^A/, "")
                          .replace(/\D/g, "");

                        // Update the value with "A" prefix and numeric part
                        field.onChange(`A${numericPart}`);
                      }}
                      placeholder="A123456"
                      className="rounded-md font-dhivehi border-gray-300 text-right font-bold tracking-widest"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="parentAddress"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">
                    ދާއިމީ އެޑްރެސް
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ދާއިމީ އެޑްރެސް "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relationship */}
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">
                    {" "}
                    ހުރިގާތްކަން{" "}
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ހުރިގާތްކަން "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            {/* <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">
                    {" "}
                    އުފަން ތާރީހް{" "}
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" އުފަން ތާރީހް "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Contact Number */}
            <FormField
              control={form.control}
              name="parentContactNumber"
              render={({ field }) => (
                <FormItem>
                  <p dir="rtl" className="font-dhivehi text-xl text-right">
                    ފޯނު ނަންބަރު
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
        </div>

        {/* Bank Details */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-700">
            3. ބޭންކު އެކައުންޓްގެ މަޢުލޫމާތު
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Account Name */}
            <FormField
              control={form.control}
              name="bankAccountName"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">
                    {" "}
                    އެކައުންޓް ނަން
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" އެކައުންޓް ނަން "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Number */}
            <FormField
              control={form.control}
              name="bankAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <p dir="rtl" className="font-dhivehi text-xl text-right">
                    އެކައުންޓް ނަންބަރު
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" އެކައުންޓް ނަންބަރު "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank Name */}
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <p dir="rtl" className="font-dhivehi text-xl text-right">
                    ބޭންކުގެ ނަން
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ބޭންކުގެ ނަން "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Agreement */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-700">
            4. ބައިވެރިވާން ނުވަތަ ބައިވެރިކުރަން އަދި ހުށަހަޅާ ފަރާތުގެ
            އިޤްރާރު
          </p>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                    />
                  </FormControl>
                  {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="font-dhivehi text-xl text-right mt-5 text-slate-700">
              މި ފޯމްގައިވާ ހުރިހައި މަޢުލޫމާތުތަކަކީ ތެދު މަޢުލޫމާތުކަމަށާއި،
              މުބާރާތުގެ ޤަވާއިދު ކިޔައި އެއަށް ހުރުމަތްތެރިކޮށް ހިތުމަށް
              އަޅުގަނޑު އިޤްރާރުވަމެވެ.{" "}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Agreeyer Name */}

            <FormField
              control={form.control}
              name="agreeyerName"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">ނަން</p>
                  <FormControl>
                    <Input
                      placeholder=" ނަން "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Agreed Date */}
            <FormField
              control={form.control}
              name="agreedDate"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right">ތާރީހް</p>
                  <FormControl>
                    <Input
                      placeholder=" ތާރީހް "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Baiverivaa Gofi */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-700">
            5. ބައިވެރިވާން ބޭނުންވާ ގޮފި
          </p>
          <div className="mt-5">
            <p className="font-dhivehi text-2xl text-right">
              ބަލައިގެން ކިޔެވުން
            </p>
            <div className="flex gap-2 mt-5">
              <FormField
                control={form.control}
                name="balaigenKiyevunFeshey"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                      />
                    </FormControl>
                    {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-slate-700">
                ފެށޭކޮޅު
              </p>
            </div>

            <div className="flex gap-2 mt-5">
              <FormField
                control={form.control}
                name="balaigenKiyevunNimey"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                      />
                    </FormControl>
                    {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-slate-700">
                ނިމޭކޮޅު
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-dhivehi text-2xl text-right">
              ނުބަލައި ކިޔެވުން
            </p>
            <div className="flex gap-2 mt-5">
              <FormField
                control={form.control}
                name="nubalaaKiyevunFeshey"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                      />
                    </FormControl>
                    {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-slate-700">
                ފެށޭކޮޅު
              </p>
            </div>

            <div className="flex gap-2 mt-5">
              <FormField
                control={form.control}
                name="nubalaaKiyevunNimey"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                      />
                    </FormControl>
                    {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-slate-700">
                ނިމޭކޮޅު
              </p>
            </div>
          </div>
        </div>

        {/* Final Round Baiverivaa Gofi */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-700">
            6. ފައިނަލް ބުރަށް ހޮވިއްޖެނަމަ އިޙްތިޔާރުކުރައްވާ ކޮޅު
          </p>
          <div className="mt-5">
            <p className="font-dhivehi text-2xl text-right">
              ބަލައިގެން ކިޔެވުން
            </p>
            <div className="flex gap-2 mt-5">
              <FormField
                control={form.control}
                name="finalRoundBalaigenKiyevunFeshey"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                      />
                    </FormControl>
                    {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-slate-700">
                ފެށޭކޮޅު
              </p>
            </div>

            <div className="flex gap-2 mt-5">
              <FormField
                control={form.control}
                name="finalRoundBalaigenKiyevunNimey"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                      />
                    </FormControl>
                    {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-slate-700">
                ނިމޭކޮޅު
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-dhivehi text-2xl text-right">
              ނުބަލައި ކިޔެވުން
            </p>
            <div className="flex gap-2 mt-5">
              <FormField
                control={form.control}
                name="finalRoundNubalaaKiyevunFeshey"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                      />
                    </FormControl>
                    {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-slate-700">
                ފެށޭކޮޅު
              </p>
            </div>

            <div className="flex gap-2 mt-5">
              <FormField
                control={form.control}
                name="finalRoundNubalaaKiyevunNimey"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-cyan-700 border-cyan-600 focus:ring-cyan-500"
                      />
                    </FormControl>
                    {/* <FormLabel className="font-dhivehi text-lg text-right">
                    ފާހަގަ ޖައްސަވާ
                  </FormLabel> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-slate-700">
                ނިމޭކޮޅު
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-5">
          {/* Image Upload */}
          <p className="font-dhivehi text-xl text-right">
            {" "}
            ބައިބެރިވާ ފަރާތުގެ އައިޑީކާޑް{" "}
          </p>
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
            {isSubmitting ? "ރެޖިސްޓާ ކުރަނީ..." : "ރެޖިސްޓާ ކުރައްވާ"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuranRegistrationForm;
