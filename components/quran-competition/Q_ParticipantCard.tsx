"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RegistrationCardProps = {
  fullName: string;
  idCardNumber: string;
  contactNumber: string;
  href: string;
  idCardUrl?: string;
};

const Q_ParticipantCard = ({
  fullName,
  idCardNumber,
  contactNumber,
  href,
  idCardUrl,
}: RegistrationCardProps) => {
  const handleDownloadIDCard = () => {
    if (!idCardUrl) {
      alert("No ID Card available for download");
      return;
    }

    const link = document.createElement("a");
    link.href = idCardUrl;
    link.download = `${fullName}_IDCard`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-between border rounded-xl p-5 shadow-lg bg-white hover:shadow-xl transition-all transform  duration-300 ease-in-out">
      <h2 className="font-dhivehi text-2xl text-cyan-800 font-bold mb-2">
        {fullName}
      </h2>

      <div className="flex gap-2">
        {idCardUrl && (
          <Button
            onClick={handleDownloadIDCard}
            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-md shadow-md transition-colors duration-300 font-dhivehi"
          >
            އައިޑީ
          </Button>
        )}
        <Link href={href}>
          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-md shadow-md transition-colors duration-300 font-dhivehi">
            އިތުރު ތަފްސީލު
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Q_ParticipantCard;
