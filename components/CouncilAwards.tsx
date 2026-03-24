"use client";

import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { getAllCardsByCategory } from "@/lib/actions/home.actions";
import ServiceCardLoader from "./ServiceCardLoader";
import { useUser } from "@/providers/UserProvider";
import PlaceholderCard from "./PlaceholderCard";

const CouncilAwards = () => {
  const [awardCards, setAwardCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAdmin, isSuperAdmin } = useUser();

  const fetchAwardCards = async () => {
    try {
      setLoading(true);
      const { documents } = await getAllCardsByCategory(
        "ކައުންސިލް އެވޯރޑް",
        10,
        0
      );

      const sortedCards = documents
        .filter((card: any) => isAdmin || !card.hidden)
        .sort(
          (a: any, b: any) =>
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        );

      setAwardCards(sortedCards);
    } catch (error) {
      console.error("Error fetching council award cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwardCards();
  }, []);

  const handleVisibilityToggle = () => {
    fetchAwardCards();
  };

  return (
    <section className="mt-20 relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 mb-10">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-dhivehi text-cyan-900 text-center">
          ކައުންސިލް އެވޯރޑް
        </h3>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <ServiceCardLoader key={index} />
          ))
        ) : awardCards.length === 0 ? (
          <PlaceholderCard title="މިވަގުތު ކައުންސިލް އެވޯރޑް ކާޑެއް ހުޅުވާލާފައެއް ނުވޭ!" />
        ) : (
          awardCards.map((card: any) => (
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
              isSuperAdmin={isSuperAdmin}
              onVisibilityToggle={handleVisibilityToggle}
              onDelete={fetchAwardCards}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CouncilAwards;
