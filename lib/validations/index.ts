import { z } from "zod";

// Define the schema for the form data
export const createRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  idCard: z.string().min(1, "ID card is required"),
  idCardNumber: z.string().min(1, "ID card number is required"),
  category: z.string().min(1, "ID card is required"),
});

export const createQuranCompetitionRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  idCardNumber: z.string().min(1, "ID card number is required"),
  address: z.string().min(1, "Address is required"),
  sex: z.string().min(1, "Sex is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  keyStage: z.string().optional(),

  parentName: z.string().optional(),
  parentAddress: z.string().optional(),
  relationship: z.string().optional(),
  parentIdCardNumber: z.string().optional(),
  parentContactNumber: z.string().optional(),

  bankAccountName: z.string().min(1, "Bank account name is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  bankName: z.string().min(1, "Bank name is required"),

  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "",
  }),
  agreeyerName: z.string().min(1, "Agreeyer name is required"),
  agreedDate: z.string().min(1, "Agreed date is required"),

  balaigenKiyevunFeshey: z.boolean().optional(),
  balaigenKiyevunNimey: z.boolean().optional(),
  nubalaaKiyevunFeshey: z.boolean().optional(),
  nubalaaKiyevunNimey: z.boolean().optional(),

  finalRoundNubalaaKiyevunFeshey: z.boolean().optional(),
  finalRoundNubalaaKiyevunNimey: z.boolean().optional(),
  finalRoundBalaigenKiyevunFeshey: z.boolean().optional(),
  finalRoundBalaigenKiyevunNimey: z.boolean().optional(),

  idCard: z.string().min(1, "ID card is required"),
});
