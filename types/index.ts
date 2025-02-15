export type Registration = {
  fullName: string;
  address: string;
  contactNumber: string;
  idCard: string;
  idCardNumber: string;
  category: string;
};

export type QuranCompetitionRegistration = {
  fullName: string;
  idCardNumber: string;
  address: string;
  sex: string;
  dateOfBirth: string;
  contactNumber: string;
  keyStage?: string;

  parentName?: string;
  parentAddress?: string;
  relationship?: string;
  parentIdCardNumber?: string;
  parentContactNumber?: string;

  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;

  agreeToTerms: boolean;
  agreeyerName: string;
  agreedDate: string;

  balaigenKiyevunFeshey?: boolean;
  balaigenKiyevunNimey?: boolean;
  nubalaaKiyevunFeshey?: boolean;
  nubalaaKiyevunNimey?: boolean;

  finalRoundNubalaaKiyevunFeshey?: boolean;
  finalRoundNubalaaKiyevunNimey?: boolean;
  finalRoundBalaigenKiyevunFeshey?: boolean;
  finalRoundBalaigenKiyevunNimey?: boolean;

  idCard: string;
};

export type QuizQuestion = {
  date: string;
  question: string;
  options: string[];
};

export type HomeCard = {
  id: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  dueDate: string;
  image: string;
  imageId: string;
  hidden: boolean;
  category: string;
};
