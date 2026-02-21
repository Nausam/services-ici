import React from "react";
import QuizCompetitionForm from "@/components/quiz-competition/QuizForm";
import Image from "next/image";

const QuizCompetitionPage = () => {
  return (
    <section className="max-w-7xl mx-auto min-h-screen w-full min-w-0 overflow-x-hidden px-4 sm:px-6 box-border">
      <div className="relative w-full aspect-[3/1] min-h-[10rem] max-h-72 overflow-hidden rounded-lg bg-slate-100">
        <Image
          src="/assets/images/quiz_banner.png"
          alt="Quiz Competition Banner"
          fill
          className="object-contain object-center sm:object-cover"
          quality={100}
          priority
          sizes="(max-width: 640px) 100vw, 1280px"
        />
      </div>
      <div className="my-6 sm:my-10 w-full min-w-0 overflow-x-hidden">
        <QuizCompetitionForm />
      </div>
    </section>
  );
};

export default QuizCompetitionPage;
