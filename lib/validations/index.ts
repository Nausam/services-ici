import { z } from "zod";

// Define the schema for the form data
export const createRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  idCard: z.string().min(1, "ID card is required"),
  category: z.string().min(1, "ID card is required"),
});
