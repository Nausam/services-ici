import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type PermissionRequestCardProps = {
  id: string;
  fullName: string;
  permissionType: string;
  startDate: string;
  endDate: string;
};

const PermissionRequestCard = ({
  id,
  fullName,
  permissionType,
  startDate,
  endDate,
}: PermissionRequestCardProps) => {
  return (
    <div className="flex items-center justify-between border border-slate-200 hover:border-cyan-700/50 rounded-xl p-5 bg-gradient-to-br from-cyan-50 to-cayn-100 shadow-md hover:shadow-lg transition-all transform  duration-300 ease-in-out">
      <h2 className="font-dhivehi text-2xl text-cyan-800 font-bold mb-2">
        {permissionType}
      </h2>

      <div className="flex gap-2">
        <Link href={`/permissions/${id}`}>
          <Button className="w-full bg-gradient-to-br from-cyan-500 to-cyan-700 text-white hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500 rounded-md shadow-md transition-colors duration-300 font-dhivehi">
            އިތުރު ތަފްސީލު
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PermissionRequestCard;
