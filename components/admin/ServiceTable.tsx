"use client";

import React, { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { getAllRegistrations } from "@/lib/actions/waste.actions";
import Q_ParticipantCard from "../quran-competition/Q_ParticipantCard";

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const fetchServices = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const { documents, total } = await getAllRegistrations(
        itemsPerPage,
        offset
      );
      setServices(documents);
      setTotalItems(total);
    } catch (error) {
      console.error("Failed to fetch service requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const downloadCSV = () => {
    if (services.length === 0) return;

    const csvHeader =
      "ފޯނު ނަންބަރު, އައިޑީކާޑް ނަންބަރު, ކެޓެގަރީ, އެޑްރެސް, ފުރިހަމަ ނަން\n";

    const csvRows = services
      .map((service: any) =>
        [
          `"${service.contactNumber}"`,
          `"${service.idCardNumber}"`,
          `"${service.category}"`,
          `"${service.address}"`,
          `"${service.fullName}"`,
        ].join(",")
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "waste_management.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <p className="text-center text-gray-500">No service requests found.</p>
    );
  }

  return (
    <div className="p-4 mt-10">
      <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
        ކުނި މެނޭޖްމަންޓް ({totalItems})
      </h2>
      <div className="flex justify-start mb-4 gap-4">
        <Button
          onClick={downloadCSV}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Download CSV
        </Button>
      </div>

      <select
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        className="border border-cyan-600 bg-white text-cyan-800 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-700 text-md font-dhivehi shadow-sm transition duration-200 ease-in-out mt-10 cursor-pointer"
      >
        <option value={3}>ޕޭޖެއްގަ 3</option>
        <option value={6}>ޕޭޖެއްގަ 6</option>
        <option value={9}>ޕޭޖެއްގަ 9</option>
        <option value={12}>ޕޭޖެއްގަ 12</option>
        <option value={16}>ޕޭޖެއްގަ 16</option>
      </select>

      <div
        dir="rtl"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5"
      >
        {services.map((serv: any) => (
          <Q_ParticipantCard
            key={serv.idCardNumber}
            fullName={serv.address}
            idCardNumber={serv.idCardNumber}
            contactNumber={serv.contactNumber}
            href={`/services/waste-management/${serv.idCardNumber}`}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-10">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Previous
        </Button>
        <span className="text-cyan-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ServiceTable;
