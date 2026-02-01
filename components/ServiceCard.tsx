"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  deleteHomeCompetitionsCard,
  updateCardVisibility,
} from "@/lib/actions/home.actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ServiceCardProps = {
  id: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  dueDate?: string;
  category?: string;
  image?: string;
  imageId?: string;
  hidden?: boolean;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  onVisibilityToggle?: () => void;
  onDelete?: () => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  link,
  buttonText,
  dueDate,
  image,
  hidden,
  isAdmin = false,
  isSuperAdmin = false,
  onVisibilityToggle,
  onDelete,
  imageId,
}) => {
  const { toast } = useToast();

  // Function to check if the due date has passed
  const isDuePassed = (dueDate?: string) => {
    if (!dueDate) return false;

    // Parse the due date in UTC
    const due = new Date(dueDate).getTime();

    // Get the current time (local machine time)
    const now = new Date().getTime();

    return now > due;
  };

  // Format due date with both date and time
  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return "";

    const date = new Date(dueDate);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Indian/Maldives", // Correct time zone for Maldives
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  /// Handle button click
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const normalizedLink = link.startsWith("/") ? link : `/${link}`;

    if (isDuePassed(dueDate)) {
      e.preventDefault();

      if (normalizedLink === "/services/register/waste-management") {
        toast({
          title:
            "ކުނި އުކާލުމަށާއި ކުނި ނައްތާލުމަށް ރެޖިސްޓާ ކުރުމުގެ މުއްދަތު ވަނީ ހަމަވެފަ",
          variant: "destructive",
        });
        return;
      }

      if (normalizedLink === "/competitions/register/quran-competition") {
        toast({
          title:
            "ކައުންސިލްގެ 8 ވަނަ ޤުރުއާން މުބާރާތަށް ރެޖިސްޓާ ކުރުމުގެ މުއްދަތު ވަނީ ހަމަވެފަ",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "މުއްދަތު ވަނީ ހަމަވެފަ",
        variant: "destructive",
      });
    }
  };

  // Handle card visibility toggle
  const handleToggleVisibility = async () => {
    try {
      const newVisibility = !hidden; // Toggle visibility state
      await updateCardVisibility(id, newVisibility); // Call backend API
      toast({
        title: `Card ${newVisibility ? "hidden" : "visible"} successfully`,
        variant: "default",
      });

      // Update local state for instant feedback
      if (onVisibilityToggle) {
        onVisibilityToggle();
      } else {
        // Fallback: Update `hidden` locally if no parent callback provided
        hidden = newVisibility;
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast({
        title: "Failed to update card visibility",
        variant: "destructive",
      });
    }
  };

  // If the card is hidden and the user is not an admin, do not render it
  if (hidden && !isAdmin) return null;

  // Handle card delete
  const handleDelete = async () => {
    try {
      await deleteHomeCompetitionsCard(id, imageId || "");
      toast({
        title: "Card deleted successfully.",
        variant: "default",
      });
      if (onDelete) onDelete(); // Notify parent to refresh
    } catch (error) {
      console.error("Error deleting card:", error);
      toast({
        title: "Failed to delete card.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="md:mb-0 mb-5 flex border border-white flex-col bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-xl p-8 max-w-3xl mx-auto hover:shadow-xl transition-shadow duration-300 mt-5 md:mt-10 gap-6 md:flex-row-reverse">
      {/* Optional Image */}
      {image && (
        <div
          className="relative w-full h-40 md:w-1/3 md:h-auto rounded-lg overflow-hidden bg-cover bg-center md:block hidden border border-white"
          style={{
            backgroundImage: `url('${image}')`,
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
          }}
        ></div>
      )}
      {image && (
        <div
          className="relative w-full h-40 rounded-lg overflow-hidden bg-cover bg-center block md:hidden"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundSize: "120%",
          }}
        ></div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Title and Due Date */}
        <div className="flex flex-col items-start mb-6">
          {dueDate && (
            <div className="inline-flex items-center bg-slate-100 text-cyan-800 text-sm font-bold py-1 px-3 rounded-md whitespace-nowrap shadow-md">
              {formatDueDate(dueDate)}
              <div className="mr-2">
                <Image
                  src="/assets/icons/hourglass.png"
                  alt="hourglass"
                  width={15}
                  height={15}
                />
              </div>
            </div>
          )}
          <h3 className="md:text-3xl text-2xl font-bold font-dhivehi text-cyan-900 leading-tight mt-5">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="md:text-lg text-md font-dhivehi text-slate-600 mb-6">
          {description}
        </p>

        {/* Button */}
        <div className="flex flex-wrap justify-start gap-2">
          <Link href={link} onClick={handleClick} passHref>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white hover:bg-gradient-to-br hover:from-cyan-700 hover:to-cyan-500  transition-all duration-500 px-6 py-3 rounded-md shadow-md font-dhivehi text-xl"
            >
              {buttonText}
            </Button>
          </Link>

          {/* Update Button - edit the competition card (title, link, due date, etc.) */}
          {isSuperAdmin && (
            <Link href={`/services/edit/${id}`}>
              <Button
                size="lg"
                className="bg-gradient-to-br from-green-500 text-white to-green-700 hover:bg-gradient-to-br hover:from-green-700 hover:to-green-500 transition duration-300 px-6 py-3 rounded-md shadow-md font-dhivehi text-xl"
              >
                އަޕްޑޭޓް
              </Button>
            </Link>
          )}

          {/* Hide Button (Visible to Admins Only) */}
          {isSuperAdmin && (
            <Button
              size="lg"
              className="shadow-md font-dhivehi text-xl bg-gradient-to-br from-orange-500 text-white to-orange-700 hover:bg-gradient-to-br hover:from-orange-700 hover:to-orange-500 "
              onClick={handleToggleVisibility}
            >
              {hidden ? "ދައްކާ" : "ފޮރުވާ"}
            </Button>
          )}

          {isSuperAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-br from-red-500 text-white to-red-700 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-500 font-dhivehi text-xl"
                >
                  ޑިލީޓް
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader className="flex gap-2">
                  <AlertDialogTitle
                    dir="rtl"
                    className="font-dhivehi text-right text-2xl"
                  >
                    ޑިލީޓް ކޮށްލަންވީތަ؟
                  </AlertDialogTitle>
                  <AlertDialogDescription
                    dir="rtl"
                    className="font-dhivehi text-right text-xl"
                  >
                    ޑިލީޓް ކޮށްލުމަށްފަހު މި ކާޑް އަނބުރާ ނުގެނެވޭނެއެވެ.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild className="hover:text-white">
                    <Button
                      size="lg"
                      className="bg-gradient-to-br from-slate-500 text-white to-slate-700 hover:bg-gradient-to-br hover:from-slate-700 hover:to-slate-500 font-dhivehi text-lg"
                    >
                      ނޫން
                    </Button>
                  </AlertDialogCancel>

                  <AlertDialogAction asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-br from-red-500 text-white to-red-700 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-500 font-dhivehi text-lg"
                      onClick={handleDelete}
                    >
                      ޑިލީޓް
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
