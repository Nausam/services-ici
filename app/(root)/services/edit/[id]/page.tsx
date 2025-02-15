"use client";

import HomeCardForm from "@/components/admin/home-cards/HomeCardForm";
import { getHomeCompetitionsCardById } from "@/lib/actions/home.actions";
import { HomeCard } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const { id } = useParams();
  const [homeCard, setHomeCard] = useState<HomeCard | null>(null);

  useEffect(() => {
    if (id) {
      getHomeCompetitionsCardById(id as string).then(setHomeCard);
    }
  }, [id]);

  if (!homeCard) {
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-20 container mx-auto h-screen">
      <div className="flex justify-center items-center font-dhivehi md:text-6xl text-3xl">
        <h2>{homeCard.title}</h2>
      </div>
      <HomeCardForm type="Update" HomeCard={homeCard} />
    </section>
  );
};

export default page;
