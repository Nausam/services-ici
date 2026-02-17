// Format the time to display in the input field
export const formatTimeForInput = (dateTime: string | null) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
// Convert the input time back to ISO for saving
export const convertTimeToDateTime = (time: string, date: string) => {
  const [hours, minutes] = time.split(":");
  const dateTime = new Date(date);
  dateTime.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return dateTime.toISOString();
};

export const formatExcelDate = (excelDate: any): string => {
  if (typeof excelDate === "number") {
    // ✅ Convert Excel Serial Date to JavaScript Date
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const convertedDate = new Date(
      excelEpoch.getTime() + excelDate * 86400 * 1000
    );
    return convertedDate.toISOString();
  } else if (typeof excelDate === "string") {
    // ✅ Handle text-based date strings (e.g., "2/19/2025")
    const parsedDate = new Date(excelDate);
    return !isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : new Date().toISOString();
  } else {
    // Default to today if invalid
    return new Date().toISOString();
  }
};

// WASTE MANAGEMENT
export const registrationDefaultValues = {
  fullName: "",
  address: "",
  contactNumber: "",
  idCard: "",
  category: "",
};

// QURAN COMPETITION
export const QuranCompetitionregistrationDefaultValues = {
  fullName: "",
  idCardNumber: "",
  address: "",
  sex: "",
  dateOfBirth: "",
  contactNumber: "",
  keyStage: "",

  parentName: "",
  parentAddress: "",
  relationship: "",
  parentIdCardNumber: "",
  parentContactNumber: "",

  bankAccountName: "",
  bankAccountNumber: "",
  bankName: "",

  agreeToTerms: false,
  agreeyerName: "",
  agreedDate: "",

  balaigenKiyevunFeshey: false,
  balaigenKiyevunNimey: false,
  nubalaaKiyevunFeshey: false,
  nubalaaKiyevunNimey: false,

  finalRoundNubalaaKiyevunFeshey: false,
  finalRoundNubalaaKiyevunNimey: false,
  finalRoundBalaigenKiyevunFeshey: false,
  finalRoundBalaigenKiyevunNimey: false,

  idCard: "",
};

// PERMISSION REQUESTS
export const permissionOptions = [
  { value: "މަގު ބަންދުކުރުމުގެ ހުއްދަ", label: "މަގު ބަންދުކުރުމުގެ ހުއްދަ" },
  { value: "މަގު ކޮނުމުގެ ހުއްދަ", label: "މަގު ކޮނުމުގެ ހުއްދަ" },
  {
    value: "ފުޓްސަލް ދަނޑު ބޭނުންކުރުމުގެ ހުއްދަ",
    label: "ފުޓްސަލް ދަނޑު ބޭނުންކުރުމުގެ ހުއްދަ",
  },
  {
    value: "ވޯލީބޯޅަ ކޯޓް ބޭނުންކުރުމުގެ ހުއްދަ",
    label: "ވޯލީބޯޅަ ކޯޓް ބޭނުންކުރުމުގެ ހުއްދަ",
  },
  {
    value: "ޕްރީސްކޫލް ބޭނުންކުރުމުގެ ހުއްދަ",
    label: "ޕްރީސްކޫލް ބޭނުންކުރުމުގެ ހުއްދަ",
  },
];

export const formatTime = (milliseconds: number) => {
  if (milliseconds <= 0) return "00:00:00"; // Avoid negative countdown

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Quiz competition years (e.g. 2025, 2026)
export const QUIZ_COMPETITION_YEARS = [2025, 2026];
export const QUIZ_COMPETITION_DEFAULT_YEAR = 2026;

/** Returns the next 00:00 (midnight) in Maldives time (UTC+5) as a Date. */
export const getNextMidnightMaldives = (): Date => {
  const now = Date.now();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const MALDIVES_OFFSET_MS = 5 * 60 * 60 * 1000;
  const maldivesDay = Math.floor((now + MALDIVES_OFFSET_MS) / MS_PER_DAY);
  const nextMidnightMs =
    (maldivesDay + 1) * MS_PER_DAY - MALDIVES_OFFSET_MS;
  return new Date(nextMidnightMs);
};

export const AGE_GROUPS = [
  "6 އަހަރުން ދަށް",
  "6 އަހަރާއި 9 އަހަރާއި ދެމެދު",
  "9 އަހަރާއި 12 އަހަރާއި ދެމެދު",
  "12 އަހަރާއި 15 އަހަރާއި ދެމެދު",
  "15 އަހަރާއި 18 އަހަރާއި ދެމެދު",
  "18 އަހަރާއި 35 އަހަރާއި ދެމެދު",
  "35 އަހަރުން މަތި",
];

export const AGE_GROUPS_BANGI = [
  "6 އަހަރުން ދަށް",
  "6 އަހަރާއި 9 އަހަރާއި ދެމެދު",
  "9 އަހަރާއި 12 އަހަރާއި ދެމެދު",
  "12 އަހަރާއި 15 އަހަރާއި ދެމެދު",
  "15 އަހަރާއި 18 އަހަރާއި ދެމެދު",
  "18 އަހަރުން މަތި",
];
