"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ServiceRow from "./ServiceRow";
import { getAllRegistrations } from "@/lib/actions/waste.actions";
import { Button } from "../ui/button";

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllRegistrations();
        console.log(data);
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch service requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const downloadCSV = () => {
    if (services.length === 0) return;

    // Create CSV header
    const csvHeader = "ފުރިހަމަ ނަން, އެޑްރެސް, ކެޓެގަރީ, ފޯނު ނަންބަރު\n";

    // Map service data into CSV rows
    const csvRows = services
      .map((service: any) =>
        [
          `"${service.fullName}"`,
          `"${service.address}"`,
          `"${service.category}"`,
          `"${service.contactNumber}"`,
        ].join(",")
      )
      .join("\n");

    // Combine header and rows
    const csvContent = csvHeader + csvRows;

    // Add BOM for UTF-8 encoding
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    // Trigger file download
    const link = document.createElement("a");
    link.href = url;
    link.download = "service_requests.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading service requests...</p>
    );
  }

  if (services.length === 0) {
    return (
      <p className="text-center text-gray-500">No service requests found.</p>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={downloadCSV}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Download CSV
        </Button>
      </div>

      <Table
        className="bg-white shadow-md rounded-lg overflow-hidden"
        dir="rtl"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="font-dhivehi text-right text-xl text-cyan-900">
              ފުރިހަމަ ނަން
            </TableHead>
            <TableHead className="font-dhivehi text-right text-xl text-cyan-900">
              އެޑްރެސް
            </TableHead>
            <TableHead className="font-dhivehi text-right text-xl text-cyan-900">
              ކެޓެގަރީ
            </TableHead>
            <TableHead className="font-dhivehi text-right text-xl text-cyan-900">
              ފޯނު ނަންބަރު
            </TableHead>

            {/* <TableHead className="font-dhivehi text-right text-xl text-cyan-900">
            ސްޓޭޓަސް
          </TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service: any, index) => (
            <ServiceRow key={service.fullName + index} service={service} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceTable;
