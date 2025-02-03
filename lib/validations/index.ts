import { z } from "zod";

// Define the schema for the form data
export const createRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  idCard: z.string().min(1, "ID card is required"),
  category: z.string().min(1, "ID card is required"),
});

export const createQuranCompetitionRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  idCardNumber: z.string().min(1, "ID card number is required"),
  address: z.string().min(1, "Address is required"),
  sex: z.string().min(1, "Sex is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  contactNumber: z.string().min(1, "Contact number is required"),

  parentName: z.string().min(1, "Parent name is required"),
  parentAddress: z.string().min(1, "Parent address is required"),
  relationship: z.string().min(1, "Relationship is required"),
  parentIdCardNumber: z.string().min(1, "Parent ID card number is required"),
  parentContactNumber: z.string().min(1, "Parent contact number is required"),

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
