"use client";

import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { AnimatedGroup } from "./ui/animated-group";
import { getAllCardsByCategory } from "@/lib/actions/home.actions";
import ServiceCardLoader from "./ServiceCardLoader";
import { useUser } from "@/providers/UserProvider";

const Competitions = () => {
  const [competitionCards, setCompetitionCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAdmin } = useUser();

  const fetchCompetitionCards = async () => {
    try {
      setLoading(true);
      const { documents } = await getAllCardsByCategory("މުބާރާތް", 10, 0);

      // Sort cards by creation date (latest first)
      const sortedCards = documents
        .filter((card: any) => isAdmin || !card.hidden) // Show hidden cards only to admins
        .sort(
          (a: any, b: any) =>
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        );

      setCompetitionCards(sortedCards);
    } catch (error) {
      console.error("Error fetching competition cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cards on component mount
  useEffect(() => {
    fetchCompetitionCards();
  }, []);

  // Callback to refresh cards when visibility changes
  const handleVisibilityToggle = () => {
    fetchCompetitionCards(); // Re-fetch cards
  };

  return (
    <section className="mt-20 relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 mb-10">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-dhivehi text-cyan-900 text-center">
          މުބާރާތްތައް
        </h3>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ServiceCardLoader key={index} />
            ))
          : competitionCards.map((card: any) => (
              <ServiceCard
                key={card.$id}
                id={card.$id}
                title={card.title}
                description={card.description}
                link={card.link}
                buttonText={card.buttonText}
                dueDate={card.dueDate}
                image={card.image}
                imageId={card.imageId}
                hidden={card.hidden}
                isAdmin={isAdmin}
                onVisibilityToggle={handleVisibilityToggle}
                onDelete={fetchCompetitionCards}
              />
            ))}
      </div>
    </section>
  );
};

export default Competitions;
