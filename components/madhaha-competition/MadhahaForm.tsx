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
import { MadhahaCompetitionRegistration } from "@/types";
import { madhahaSchema } from "@/lib/validations";
import { AGE_GROUPS } from "@/constants";
import ReusableDropdown from "../reusable/ReusableDropdown";
import { FileUploader } from "../waste-management/FileUploader";

import {
  createMadhahaCompetitionRegistration,
  getQuranParticipantByIdCard,
  updateMadhahaCompetitionRegistration,
  uploadImage,
} from "@/lib/actions/madhaha.actions";
import { useRouter } from "next/navigation";

type ProductFormProps = {
  type: "Create" | "Update";
  registration?: MadhahaCompetitionRegistration;
};

const MadhahaCompetitionForm = ({ type, registration }: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof madhahaSchema>>({
    resolver: zodResolver(madhahaSchema),
    defaultValues: {
  fullName: registration?.fullName || "",
  address: registration?.address || "",
  idCardNumber: registration?.idCardNumber || "",
  contactNumber: registration?.contactNumber || "",
  ageGroup: registration?.ageGroup || "",
  groupOrSolo: registration?.groupOrSolo === "ވަކިވަކިން" || registration?.groupOrSolo === "ގްރޫޕްކޮން"
    ? registration.groupOrSolo
    : undefined,
  groupMembers: registration?.groupMembers || [],
  madhahaName: registration?.madhahaName || "",
  madhahaLyrics: registration?.madhahaLyrics || "",
  idCard: registration?.idCard || "",
  groupName: registration?.groupName || "",
}
,
    mode: "onChange",
  });

  const handleSubmit = async (values: z.infer<typeof madhahaSchema>) => {
    setIsSubmitting(true);

    try {
      let idCard = values.idCard;

      // ✅ Check if a participant already exists
      const existingParticipant = await getQuranParticipantByIdCard(
        values.idCardNumber
      );

      if (existingParticipant && existingParticipant.idCard) {
        // ✅ If existing ID card exists, use it
        idCard = existingParticipant.idCard;
        console.log("Using existing ID Card:", idCard);
      } else if (file) {
        // ✅ If no existing file, upload a new one
        idCard = await uploadImage(file);
      }

      if (type === "Create") {
        const newRegistration = await createMadhahaCompetitionRegistration({
          ...values,
          idCard, // ✅ Use existing or newly uploaded file
          groupMembers: values.groupMembers ?? [],
        });

        if (newRegistration) {
          form.reset();
          router.push("/");
          toast({
            title: `އިންނަމާދޫ ކައުންސިލްގެ 3 ވަނަ މަދަޙަ މުބާރާތުގައި ${
              newRegistration.groupOrSolo === "ގްރޫޕްކޮން"
                ? newRegistration.groupName
                : newRegistration.fullName
            } ރެޖިސްޓާ ކުރެވިއްޖެ`,
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("❌ Error Submitting:", error);
      toast({ title: "ރެޖިސްޓާ ނުކުރެވުނު", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }

    if (type === "Update" && registration) {
  const updated = await updateMadhahaCompetitionRegistration(
    registration?.$id || "", // Ensure $id is a string
    {
      ...values,
    }
  );

  if (updated) {
    router.push("/");
    toast({
      title: "ބައިވެރިޔާ އަޕްޑޭޓް ކުރެވިއްޖެ",
      variant: "default",
    });
  }
}


  };

  const handleDownloadRules = () => {
    const link = document.createElement("a");
    link.href = "/assets/files/Madhaha_Gavaidhu.pdf";
    link.download = "Madhaha_Gavaidhu.pdf";
    link.click();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-8 bg-white shadow-lg pr-8 pl-8 pb-8 rounded-lg"
          dir="rtl"
        >
          {type === "Create" && (<div className="flex flex-col items-start">
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleDownloadRules}
                className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500  transition-all duration-500 px-6 py-3 rounded-md shadow-md font-dhivehi text-lg"
              >
                މުބާރާތުގެ ޤަވާޢިދު
              </Button>
            </div>
            <p className="font-dhivehi text-lg text-right text-red-500 mt-5">
              ނޯޓް: ކީބޯޑް ދިވެހިބަހަށް ބަދަލު ކުރުމަށްފަހު ލިޔުއްވާ!
            </p>
          </div>)}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Group or Solo */}
            <FormField
              control={form.control}
              name="groupOrSolo"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    ބައިވެރިވުމަށް އެދޭ ގޮތް
                  </p>
                  <FormControl>
                    <ReusableDropdown
                      options={["ވަކިވަކިން", "ގްރޫޕްކޮން"]}
                      placeholder="އެދޭ ގޮތް"
                      value={field.value}
                      onChangeHandler={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />

            {/* Age Group */}
            <FormField
              control={form.control}
              name="ageGroup"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    ބައިވެރިވުމަށް އެދޭ އުމުރުފުރާ
                  </p>
                  <FormControl>
                    <ReusableDropdown
                      // ✅ Filter options if "ގްރޫޕްކޮން" is selected
                      options={
                        form.watch("groupOrSolo") === "ގްރޫޕްކޮން"
                          ? ["18 އަހަރުން ދަށް", "18 އަހަރުން މަތި"]
                          : AGE_GROUPS
                      }
                      placeholder="އުމުރުފުރާ"
                      value={field.value}
                      onChangeHandler={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />

            {/* ✅ Conditionally Show Group Name Input */}
            {form.watch("groupOrSolo") === "ގްރޫޕްކޮން" && (
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <p className="font-dhivehi text-xl text-right text-cyan-950">
                      ގްރޫޕްގެ ނަން
                    </p>
                    <FormControl>
                      <Input
                        placeholder="ގްރޫޕްގެ ނަން"
                        {...field}
                        className="rounded-md font-dhivehi border-gray-300 text-right"
                      />
                    </FormControl>
                    <FormMessage className="font-dhivehi text-md whitespace-nowrap" />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {form.watch("groupOrSolo") === "ގްރޫޕްކޮން"
                      ? "ފުރިހަމަ ނަން (ގްރޫޕް ލީޑަރުގެ)"
                      : "ފުރިހަމަ ނަން"}
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" ފުރިހަމަ ނަން "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right "
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {form.watch("groupOrSolo") === "ގްރޫޕްކޮން"
                      ? "އެޑްރެސް (ގްރޫޕް ލީޑަރުގެ)"
                      : "އެޑްރެސް"}
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" އެޑްރެސް "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right "
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />

            {/* ID Card */}
            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {form.watch("groupOrSolo") === "ގްރޫޕްކޮން"
                      ? "އައިޑީކާޑް ނަންބަރު (ގްރޫޕް ލީޑަރުގެ)"
                      : "އައިޑީކާޑް ނަންބަރު"}
                  </p>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value.startsWith("A")
                          ? field.value
                          : `A${field.value}`
                      }
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        // Remove non-digit characters after "A"
                        const numericPart = inputValue
                          .replace(/^A/, "")
                          .replace(/\D/g, "")
                          .slice(0, 6); // Ensure max 6 digits

                        field.onChange(`A${numericPart}`);
                      }}
                      // onBlur={() => {
                      //   if (field.value) {
                      //     handleCheckExistingParticipant(field.value);
                      //   }
                      // }}
                      placeholder="A123456"
                      className="rounded-md font-dhivehi border-gray-300 text-right font-bold tracking-widest text-cyan-950"
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />

            {/* Contact Number */}
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    {form.watch("groupOrSolo") === "ގްރޫޕްކޮން"
                      ? "ފޯނު ނަންބަރު  (ގްރޫޕް ލީޑަރުގެ)"
                      : "ފޯނު ނަންބަރު"}
                  </p>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value.replace(/\D/g, "").slice(0, 7)} // Ensure only 7 digits
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric values
                        field.onChange(inputValue.slice(0, 7)); // Allow max 7 digits
                      }}
                      placeholder="ފޯނު ނަންބަރު"
                      className="rounded-md font-dhivehi border-gray-300 text-right"
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Madhaha Name */}
            <FormField
              control={form.control}
              name="madhahaName"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    މަދަހައިގެ ނަން (މަޖުބޫރެއްނޫން)
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" މަދަހައިގެ ނަން "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right "
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />

            {/* Madhaha Lyrics */}
            <FormField
              control={form.control}
              name="madhahaLyrics"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    މަދަހައިގެ ލިރިކްސް (މަޖުބޫރެއްނޫން)
                  </p>
                  <FormControl>
                    <Input
                      placeholder=" މަދަހައިގެ ލިރިކްސް "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right "
                    />
                    {/* <Textarea
                      placeholder=" މަދަހައިގެ ލިރިކްސް "
                      {...field}
                      className="rounded-md font-dhivehi border-gray-300  text-right"
                    /> */}
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />
          </div>

          {/* Group Members */}
          {form.watch("groupOrSolo") === "ގްރޫޕްކޮން" && (
            <div>
              {" "}
              <div className="w-full text-right flex flex-col gap-2 sm:gap-4 ">
                <p className=" w-full font-dhivehi text-xl text-cyan-950 leading-relaxed">
                  ގްރޫޕްކޮށް ބައިވެރިވާނަމަ ބައިވެރިންގެ ލިސްޓް ތިރިއަށް އެޑް
                  ކުރައްވާ! ގްރޫޕް ހެދުމުގައި އެއް އުމުރުފުރާއިން ނުވަތަ ތަފާތު
                  އުމުރުފުރާގެ ބައިވެރިން ހިމަނައިގެންވެސް ގްރޫޕް ހެދިދާނެ!
                </p>
                <p className="font-dhivehi text-xl text-cyan-950 leading-relaxed">
                  (ގްރޫޕްގައި ބައިވެރިވެވޭނީ މަދުވެގެން 3 ބައިވެރިން އަދި
                  ގިނަވެގެން 10 ބައިވެރިންނަށް!)
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="groupMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          {(field.value ?? []).map((member, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={member}
                                onChange={(e) => {
                                  const newMembers = [...(field.value || [])];
                                  newMembers[index] = e.target.value;
                                  field.onChange(newMembers);
                                }}
                                placeholder={` ފުރިހަމަ ނަން - ބައިވެރިޔާ ${
                                  index + 2
                                }`}
                                className="rounded-md font-dhivehi border-gray-300 text-right mt-2"
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  const newMembers = (field.value ?? []).filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(newMembers);
                                }}
                                className="bg-slate-300 text-white px-2 py-1 rounded-md text-sm "
                                // disabled={(field.value ?? []).length <= 3}
                              >
                                ❌
                              </Button>
                            </div>
                          ))}
                          {(field.value ?? []).length < 9 && (
                            <Button
                              type="button"
                              onClick={() => {
                                if ((field.value ?? []).length < 9) {
                                  field.onChange([...(field.value || []), ""]);
                                }
                              }}
                              className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500  transition-all duration-500 px-6 py-3 rounded-md shadow-md font-dhivehi mt-5"
                            >
                              + ބައިވެރިން އެޑް ކުރޭ
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      {form.formState.errors.groupMembers &&
                        form.formState.errors.groupMembers.message && (
                          <FormMessage className="font-dhivehi text-md" />
                        )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-6 mt-2">
            {/* Image Upload */}
            <p className="font-dhivehi text-xl text-right text-cyan-950">
              އައިޑީ ކާޑް (ގްރޫޕެއް ކަމުގައިވާ ވާނަމަ، ގްރޫޕް ލީޑަރުގެ)
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
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-start">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500  transition-all duration-500 px-6 py-3 rounded-md shadow-md font-dhivehi text-xl"
            >
              {isSubmitting ? "ސަބްމިޓް ކުރަނީ" : "ސަބްމިޓް"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default MadhahaCompetitionForm;
