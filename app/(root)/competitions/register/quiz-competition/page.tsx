import QuizCompetitionForm from "@/components/quiz-competition/QuizForm";
import QuranRegistrationForm from "@/components/quran-competition/QuranRegistrationForm";
import React from "react";

const QuizCompetitionPage = () => {
  return (
    <section className="max-w-7xl mx-auto h-screen">
      <div
        className="relative flex justify-center items-center bg-cover bg-center h-40 md:h-60 lg:h-72"
        style={{
          backgroundImage: "url('/assets/images/quran_banner.png')",
        }}
      >
        {/* <h1 className="relative z-10 text-cyan-900 lg:text-6xl md:text-5xl text-4xl font-dhivehi text-center backdrop-blur-[5px] p-4 rounded-md shadow-md">
          އިންނަމާދޫ ކައުންސިލްގެ 08 ވަނަ ޤުރުއާން މުބާރާތް
        </h1> */}
      </div>
      <div className="my-10">
        <QuizCompetitionForm />
      </div>
    </section>
  );
};

export default QuizCompetitionPage;
