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

export const madhahaSchema = z
  .object({
    fullName: z.string().min(1, "ފުރިހަމަ ނަން ލިޔުއްވާ!"),
    address: z.string().min(1, "އެޑްރެސް ލިޔުއްވާ!"),
    idCardNumber: z.string().min(1, "އައިޑީކާޑް ނަންބަރު ލިޔުއްވާ!"),
    contactNumber: z.string().min(1, "ފޯނު ނަންބަރު ލިޔުއްވާ!"),

    // ✅ ageGroup is optional initially
    ageGroup: z.string().optional(),

    groupOrSolo: z.enum(["ވަކިވަކިން", "ގްރޫޕްކޮން"], {
      required_error: "ބައިވެރިވުމަށް އެދިލައްވާ ގޮތް ނަންގަވާ!",
    }),

    groupName: z.string().optional(),

    groupMembers: z
      .array(z.string().min(1, "Member name is required"))
      .max(10, "Maximum 10 members allowed")
      .default([]),

    madhahaName: z.string().optional(),
    madhahaLyrics: z.string().optional(),

    idCard: z.string().min(1, "އައިޑީ ކާޑް އަޕްލޯޑް ކުރައްވާ!"),
  })

  // ✅ Require at least 3 group members if groupOrSolo is "ގްރޫޕްކޮން"
  .refine(
    (data) => {
      if (data.groupOrSolo === "ގްރޫޕްކޮން" && data.groupMembers.length < 2) {
        return false;
      }
      return true;
    },
    {
      message: " ގްރޫޕަށް ބައިވެރިން އިތުރު ކުރައްވާ!",
      path: ["groupMembers"],
    }
  )

  // ✅ Require groupName if groupOrSolo is "ގްރޫޕްކޮން"
  .refine(
    (data) => {
      if (data.groupOrSolo === "ގްރޫޕްކޮން") {
        return data.groupName && data.groupName.trim().length > 0;
      }
      return true;
    },
    {
      message: " ގްރޫޕްގެ ނަން ލިޔުއްވާ!",
      path: ["groupName"],
    }
  )

  // ✅ Require ageGroup only if groupOrSolo is "ވަކިވަކިން"
  .refine(
    (data) => {
      if (data.groupOrSolo === "ވަކިވަކިން") {
        return data.ageGroup && data.ageGroup.trim().length > 0;
      }
      return true;
    },
    {
      message: "ވަކިވަކިން ހެދުމުގައި، އުމުރުފުރާ ނަންގަވާ!",
      path: ["ageGroup"],
    }
  );

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

export const huthubaBangiSchema = z.object({
  fullName: z.string().min(1, "ފުރިހަމަ ނަން ލިޔުއްވާ!"),
  address: z.string().min(1, "އެޑްރެސް ލިޔުއްވާ!"),
  idCardNumber: z.string().min(1, "އައިޑީކާޑް ނަންބަރު ލިޔުއްވާ!"),
  contactNumber: z.string().min(1, "ފޯނު ނަންބަރު ލިޔުއްވާ!"),
  competitionType: z.enum(["ހުތުބާ", "ބަންގި", "ދެބައި"]),
  idCard: z.string().min(1, "އައިޑީ ކާޑް އަޕްލޯޑް ކުރައްވާ!"),
  ageGroup: z.string().min(1, "އުމުރުފުރާ ނަންގަވާ!"),
});
