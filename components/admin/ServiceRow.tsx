import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

const ServiceRow = ({ service }: { service: any }) => {
  const handleApprove = () => {
    alert(`Approved request: ${service.title}`);
  };

  const handleReject = () => {
    alert(`Rejected request: ${service.title}`);
  };

  return (
    <TableRow>
      <TableCell className="font-dhivehi text-slate-500 text-lg">
        {service.fullName}
      </TableCell>
      <TableCell className="font-dhivehi text-slate-500 text-lg">
        {service.address}
      </TableCell>
      <TableCell className="font-dhivehi text-slate-500 text-lg">
        {service.category}
      </TableCell>
      <TableCell className="font-dhivehi text-slate-500 text-lg">
        {service.contactNumber}
      </TableCell>

      {/* <TableCell>
        <span
          className={`px-3 py-1 rounded-full text-white ${
            service.status === "Approved"
              ? "bg-green-500"
              : service.status === "Rejected"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {service.status}
        </span>
      </TableCell> */}
      <TableCell>
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
            // onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="bg-rose-500 text-white px-4 py-1 rounded-lg hover:bg-rose-600"
            // onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ServiceRow;
