"use client";

import { useState, type ElementType, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Check,
  CreditCard,
  FileCheck2,
  FileText,
  Info,
  Loader2,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/waste-management/FileUploader";
import {
  createHomeCardRegistration,
  uploadHomeCardParentApproval,
  uploadHomeCardRegistrationIdCard,
} from "@/lib/actions/home.actions";
import { homeCardRegistrationSchema } from "@/lib/validations";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type HomeCardRegistrationFormProps = {
  homeCardId: string;
};

type HomeCardRegistrationFormValues = z.infer<
  typeof homeCardRegistrationSchema
>;

const defaultValues: Partial<HomeCardRegistrationFormValues> = {
  fullName: "",
  age: undefined,
  idCardNumber: "",
  contactNumber: "",
  idCard: "",
  parentApprovalLetter: "",
};

const inputClass =
  "h-[60px] rounded-2xl border-slate-200 bg-white px-4 text-[17px] text-slate-950 shadow-none transition-all placeholder:text-slate-400 hover:border-teal-300 focus-visible:border-teal-600 focus-visible:ring-4 focus-visible:ring-teal-600/10";

function SectionHeading({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: ElementType;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-geist text-xs font-bold tracking-[0.2em] text-amber-600">
            {number}
          </span>
          <span className="h-px w-7 bg-amber-300" />
        </div>
        <h3 className="font-dhivehi text-2xl font-normal leading-[1.7] text-slate-950 md:text-[28px]">
          {title}
        </h3>
        <p className="mt-1 font-dhivehi text-sm leading-7 text-slate-500 md:text-[15px]">
          {description}
        </p>
      </div>
    </div>
  );
}

function FieldLabel({
  icon: Icon,
  children,
  hint,
}: {
  icon: ElementType;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <Icon className="size-4 text-teal-600" />
      <FormLabel className="font-dhivehi text-base font-normal leading-7 text-slate-800">
        {children}
      </FormLabel>
      {hint && (
        <span className="mr-auto rounded-full bg-slate-100 px-2 py-0.5 font-dhivehi text-[11px] text-slate-500">
          {hint}
        </span>
      )}
    </div>
  );
}

function FieldError() {
  return (
    <div className="min-h-5 pt-1">
      <FormMessage className="font-dhivehi text-right text-sm leading-6" />
    </div>
  );
}

function ProgressItem({
  number,
  label,
  complete,
}: {
  number: string;
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-colors",
          complete
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-slate-200 bg-white text-slate-500",
        )}
      >
        {complete ? <Check className="size-4" /> : number}
      </div>
      <span
        className={cn(
          "truncate font-dhivehi text-sm",
          complete ? "text-teal-800" : "text-slate-500",
        )}
      >
        {label}
      </span>
    </div>
  );
}

const HomeCardRegistrationForm = ({
  homeCardId,
}: HomeCardRegistrationFormProps) => {
  const router = useRouter();
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [parentApprovalFile, setParentApprovalFile] = useState<File | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HomeCardRegistrationFormValues>({
    resolver: zodResolver(homeCardRegistrationSchema),
    defaultValues,
    mode: "onTouched",
  });

  const [fullName, selectedAge, idCardNumber, contactNumber] = useWatch({
    control: form.control,
    name: ["fullName", "age", "idCardNumber", "contactNumber"],
  });

  const detailsComplete = Boolean(
    fullName?.trim() &&
      selectedAge &&
      idCardNumber?.trim() &&
      contactNumber?.trim().length >= 7,
  );
  const documentsComplete = Boolean(
    idCardFile && (selectedAge !== "below18" || parentApprovalFile),
  );

  const handleSubmit = async (values: HomeCardRegistrationFormValues) => {
    if (!idCardFile) {
      form.setError("idCard", {
        type: "manual",
        message: "އައިޑީކާޑުގެ ކޮޕީ އަޕްލޯޑް ކުރައްވާ!",
      });
      return;
    }

    if (values.age === "below18" && !parentApprovalFile) {
      form.setError("parentApprovalLetter", {
        type: "manual",
        message:
          "18 އަހަރު ނުފުރޭނަމަ ބެލެނިވެރިޔާގެ ސިޓީ ހުށަހަޅާ!",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const idCard = await uploadHomeCardRegistrationIdCard(idCardFile);
      const parentApprovalLetter =
        values.age === "below18" && parentApprovalFile
          ? await uploadHomeCardParentApproval(parentApprovalFile)
          : "";

      const newRegistration = await createHomeCardRegistration({
        homeCardId,
        ...values,
        idCard,
        parentApprovalLetter,
      });

      if (newRegistration) {
        form.reset(defaultValues);
        setIdCardFile(null);
        setParentApprovalFile(null);
        router.push("/");
        toast({
          title: values.fullName + " ރެޖިސްޓާ ކުރެވިއްޖެ",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to submit home-card registration:", error);
      toast({
        title: "ރެޖިސްޓޭޝަން ނުކުރެވުނު",
        description: "ފޯމު އަލުން ބަލައިގެން ފަހަރެއް ކުރައްވާ!",
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
        className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_28px_80px_-36px_rgba(15,23,42,0.32)] md:rounded-[36px]"
        dir="rtl"
      >
        <header className="relative overflow-hidden bg-[#073d44] px-5 py-8 text-white sm:px-8 md:px-10 md:py-10">
          <div className="absolute -left-20 -top-24 size-64 rounded-full border-[44px] border-white/[0.04]" />
          <div className="absolute -bottom-24 right-1/3 size-52 rounded-full bg-teal-300/10 blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-dhivehi text-3xl font-normal leading-[1.7] sm:text-4xl">
                ރެޖިސްޓާ ކުރުން
              </h2>
            </div>

            <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 backdrop-blur-sm lg:w-[390px]">
              <ProgressItem number="01" label="މަޢުލޫމާތު" complete={detailsComplete} />
              <div className="h-px w-5 shrink-0 bg-white/20" />
              <ProgressItem number="02" label="ލިޔެކިޔުން" complete={documentsComplete} />
            </div>
          </div>
        </header>

        <div className="space-y-6 bg-[#f5f8f7] p-4 sm:p-6 md:p-8">
          <section className="space-y-7 rounded-[24px] border border-slate-200/80 bg-white p-5 sm:p-7 md:p-8">
            <SectionHeading
              number="01"
              title="ބައިވެރިޔާގެ މަޢުލޫމާތު"
              description="އައިޑީ ކާޑާ އެއްގޮތަށް ނަމާއި އެހެނިހެން މަޢުލޫމާތު ލިޔުއްވާ."
              icon={UserRound}
            />

            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FieldLabel icon={UserRound}>ފުރިހަމަ ނަން</FieldLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="name"
                        placeholder="ފުރިހަމަ ނަން ލިޔުއްވާ"
                        className={inputClass}
                      />
                    </FormControl>
                    <FieldError />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FieldLabel icon={UsersRound}>އުމުރު</FieldLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                        {[
                          { value: "above18", label: "18 އަހަރުން މަތި" },
                          { value: "below18", label: "18 އަހަރުން ދަށް" },
                        ].map((option) => {
                          const selected = field.value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                field.onChange(option.value);
                                if (option.value !== "below18") {
                                  form.setValue("parentApprovalLetter", "");
                                  setParentApprovalFile(null);
                                }
                              }}
                              className={cn(
                                "flex h-[47px] items-center justify-center rounded-xl px-2 font-dhivehi text-sm transition-all sm:text-base",
                                selected
                                  ? "bg-[#073d44] text-white shadow-md"
                                  : "text-slate-600 hover:bg-white hover:text-slate-950",
                              )}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FieldError />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idCardNumber"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FieldLabel icon={CreditCard}>އައިޑީ ކާޑް ނަންބަރު</FieldLabel>
                    <FormControl>
                      <Input
                        {...field}
                        allowAllLanguages
                        autoComplete="off"
                        dir="ltr"
                        placeholder="A123456"
                        className={`${inputClass} text-left font-geist font-semibold tracking-[0.14em]`}
                      />
                    </FormControl>
                    <FieldError />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FieldLabel icon={Phone}>ފޯނު ނަންބަރު</FieldLabel>
                    <FormControl>
                      <Input
                        {...field}
                        allowAllLanguages
                        autoComplete="tel"
                        dir="ltr"
                        inputMode="tel"
                        placeholder="7XXXXXX"
                        className={`${inputClass} text-left font-geist tracking-[0.1em]`}
                      />
                    </FormControl>
                    <FieldError />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-7 rounded-[24px] border border-slate-200/80 bg-white p-5 sm:p-7 md:p-8">
            <SectionHeading
              number="02"
              title="ބޭނުންވާ ލިޔެކިޔުން"
              description="ފޮޓޯ ނުވަތަ ޕީޑީއެފް ގޮތުގައި ސާފު ކޮޕީއެއް ހުށަހަޅައްވާ."
              icon={FileCheck2}
            />

            <div
              className={cn(
                "grid gap-5",
                selectedAge === "below18" && "lg:grid-cols-2",
              )}
            >
              <FormField
                control={form.control}
                name="idCard"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        <CreditCard className="size-5" />
                      </div>
                      <div className="text-right">
                        <FormLabel className="font-dhivehi text-lg font-normal leading-8 text-slate-900">
                          އައިޑީ ކާޑުގެ ކޮޕީ
                        </FormLabel>
                        <p className="font-dhivehi text-xs leading-6 text-slate-400">
                          ކާޑުގެ ދެ ފުށް ސާފުކޮށް ފެންނަ ކޮޕީއެއް
                        </p>
                      </div>
                      <span className="mr-auto rounded-full bg-red-50 px-2.5 py-1 font-dhivehi text-xs text-red-600">
                        މަޖުބޫރު
                      </span>
                    </div>
                    <FormControl>
                      <FileUploader
                        variant="registration"
                        onFieldChange={field.onChange}
                        imageUrl={field.value}
                        setFile={setIdCardFile}
                      />
                    </FormControl>
                    <FieldError />
                  </FormItem>
                )}
              />

              {selectedAge === "below18" && (
                <FormField
                  control={form.control}
                  name="parentApprovalLetter"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="mb-4 flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                          <FileText className="size-5" />
                        </div>
                        <div className="text-right">
                          <FormLabel className="font-dhivehi text-lg font-normal leading-8 text-slate-900">
                            ބެލެނިވެރިޔާގެ ސިޓީ
                          </FormLabel>
                          <p className="font-dhivehi text-xs leading-6 text-slate-400">
                            18 އަހަރު ނުފުރޭ ބައިވެރިންނަށް
                          </p>
                        </div>
                        <span className="mr-auto rounded-full bg-amber-50 px-2.5 py-1 font-dhivehi text-xs text-amber-700">
                          މަޖުބޫރު
                        </span>
                      </div>
                      <FormControl>
                        <FileUploader
                          variant="registration"
                          onFieldChange={field.onChange}
                          imageUrl={field.value}
                          setFile={setParentApprovalFile}
                        />
                      </FormControl>
                      <FieldError />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5 text-blue-950">
              <Info className="mt-1 size-4 shrink-0 text-blue-600" />
              <p className="font-dhivehi text-sm leading-7">
                އަޕްލޯޑް ކުރެވޭނީ JPG، PNG، SVG އަދި PDF ފައިލް. ފައިލް ސައިޒު 10MB އަށްވުރެ ބޮޑު ނުވާނެ.
              </p>
            </div>
          </section>
        </div>

        <footer className="flex flex-col gap-5 border-t border-slate-200 bg-white px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-8">
          <div className="flex max-w-xl items-start gap-3 text-slate-500">
            <ShieldCheck className="mt-1 size-5 shrink-0 text-teal-600" />
            <div>
              <p className="font-dhivehi text-sm leading-7">
                ހުށަހަޅާ މަޢުލޫމާތު ރަނގަޅުތޯ ބަލައި، ސައްހަ މަޢުލޫމާތު ކަމަށް ޔަގީން ކުރައްވާ.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="group h-14 w-full rounded-2xl bg-[#073d44] px-8 font-dhivehi text-lg leading-relaxed text-white shadow-[0_14px_30px_-12px_rgba(7,61,68,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#052f35] md:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                ރެޖިސްޓާ ކުރަނީ...
              </>
            ) : (
              <>
                ރެޖިސްޓާ ކުރައްވާ
                <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
              </>
            )}
          </Button>
        </footer>
      </form>
    </Form>
  );
};

export default HomeCardRegistrationForm;
