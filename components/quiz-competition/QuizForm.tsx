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
import {
  getTodaysQuizQuestion,
  submitQuizForm,
} from "@/lib/actions/quizCompetition";
import { QuizQuestion } from "@/types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { quizSchema } from "@/lib/validations";
import { formatTime } from "@/constants";

const QuizCompetitionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      idCardNumber: "",
      answer: "",
    },
  });

  // Fetch today's quiz question and set a timer if necessary
  useEffect(() => {
    const fetchQuizQuestion = async () => {
      setIsLoading(true);
      const data = await getTodaysQuizQuestion();

      console.log("📢 Quiz Data Fetched:", data); // ✅ Debugging

      if (data?.nextQuizDate) {
        const nextQuizTime = new Date(data.nextQuizDate).getTime();
        const now = Date.now();
        const maldivesNow = now + 5 * 60 * 60 * 1000;
        const diff = nextQuizTime - maldivesNow;

        if (diff > 0) {
          setTimeLeft(diff);
        }
      }

      setQuizData(data);
      setIsLoading(false);
    };

    fetchQuizQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleSubmit = async (values: z.infer<typeof quizSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await submitQuizForm({
        fullName: values.fullName,
        contactNumber: values.contactNumber,
        idCardNumber: values.idCardNumber,
        answer: values.answer,
      });

      if (
        response.message ===
        "A submission already exists for today's quiz with matching details. Please try again tomorrow."
      ) {
        toast({
          title:
            "ކޮންމެ ބޭފުޅަކަށްވެސް އެދުވަހެއްގެ ސުވާލުގެ ޖަވާބު ހުށަހެޅޭނީ އެންމެ ފަހަރަކު ",
          variant: "destructive",
        });
      } else {
        toast({
          title: `${values.fullName} މިއަދުގެ ސުވާލަށް ދެއްވި ޖަވާބު ސަބްމިޓް ކުރެވިއްޖެ `,
          variant: "default",
        });
      }

      form.reset();
    } catch (error) {
      console.error("Error submitting the form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center h-full items-center mx-auto">
        <div className="flex flex-col items-center justify-center mx-auto gap-4">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );

  // Timer display
  if (!quizData?.question && quizData?.nextQuizDate && timeLeft > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="font-dhivehi text-7xl text-cyan-700 mt-20">
          {formatTime(timeLeft)}
        </p>
        <h2 className="font-dhivehi text-center md:text-3xl text-xl text-cyan-700 mt-10">
          ކޮންމެ ދުވަހެއްގެ ސުވާލުވެސް އެދުވަހެއްގެ 00:00 ގައި ޕަބްލިޝް ކުރެވޭނެ
        </h2>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8 bg-white shadow-lg p-8 rounded-lg"
        dir="rtl"
      >
        <p className="font-dhivehi text-xl text-right text-red-500">
          ނޯޓް: ކީބޯޑް ދިވެހިބަހަށް ބަދަލު ކުރުމަށްފަހު ލިޔުއްވާ! އަދި އެއްވެސް
          ސުވާލެއްގެ ޖަވާބު ސަބްމިޓް ކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެނަމަ
          7481126 އަށް ގުޅުއްވާ!
        </p>
        <p className="font-dhivehi text-5xl text-right text-cyan-900 mt-5">
          މިއަދުގެ ސުވާލު
        </p>
        <div className="text-right font-dhivehi text-2xl text-cyan-900 mt-5">
          {quizData?.question}
        </div>

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-4"
                    dir="rtl"
                  >
                    {quizData?.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          className="ml-2"
                          value={option}
                          id={`option-${index}`}
                        />
                        <label
                          htmlFor={`option-${index}`}
                          className="font-dhivehi text-xl text-cyan-800 cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
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
                    placeholder=" ފުރިހަމަ ނަން "
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
                    className="rounded-md font-dhivehi border-gray-300  text-right"
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

export default QuizCompetitionForm;
