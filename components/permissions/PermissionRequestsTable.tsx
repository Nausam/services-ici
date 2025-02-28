"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPermissionRequests } from "@/lib/actions/permissions.actions";
import PermissionRequestCard from "./PermissionRequestCard";
import { Button } from "@/components/ui/button";
import PlaceholderCard from "../PlaceholderCard";

const PAGE_SIZE = 10;

const PermissionRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const { documents, total } = await getAllPermissionRequests(
          PAGE_SIZE,
          offset
        );
        setRequests(documents);
        setTotalItems(total);
      } catch (error) {
        console.error("❌ Failed to fetch permission requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <PlaceholderCard title="އެއްވެސް  ބޭފުޅަކު ހުއްދައަކަށް ރިކުއެސްޓް ކޮށްފައެއް ނެތް!" />
    );
  }

  return (
    <div className="p-4 mt-10">
      <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
        ހުއްދަ ރިކުއެސްޓް ({totalItems})
      </h2>

      <div
        dir="rtl"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5"
      >
        {requests.map((request: any) => (
          <PermissionRequestCard
            key={request.$id}
            id={request.$id}
            fullName={request.fullName}
            permissionType={request.permissionType}
            startDate={request.startDate}
            endDate={request.endDate}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Next
        </Button>
        <span className="text-cyan-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Previous
        </Button>
      </div>
    </div>
  );
};

export default PermissionRequestsTable;
