"use client";

import React, { useEffect, useState } from "react";

interface ShufflePickerProps {
  participants: { name: string; idCardNumber: string }[];
  onWinnersSelected: (
    winners: { name: string; idCardNumber: string }[]
  ) => void;
}

const ShufflePicker: React.FC<ShufflePickerProps> = ({
  participants,
  onWinnersSelected,
}) => {
  const [currentParticipant, setCurrentParticipant] = useState<{
    name: string;
    idCardNumber: string;
  } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winners, setWinners] = useState<
    { name: string; idCardNumber: string }[]
  >([]);
  const [availableParticipants, setAvailableParticipants] = useState<
    { name: string; idCardNumber: string }[]
  >([]);

  // ✅ Initialize available participants on first render
  useEffect(() => {
    if (participants.length > 0) {
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      setAvailableParticipants(shuffled);
    }
  }, [participants]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (spinning) {
      interval = setInterval(() => {
        setCurrentParticipant(
          availableParticipants[
            Math.floor(Math.random() * availableParticipants.length)
          ]
        );
      }, 50);
    } else if (interval !== null) {
      clearInterval(interval);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [spinning, availableParticipants]);

  const handleShuffle = () => {
    if (spinning || availableParticipants.length === 0 || winners.length >= 3)
      return;

    setSpinning(true);

    // ✅ Create a local copy to avoid async state issues
    let localParticipants = [...availableParticipants];

    // ✅ Shuffle for 2.5 seconds, then stop
    setTimeout(() => {
      setSpinning(false);

      if (localParticipants.length === 0) return;

      // ✅ Pick a random winner
      const winnerIndex = Math.floor(Math.random() * localParticipants.length);
      const winner = localParticipants[winnerIndex];

      // ✅ Immediately update the list **before** setting state
      localParticipants.splice(winnerIndex, 1); // Remove winner directly from the list

      // ✅ Sync display + state to avoid async issues
      setCurrentParticipant(winner);
      setAvailableParticipants(localParticipants);
      setWinners((prev) => [...prev, winner]);

      // ✅ Trigger callback to parent
      onWinnersSelected([...winners, winner]);
    }, 2500);
  };

  const getPositionText = (index: number) => {
    if (index === 0) return "🥉 3 ވަނަ";
    if (index === 1) return "🥈 2 ވަނަ";
    if (index === 2) return "🥇 1 ވަނަ";
    return "";
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-8">
      {/* Shuffling Display */}
      <div className="relative w-[600px] h-[120px] border-8 border-cyan-500 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
        {currentParticipant ? (
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-4xl font-extrabold transition-all duration-75 ease-in-out"
            key={currentParticipant.idCardNumber}
          >
            {/* ✅ Display Name + ID */}({currentParticipant.idCardNumber}){" "}
            {currentParticipant.name}
          </div>
        ) : (
          <div className="text-white text-4xl font-extrabold flex items-center justify-center h-full">
            No Participants
          </div>
        )}
      </div>

      {/* Shuffle Button */}
      <button
        onClick={handleShuffle}
        disabled={spinning || winners.length >= 3}
        className={`mt-4 px-10 py-5 text-3xl bg-cyan-500 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 ${
          spinning || winners.length >= 3
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-cyan-600"
        }`}
      >
        {spinning
          ? "ވަނަ ނަގަނީ..."
          : winners.length < 3
          ? "ފައްޓާ!"
          : "ހުރިހާ ވަނައެއް ނެގިއްޖެ!"}
      </button>

      {/* Display Winners */}
      <div className="mt-6 space-y-6">
        {winners.map((winner, index) => (
          <div
            key={winner.idCardNumber}
            className="flex justify-center items-center gap-6 bg-white text-cyan-900 px-8 py-4 rounded-full shadow-md text-3xl border border-gray-300"
          >
            <span className="font-bold">{getPositionText(index)}:</span>
            <span className="font-semibold">
              {winner.name} ({winner.idCardNumber})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShufflePicker;
