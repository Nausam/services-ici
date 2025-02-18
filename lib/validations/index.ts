import { z } from "zod";

// WASTE MANAGEMENT FORM SCHEMA
export const createRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  idCard: z.string().min(1, "ID card is required"),
  idCardNumber: z.string().min(1, "ID card number is required"),
  category: z.string().min(1, "ID card is required"),
});

// QURAN COMPETITION FORM SCHEMA
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

// RAMDAN QUIZ FORM SCHEMA
export const quizSchema = z.object({
  fullName: z.string().min(1, " ފުރިހަމަ ނަން ލިޔުއްވާ! "),
  contactNumber: z.string().min(7, " ފޯނު ނަންބަރު ލިޔުއްވާ! "),
  idCardNumber: z.string().min(5, " އައިޑީކާޑް ނަންބަރު ލިޔުއްވާ! "),
  answer: z.string().min(1, " އިހްތިޔާރު ކުރައްވާ ޖަވާބު ނަންގަވާ! "),
});

// PERMISSION REQUEST FORM SCHEMA
export const permissionRequestSchema = z.object({
  fullName: z.string().min(1, "ނަން ލިޔުއްވާ"),
  contactNumber: z.string().min(1, "ފޯނު ނަންބަރު ލިޔުއްވާ"),
  company: z.string().optional(),
  permissionType: z.string().min(1, "ހުއްދައިގެ ބާވަތް ނަންގަވާ"),
  reason: z.string().min(1, " ހުއްދަ ނަގަން ބޭނުންވާ ސަބަބު ލިޔުއްވާ "),
  startDate: z.string().min(1, "ހުއްދަ ފަށާދުވަސް ނަންގަވާ"),
  endDate: z.string().min(1, "ހުއްދަ ނިމޭ ދުވަސް ނަންގަވާ"),
});
