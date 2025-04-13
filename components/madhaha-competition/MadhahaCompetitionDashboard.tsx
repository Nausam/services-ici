"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import Q_ParticipantCard from "../quran-competition/Q_ParticipantCard";
import {
  deleteHuthubaBangiCompetitionRegistration,
  getAllHuthubaBangiCompetitionRegistrations,
} from "@/lib/actions/huthubaBangi.actions";
import {
  HuthubaBangiCompetitionRegistration,
  MadhahaCompetitionRegistration,
} from "@/types";
import PlaceholderCard from "../PlaceholderCard";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { getAllMadhahaCompetitionRegistrations } from "@/lib/actions/madhaha.actions";

const MadhahaCompetitionDashboard = () => {
  const [registrations, setRegistrations] = useState<
    MadhahaCompetitionRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchRegistrations = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const { documents, total } = await getAllMadhahaCompetitionRegistrations(
        itemsPerPage,
        offset,
        debouncedSearchTerm // ✅ Pass search term to backend
      );

      setRegistrations(
        documents.map((doc) => ({
          $id: doc.$id,
          fullName: doc.fullName,
          address: doc.address,
          idCardNumber: doc.idCardNumber,
          contactNumber: doc.contactNumber,
          competitionType: doc.competitionType,
          idCard: doc.idCard,
          ageGroup: doc.ageGroup,
          groupOrSolo: doc.groupOrSolo,
          groupMembers: doc.groupMembers || [],
          madhahaName: doc.madhahaName,
          madhahaLyrics: doc.madhahaLyrics,
          groupName: doc.groupName,
        })) as MadhahaCompetitionRegistration[]
      );

      setTotalItems(total);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations(currentPage);
  }, [currentPage, itemsPerPage, debouncedSearchTerm]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value === -1 ? totalItems : value);
    setCurrentPage(1);
  };

  const handleEdit = ($id: string) => {
    router.push(`/competitions/madhaha-competition/edit/${$id}`);
  };

  const handleDelete = async ($id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this participant?"
    );

    if (!confirmDelete) return;

    try {
      // ✅ Call the delete function
      await deleteHuthubaBangiCompetitionRegistration($id);

      // ✅ Remove from state after successful deletion
      setRegistrations((prev) =>
        prev.filter((reg) => reg.$id !== $id)
      );

      setTotalItems((prev) => prev - 1);

      console.log("Deleted successfully");
    } catch (error) {
      console.error("Failed to delete participant:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    // Clear timeout if the user types again within 300ms
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );

  if (registrations.length === 0)
    return (
      <div className="flex items-center justify-center">
        <PlaceholderCard title="މަދަޙަ ކިޔުމުގެ މުބާރާތުގައި އެއްވެސް ބައިވެރިއަކު ނެތް!" />
      </div>
    );

  return (
    <div className="p-4 mt-10">
      <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
        މަދަޙަ މުބާރާތުގެ ބައިވެރިން ({totalItems})
      </h2>

      {/* <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="އައިޑީ ކާޑް ގައި ސަރޗްކުރައްވާ!"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-sm rounded-md font-dhivehi border-gray-300 text-right"
        />
      </div> */}

      {/* Items Per Page */}
      <select
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        className="border border-cyan-600 bg-white text-cyan-800 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-700 text-md font-dhivehi shadow-sm transition duration-200 ease-in-out mt-5 cursor-pointer"
      >
        <option value={3}>ޕޭޖެއްގަ 3</option>
        <option value={6}>ޕޭޖެއްގަ 6</option>
        <option value={9}>ޕޭޖެއްގަ 9</option>
        <option value={12}>ޕޭޖެއްގަ 12</option>
        <option value={15}>ޕޭޖެއްގަ 15</option>
        <option value={-1}>ހުރިހާ</option>
      </select>

      {/* Participants Grid */}
      <div
        dir="rtl"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5"
      >
        {registrations.map((reg: any, index) => (
          <Q_ParticipantCard
            key={reg.$id + index}
            fullName={reg.groupName || reg.fullName}
            idCardNumber={reg.idCardNumber}
            contactNumber={reg.contactNumber}
            href={`/competitions/madhaha-competition/${reg.$id}`}
            idCardUrl={reg.idCard}
            onEdit={() => handleEdit(reg.$id)}
            onDelete={() => handleDelete(reg.$id)}
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

export default MadhahaCompetitionDashboard;
