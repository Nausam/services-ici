"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { QuranCompetitionregistrationDefaultValues } from "@/constants";
import { createQuranCompetitionRegistrationSchema } from "@/lib/validations";
import { QuranCompetitionRegistration } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import {
  createQuranCompetitionRegistration,
  uploadImage,
} from "@/lib/actions/quranCompetition.actions";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { FileUploader } from "../waste-management/FileUploader";
import BDropdown from "./BDropdown";
import QDropdown from "./QDropDown";
import QKeyStageDropDown from "./QKeyStageDropDown";

type ProductFormProps = {
  type: "Create" | "Update";
  registration?: QuranCompetitionRegistration;
};

const QuranRegistrationForm = ({ type, registration }: ProductFormProps) => {
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Use registration when provided (Update or Create with prefill from previous year)
  const initialValues = registration
    ? { ...registration }
    : QuranCompetitionregistrationDefaultValues;

  const form = useForm<
    z.infer<typeof createQuranCompetitionRegistrationSchema>
  >({
    resolver: zodResolver(createQuranCompetitionRegistrationSchema),
    defaultValues: initialValues,
    mode: "onTouched",
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
          idCard,
        });

        if (newRegistration) {
          form.reset();
          router.push("/");
          toast({
            title: ` އިންނަމާދޫ ކައުންސިލްގެ 8 ވަނަ ޤުރުއާން މުބާރާތުގައި     ${newRegistration.fullName} ރަޖިސްޓާ ކުރެވިއްޖެ`,
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error(
        `Failed to ${type === "Create" ? "create" : "update"} product:`,
        error
      );

      if (
        error instanceof Error &&
        error.message === "ALREADY_REGISTERED_THIS_YEAR"
      ) {
        toast({
          title: "ކޮންމެ އައިޑީކާޑެއްގެ ދަށުންވެސް ރެޖިސްޓާ ވެވޭނީ އެއްފަހަރު",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: `Failed to ${type === "Create" ? "create" : "update"} product`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle PDF download
  const handleDownloadRules = () => {
    const link = document.createElement("a");
    link.href = "/assets/files/Quran_Mubaaraathuge_Gavaidhu_2026.pdf";
    link.download = "Quran_Mubaaraathuge_Gavaidhu_2026.pdf";
    link.click();
  };

  const handleDownloadThari = () => {
    const link = document.createElement("a");
    link.href = "/assets/files/Thari_Booklet.pdf";
    link.download = "Thari_Booklet.pdf";
    link.click();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8 bg-white shadow-lg p-8 rounded-lg"
        dir="rtl"
      >
        <div className="flex flex-col items-start">
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleDownloadRules}
              className="bg-cyan-700 text-white hover:bg-cyan-600 transition duration-300 px-4 py-2 rounded-md shadow-md font-dhivehi text-lg"
            >
              މުބާރާތުގެ ޤަވާޢިދު
            </Button>

            {/* <Button
              type="button"
              onClick={handleDownloadThari}
              className="bg-cyan-700 text-white hover:bg-cyan-600 transition duration-300 px-4 py-2 rounded-md shadow-md font-dhivehi text-lg"
            >
              ތަރި ބުކްލެޓް
            </Button> */}
          </div>
          <p className="font-dhivehi text-xl text-right text-red-600 mt-5">
            {" "}
            ނޯޓް: ކީބޯޑް ދިވެހިބަހަށް ބަދަލު ކުރުމަށްފަހު ލިޔުއްވާ! އިތުރު
            މަޢުލޫމާތު ހޯއްދެވުމަށް 7981984 އަށް ގުޅުއްވުން އެދެން!
          </p>
        </div>

        {/* 1️⃣ Baiverivaa faraathuge */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-800">
            {" "}
            1. ބައިވެރިވާ ފަރާތުގެ މަޢުލޫމާތު
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {" "}
                    ފުރިހަމަ ނަން{" "}
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ފުރިހަމަ ނަން "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* ID Card */}
            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
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
                      className={cn(
                        "rounded-md font-dhivehi border text-right font-bold tracking-widest text-cyan-950",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    ދާއިމީ އެޑްރެސް
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ދާއިމީ އެޑްރެސް "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Sex */}
            <FormField
              control={form.control}
              name="sex"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {" "}
                    ޖިންސު{" "}
                  </p>
                  <FormControl>
                    <QDropdown
                      value={field.value}
                      onChangeHandler={(value) => field.onChange(value)}
                      hasError={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth" // Assuming this is for date selection
              render={({ field, fieldState }) => (
                <FormItem>
                  <p
                    dir="rtl"
                    className="font-dhivehi text-xl text-right text-cyan-950"
                  >
                    އުފަން ތާރީހް
                  </p>
                  <FormControl>
                    <input
                      type="date" // Native date picker
                      placeholder="އުފަން ތާރީހް"
                      {...field}
                      className={cn(
                        "w-full h-9 rounded-md border bg-white px-3 py-1 text-right font-dhivehi shadow-sm focus:outline-none focus:ring-2 text-cyan-950",
                        fieldState.error
                          ? "border-red-600 focus:ring-red-500"
                          : "border-gray-300 focus:ring-cyan-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Contact Number */}
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p
                    dir="rtl"
                    className="font-dhivehi text-xl text-right text-cyan-950"
                  >
                    ފޯނު ނަންބަރު
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ފޯނު ނަންބަރު "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* KeyStage */}
            <FormField
              control={form.control}
              name="keyStage"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {" "}
                    އުމުރުފުރާ{" "}
                  </p>
                  <FormControl>
                    <QKeyStageDropDown
                      value={field.value}
                      onChangeHandler={(val) => field.onChange(val)}
                      hasError={!!fieldState.error}
                    />
                  </FormControl>
                  {form.formState.errors.keyStage?.message ? (
                    <p
                      role="alert"
                      className="text-base font-medium text-red-600 font-dhivehi text-right"
                    >
                      {form.formState.errors.keyStage.message}
                    </p>
                  ) : null}{" "}
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 2️⃣ Beleniveriyaage */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-800">
            2. ބެލެނިވެރިޔާގެ މަޢުލޫމާތު (ހަމައެކަނި 18 އަހަރުން ދަށުގެ
            ކުޑަކުދިންނަށް)
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="parentName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {" "}
                    ބެލެނިވެރިޔާގެ ނަން
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ބެލެނިވެރިޔާގެ ނަން "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* ID Card */}
            <FormField
              control={form.control}
              name="parentIdCardNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    އައިޑީކާޑް ނަންބަރު
                  </p>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value?.startsWith("A")
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
                      className={cn(
                        "rounded-md font-dhivehi border text-right font-bold tracking-widest",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="parentAddress"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    ދާއިމީ އެޑްރެސް
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ދާއިމީ އެޑްރެސް "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Relationship */}
            <FormField
              control={form.control}
              name="relationship"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {" "}
                    ހުރިގާތްކަން{" "}
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ހުރިގާތްކަން "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Contact Number */}
            <FormField
              control={form.control}
              name="parentContactNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p
                    dir="rtl"
                    className="font-dhivehi text-xl text-right text-cyan-950"
                  >
                    ފޯނު ނަންބަރު
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ފޯނު ނަންބަރު "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 3️⃣ Baiverivaa Gofi */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-800">
            3. ބައިވެރިވާން ބޭނުންވާ ގޮފި
          </p>
          <div className="mt-5">
            <p className="font-dhivehi text-2xl text-right text-cyan-950">
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
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-cyan-950">
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
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-cyan-950">
                ނިމޭކޮޅު
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-dhivehi text-2xl text-right text-cyan-950">
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
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-cyan-950">
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
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-cyan-950">
                ނިމޭކޮޅު
              </p>
            </div>
          </div>
        </div>

        {/* 4️⃣ Final Round Baiverivaa Gofi */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-800">
            4. ފައިނަލް ބުރަށް ހޮވިއްޖެނަމަ އިޙްތިޔާރުކުރައްވާ ކޮޅު
          </p>
          <div className="mt-5">
            <p className="font-dhivehi text-2xl text-right text-cyan-950">
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
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-cyan-950">
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
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-cyan-950">
                ނިމޭކޮޅު
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-dhivehi text-2xl text-right text-cyan-950">
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
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-cyan-950">
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
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
              <p className="font-dhivehi text-xl text-right text-cyan-950">
                ނިމޭކޮޅު
              </p>
            </div>
          </div>
        </div>

        {/* 5️⃣ Bank Details */}
        <div className="mt-10">
          <p className="font-dhivehi text-2xl text-right text-cyan-800">
            5. ބޭންކު އެކައުންޓްގެ މަޢުލޫމާތު
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Account Name */}
            <FormField
              control={form.control}
              name="bankAccountName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    އެކައުންޓް ނަން (އިނގިރޭސިން)
                  </p>
                  <FormControl>
                    <Input
                      allowAllLanguages
                      placeholder=" އެކައުންޓް ނަން "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Account Number */}
            <FormField
              control={form.control}
              name="bankAccountNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p
                    dir="rtl"
                    className="font-dhivehi text-xl text-right text-cyan-950"
                  >
                    އެކައުންޓް ނަންބަރު
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" އެކައުންޓް ނަންބަރު "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Bank Name */}
            <FormField
              control={form.control}
              name="bankName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p
                    dir="rtl"
                    className="font-dhivehi text-xl text-right text-cyan-950"
                  >
                    ބޭންކުގެ ނަން
                  </p>
                  <FormControl>
                    <BDropdown
                      value={field.value}
                      onChangeHandler={(value) => field.onChange(value)}
                      hasError={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 6️⃣ Agreement */}
        <div className="mt-10">
          <div className="flex flex-col gap-4">
            <p className="font-dhivehi text-2xl text-right text-cyan-800">
              6. ބައިވެރިވާން ނުވަތަ ބައިވެރިކުރަން އަދި ހުށަހަޅާ ފަރާތުގެ
              އިޤްރާރު
            </p>

            <div>
              <p className="font-dhivehi text-xl text-right mt-5 text-cyan-950">
                މި ފޯމްގައިވާ ހުރިހައި މަޢުލޫމާތުތަކަކީ ތެދު މަޢުލޫމާތުކަމަށާއި،
                މުބާރާތުގެ ޤަވާއިދު ކިޔައި އެއަށް ހުރުމަތްތެރިކޮށް ހިތުމަށް
                އަޅުގަނޑު އިޤްރާރުވަމެވެ.{" "}
              </p>
              <p className="font-dhivehi text-xl text-right mt-5 text-cyan-950">
                (18 އަހަރުން ދަށުގެ ބައިވެރިއެއްނަމަ މިއިޤްރާރުގައި ނަން ޖަހައި
                އެއްބަސްވާނީ ބެލެނިވެރިޔާއެވެ.)
              </p>
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field, fieldState }) => (
                  <FormItem className="flex items-center gap-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={cn(
                          "focus:ring-cyan-500",
                          fieldState.error
                            ? "border-red-600 text-red-600 focus:ring-red-500"
                            : "text-cyan-700 border-cyan-600"
                        )}
                      />
                    </FormControl>
                    <FormLabel className="font-dhivehi text-lg text-right text-cyan-950">
                      އިޤްރާރުވަމެވެ.
                    </FormLabel>
                    <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Agreeyer Name */}

            <FormField
              control={form.control}
              name="agreeyerName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    ނަން
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ނަން "
                      {...field}
                      className={cn(
                        "rounded-md font-dhivehi border text-right",
                        fieldState.error
                          ? "border-red-600 focus-visible:ring-red-500"
                          : "border-gray-300"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />

            {/* Agreed Date */}
            <FormField
              control={form.control}
              name="agreedDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    ތާރީހް
                  </p>
                  <FormControl>
                    <input
                      type="date" // Native date picker
                      placeholder="ތާރީހް"
                      {...field}
                      className={cn(
                        "w-full h-9 rounded-md border bg-white px-3 py-1 text-right font-dhivehi shadow-sm focus:outline-none focus:ring-2",
                        fieldState.error
                          ? "border-red-600 focus:ring-red-500"
                          : "border-gray-300 focus:ring-cyan-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-5">
          {/* Image Upload */}
          <p className="font-dhivehi text-xl text-right text-cyan-950">
            ބައިވެރިވާ ފަރާތުގެ އައިޑީކާޑު (ފޮޓޯ ނުވަތަ ޕީޑީއެފް ފައިލް)
          </p>
          <FormField
            control={form.control}
            name="idCard"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={cn(
                      "rounded-md border-2 border-dashed transition-colors",
                      fieldState.error ? "border-red-600" : "border-gray-300"
                    )}
                  >
                    <FileUploader
                      onFieldChange={field.onChange}
                      imageUrl={field.value}
                      setFile={setFile}
                    />
                  </div>
                </FormControl>
                <FormMessage className="font-dhivehi text-right text-base font-medium text-red-600" />
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
