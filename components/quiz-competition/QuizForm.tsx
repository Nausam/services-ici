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
  getParticipantDetailsByIdCard,
  getTodaysQuizQuestion,
  submitQuizForm,
} from "@/lib/actions/quizCompetition";
import { QuizQuestion } from "@/types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { quizSchema } from "@/lib/validations";
import { formatTime, getNextMidnightMaldives } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/providers/UserProvider";

const QuizCompetitionForm = () => {
  const { isSuperAdmin } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [countdownToMidnight, setCountdownToMidnight] = useState<number>(0);

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      idCardNumber: "",
      answer: "",
    },
  });

  // Countdown to tonight 12:00 (midnight) Maldives – quiz start time
  useEffect(() => {
    const update = () => {
      const next = getNextMidnightMaldives().getTime();
      const diff = next - Date.now();
      setCountdownToMidnight(diff > 0 ? diff : 0);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

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
      const isCorrect =
        values.answer.trim() === quizData?.correctAnswer?.trim();

      const response = await submitQuizForm({
        fullName: values.fullName,
        contactNumber: values.contactNumber,
        idCardNumber: values.idCardNumber,
        answer: values.answer,
      });

      setIsWrongAnswer(!isCorrect);

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
        setShowSuccess(true);
      }

      setTimeout(() => {
        setShowSuccess(false);
        setIsWrongAnswer(false);
      }, 2500);

      setDetailsFetched(false);
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

  // Countdown to tonight 12:00 (midnight) Maldives – skip for super admin so they can test
  if (countdownToMidnight > 0 && !isSuperAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full min-h-[320px]"
        dir="rtl"
      >
        <p className="font-dhivehi text-6xl md:text-7xl text-cyan-700 mt-12 font-bold tabular-nums">
          {formatTime(countdownToMidnight)}
        </p>
        <h2 className="font-dhivehi text-center md:text-3xl text-xl text-cyan-700 mt-8 px-4">
          ސުވާލު މުބާރާތް ފެށޭނީ މިރޭ 12:00 ގައި
        </h2>
      </div>
    );
  }

  // Timer display when no quiz today but next quiz date exists – skip for super admin (testing)
  if (!quizData?.question && quizData?.nextQuizDate && timeLeft > 0 && !isSuperAdmin) {
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
    <>
      {/* ✅ Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white/90 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
            >
              {/* ✅ Animated Circle with Easter Egg Glow (Red + Green for Wrong) */}
              <motion.div
                className={`w-32 h-32 rounded-full border-4 border-green-500 flex items-center justify-center transition-all duration-300 ${
                  isWrongAnswer
                    ? "shadow-[0_0_3px_rgba(255,102,102,0.4),0_0_6px_rgba(255,85,85,0.2)]"
                    : ""
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* ✅ Animated Tick */}
                {/* <motion.svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="green"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.path d="M5 12l4 4L19 7" />
                </motion.svg> */}
                <motion.div
                  className="text-3xl font-dhivehi text-green-500"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  ޝުކުރިއްޔާ
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-8 bg-white shadow-lg pr-8 pl-8 pb-8 rounded-lg"
          dir="rtl"
        >
          <p className="font-dhivehi text-lg text-right text-red-500">
            ނޯޓް: ކީބޯޑް ދިވެހިބަހަށް ބަދަލު ކުރުމަށްފަހު ލިޔުއްވާ! އެއްވެސް
            ސުވާލެއްގެ ޖަވާބު ސަބްމިޓް ކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެނަމަ
            7481126 އަށް ގުޅުއްވާ!
          </p>

          {/* <p className="font-dhivehi text-5xl text-right text-cyan-950 mt-5">
          މިއަދުގެ ސުވާލު
        </p> */}
          <div className="text-right font-dhivehi md:text-3xl text-2xl text-cyan-900 mt-5">
            {quizData?.questionNumber} - {quizData?.question}
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
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            className="ml-2"
                            value={option}
                            id={`option-${index}`}
                          />
                          <label
                            htmlFor={`option-${index}`}
                            className="font-dhivehi text-xl text-cyan-950 cursor-pointer"
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

          {/* ID Card (right), Full Name, Phone – name and phone grayed out until ID lookup */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* ID Card – rightmost in RTL */}
            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <p className="font-dhivehi text-xl text-right text-cyan-950">
                    އައިޑީކާޑް ނަންބަރު
                  </p>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        {...field}
                        value={
                          field.value.startsWith("A")
                            ? field.value
                            : `A${field.value}`
                        }
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericPart = inputValue
                            .replace(/^A/, "")
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          const newValue = `A${numericPart}`;
                          field.onChange(newValue);
                          if (detailsFetched && newValue !== field.value) {
                            setDetailsFetched(false);
                            form.setValue("fullName", "");
                            form.setValue("contactNumber", "");
                          }
                        }}
                        onBlur={async () => {
                          const value = field.value.trim();
                          const numericPart = value
                            .replace(/^A/, "")
                            .replace(/\D/g, "");
                          if (numericPart.length < 6) return;
                          setLoadingDetails(true);
                          try {
                            const details =
                              await getParticipantDetailsByIdCard(value);
                            if (details) {
                              form.setValue("fullName", details.fullName);
                              form.setValue(
                                "contactNumber",
                                details.contactNumber,
                              );
                            }
                            setDetailsFetched(true);
                          } catch {
                            setDetailsFetched(true);
                          } finally {
                            setLoadingDetails(false);
                          }
                        }}
                        placeholder="A123456"
                        className="rounded-md font-dhivehi border-gray-300 text-right font-bold tracking-widest text-cyan-950"
                        disabled={loadingDetails}
                      />
                      {loadingDetails && (
                        <p className="font-dhivehi text-sm text-cyan-600 text-right">
                          ހޯދަނީ...
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />

            {/* Full Name – grayed until details fetched */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <p
                    className={`font-dhivehi text-xl text-right ${!detailsFetched ? "text-gray-400" : "text-cyan-950"}`}
                  >
                    ފުރިހަމަ ނަން
                  </p>
                  <FormControl>
                    <Input
                      placeholder={
                        !detailsFetched
                          ? "އައިޑީކާޑު ނަންބަރު ލިޔުއްވާ"
                          : " ފުރިހަމަ ނަން "
                      }
                      {...field}
                      disabled={!detailsFetched}
                      className={`rounded-md font-dhivehi border-gray-300 text-right ${!detailsFetched ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                    />
                  </FormControl>
                  <FormMessage className="font-dhivehi text-md" />
                </FormItem>
              )}
            />

            {/* Contact Number – grayed until details fetched */}
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <p
                    className={`font-dhivehi text-xl text-right ${!detailsFetched ? "text-gray-400" : "text-cyan-950"}`}
                  >
                    ފޯނު ނަންބަރު
                  </p>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value.replace(/\D/g, "").slice(0, 7)}
                      onChange={(e) => {
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 7),
                        );
                      }}
                      placeholder={
                        !detailsFetched
                          ? "އައިޑީކާޑު ނަންބަރު ލިޔުއްވާ"
                          : "ފޯނު ނަންބަރު"
                      }
                      disabled={!detailsFetched}
                      className={`rounded-md font-dhivehi border-gray-300 text-right ${!detailsFetched ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
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

export default QuizCompetitionForm;
