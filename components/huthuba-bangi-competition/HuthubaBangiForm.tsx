"use client";

import React, { useEffect, useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { FileUploader } from "../waste-management/FileUploader";
import ReusableDropdown from "../reusable/ReusableDropdown";
import { useRouter } from "next/navigation";

import {
  createHuthubaBangiCompetitionRegistration,
  getHuthubaBangiParticipantByIdCard,
  updateHuthubaBangiCompetitionRegistration,
  uploadImage,
} from "@/lib/actions/huthubaBangi.actions";
import { huthubaBangiSchema } from "@/lib/validations";
import { AGE_GROUPS_BANGI } from "@/constants";

type HuthubaBangiFormProps = {
  type: "Create" | "Update";
  registration?: z.infer<typeof huthubaBangiSchema>;
};

const HuthubaBangiForm = ({ type, registration }: HuthubaBangiFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filteredAgeGroups, setFilteredAgeGroups] = useState(AGE_GROUPS_BANGI);

  const router = useRouter();

  // ✅ Initialize form using `zodResolver`
  const form = useForm<z.infer<typeof huthubaBangiSchema>>({
    resolver: zodResolver(huthubaBangiSchema),
    defaultValues: {
      fullName: registration?.fullName || "",
      address: registration?.address || "",
      idCardNumber: registration?.idCardNumber || "",
      contactNumber: registration?.contactNumber || "",
      competitionType: registration?.competitionType || "ޙުތުބާ",
      idCard: registration?.idCard || "",
      ageGroup: registration?.ageGroup || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const selectedType = form.watch("competitionType");

    if (selectedType === "ޙުތުބާ" || selectedType === "ދެބައި") {
      setFilteredAgeGroups(
        AGE_GROUPS_BANGI.filter((age) => age !== "6 އަހަރުން ދަށް")
      );
    } else {
      setFilteredAgeGroups(AGE_GROUPS_BANGI);
    }
  }, [form.watch("competitionType")]);

  // Form Submission
  const handleSubmit = async (values: z.infer<typeof huthubaBangiSchema>) => {
    setIsSubmitting(true);

    try {
      let idCard = values.idCard;

      // ✅ Check if existing participant has ID card
      const existingParticipant = await getHuthubaBangiParticipantByIdCard(
        values.idCardNumber
      );

      if (existingParticipant && existingParticipant.idCard) {
        idCard = existingParticipant.idCard;
      } else if (file) {
        idCard = await uploadImage(file);
      }

      // Create existing registration
      if (type === "Create") {
        const newRegistration = await createHuthubaBangiCompetitionRegistration(
          {
            ...values,
            competitionType:
              values.competitionType === "ޙުތުބާ"
                ? "ޙުތުބާ"
                : values.competitionType === "ބަންގި"
                ? "ބަންގި"
                : "ދެބައި",
            idCard,
          }
        );

        if (newRegistration) {
          form.reset();
          router.push("/");
          toast({
            title: `އިންނަމާދޫ ކައުންސިލްގެ 1 ވަނަ ޙުތުބާ އަދި ބަންގި ގޮވުމުގެ މުބާރާތުގައި ${newRegistration.fullName} ރެޖިސްޓާ ކުރެވިއްޖެ`,
            variant: "default",
          });
        }
      }

      // Update existing registration
      if (type === "Update" && registration) {
        const updatedRegistration =
          await updateHuthubaBangiCompetitionRegistration(
            registration.idCardNumber,
            {
              ...values,
              competitionType:
                values.competitionType === "ޙުތުބާ"
                  ? "ޙުތުބާ"
                  : values.competitionType === "ބަންގި"
                  ? "ބަންގި"
                  : "ދެބައި",
              idCard,
            }
          );

        if (updatedRegistration) {
          form.reset();
          router.push("/admin");
          toast({
            title: `${updatedRegistration.fullName} އަޕްޑޭޓް ކުރެވިއްޖެ`,
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("❌ Error Submitting:", error);
      toast({
        title: "ރެޖިސްޓާ ނުކުރެވުނު",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadRules = () => {
    const link = document.createElement("a");
    link.href = "/assets/files/Bangi_And_Huthubaa_Gavaidhu.pdf";
    link.download = "Bangi_And_Huthubaa_Gavaidhu.pdf";
    link.click();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8 bg-white shadow-lg pr-8 pl-8 pb-8 rounded-lg"
        dir="rtl"
      >
        {type === "Create" && (
          <div className="flex flex-col items-start">
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
              ނޯޓް: ކީބޯޑް ދިވެހިބަހަށް ބަދަލު ކުރުމަށްފަހު ލިޔުއްވާ! މި
              މުބާރާތުގައި ބައިވެރިވެވޭނީ ހަމައެކަނި ފިރިހެން ކުދިންނަށާއި
              ބޮޑެތި ފިރިހެން ބޭފުޅުންނަށެވެ.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          <FormField
            control={form.control}
            name="competitionType"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  ބައިވެރިވުމަށް އެދޭ މުބާރާތް
                </p>
                <FormControl>
                  <ReusableDropdown
                    options={["ޙުތުބާ", "ބަންގި", "ދެބައި"]}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />

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
                    options={filteredAgeGroups}
                    placeholder="އުމުރުފުރާ"
                    value={field.value}
                    onChangeHandler={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  ފުރިހަމަ ނަން
                </p>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ފުރިހަމަ ނަން"
                    className="rounded-md font-dhivehi border-gray-300 text-right"
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
                  އެޑްރެސް
                </p>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="އެޑްރެސް"
                    className="rounded-md font-dhivehi border-gray-300 text-right"
                  />
                </FormControl>
                <FormMessage className="font-dhivehi text-md" />
              </FormItem>
            )}
          />

          {/* ID Card Number */}
          <FormField
            control={form.control}
            name="idCardNumber"
            render={({ field }) => (
              <FormItem>
                <p className="font-dhivehi text-xl text-right text-cyan-950">
                  އައިޑީ ކާޑް ނަންބަރު
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
                  ފޯނު ނަންބަރު
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

        <div className="flex flex-col gap-6 mt-2">
          {/* Image Upload */}
          <p className="font-dhivehi text-xl text-right text-cyan-950">
            އައިޑީ ކާޑް
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
  );
};

export default HuthubaBangiForm;
