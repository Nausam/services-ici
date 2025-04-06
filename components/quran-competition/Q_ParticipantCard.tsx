"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUser } from "@/providers/UserProvider";

type RegistrationCardProps = {
  fullName: string;
  idCardNumber: string;
  contactNumber: string;
  href: string;
  idCardUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const Q_ParticipantCard = ({
  fullName,
  idCardNumber,
  contactNumber,
  href,
  idCardUrl,
  onEdit,
  onDelete,
}: RegistrationCardProps) => {
  const { isSuperAdmin } = useUser();

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
    <div className="flex items-center justify-between border border-slate-200 hover:border-cyan-700/50 rounded-xl p-5 bg-cyan-50/60 shadow-md hover:shadow-lg transition-all transform duration-300 ease-in-out flex-row">
      {/* Full Name on the Right */}
      <div className="font-dhivehi text-2xl text-cyan-800 font-bold mb-2">
        {fullName}
      </div>

      {/* Buttons on the Left */}
      <div className="flex items-center justify-start gap-2">
        {idCardUrl && (
          <Button
            size="icon"
            onClick={handleDownloadIDCard}
            className="bg-gradient-to-br from-cyan-500 to-cyan-700 hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500 border border-white shadow-md"
          >
            <Image
              src="/assets/icons/id.png"
              alt="Download ID Card"
              width={20}
              height={20}
              className="invert"
            />
          </Button>
        )}

        <Link href={href}>
          <Button
            size="icon"
            className="bg-gradient-to-br from-cyan-500 to-cyan-700 hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500 border border-white shadow-md"
          >
            <Image
              src="/assets/icons/info.png"
              alt="More Info"
              width={20}
              height={20}
              className="invert"
            />
          </Button>
        </Link>

        {isSuperAdmin && (
          <>
            {onEdit && (
              <Button
                size="icon"
                onClick={onEdit}
                className="bg-gradient-to-br from-cyan-500 to-cyan-700 hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500 border border-white shadow-md"
              >
                <Image
                  src="/assets/icons/update.png"
                  alt="Edit"
                  width={20}
                  height={20}
                  className="invert"
                />
              </Button>
            )}

            {onDelete && (
              <Button
                size="icon"
                onClick={onDelete}
                className="bg-gradient-to-br from-cyan-500 to-cyan-700 hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500 border border-white shadow-md"
              >
                <Image
                  src="/assets/icons/delete.png"
                  alt="Delete"
                  width={20}
                  height={20}
                  className="invert"
                />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Q_ParticipantCard;
