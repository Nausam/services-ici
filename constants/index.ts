import { date } from "zod";

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

export const registrationDefaultValues = {
  fullName: "",
  address: "",
  contactNumber: "",
  idCard: "",
  category: "",
};

export const QuranCompetitionregistrationDefaultValues = {
  fullName: "",
  idCardNumber: "",
  address: "",
  sex: "",
  dateOfBirth: "",
  contactNumber: "",

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
