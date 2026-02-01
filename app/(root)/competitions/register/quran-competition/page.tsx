"use client";

import QuranRegistrationForm from "@/components/quran-competition/QuranRegistrationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getQuranRegistrationById } from "@/lib/actions/quranCompetition.actions";
import { QuranCompetitionRegistration } from "@/types";
import { useState } from "react";

// Map Appwrite document to form prefill. Resets agreement fields for this year.
function mapDocToPrefill(
  doc: Record<string, unknown>
): QuranCompetitionRegistration {
  const toDate = (v: unknown) =>
    typeof v === "string" && v.includes("T")
      ? v.slice(0, 10)
      : (v as string) || "";

  return {
    fullName: (doc.fullName as string) || "",
    idCardNumber: (doc.idCardNumber as string) || "",
    address: (doc.address as string) || "",
    sex: (doc.sex as string) || "",
    dateOfBirth: toDate(doc.dateOfBirth),
    contactNumber: (doc.contactNumber as string) || "",
    keyStage: (doc.keyStage as string) || "",
    parentName: (doc.parentName as string) || "",
    parentAddress: (doc.parentAddress as string) || "",
    relationship: (doc.relationship as string) || "",
    parentIdCardNumber: (doc.parentIdCardNumber as string) || "",
    parentContactNumber: (doc.parentContactNumber as string) || "",
    bankAccountName: (doc.bankAccountName as string) || "",
    bankAccountNumber: (doc.bankAccountNumber as string) || "",
    bankName: (doc.bankName as string) || "",
    agreeToTerms: false,
    agreeyerName: "",
    agreedDate: "",
    balaigenKiyevunFeshey: !!doc.balaigenKiyevunFeshey,
    balaigenKiyevunNimey: !!doc.balaigenKiyevunNimey,
    nubalaaKiyevunFeshey: !!doc.nubalaaKiyevunFeshey,
    nubalaaKiyevunNimey: !!doc.nubalaaKiyevunNimey,
    finalRoundBalaigenKiyevunFeshey: !!doc.finalRoundBalaigenKiyevunFeshey,
    finalRoundBalaigenKiyevunNimey: !!doc.finalRoundBalaigenKiyevunNimey,
    finalRoundNubalaaKiyevunFeshey: !!doc.finalRoundNubalaaKiyevunFeshey,
    finalRoundNubalaaKiyevunNimey: !!doc.finalRoundNubalaaKiyevunNimey,
    idCard: (doc.idCard as string) || "",
  };
}

// Normalize ID to A + digits for lookup
function normalizeIdCard(input: string): string {
  const digits = input.replace(/^A/i, "").replace(/\D/g, "");
  return digits ? `A${digits}` : input;
}

const QuranCompetitionRegistrationPage = () => {
  const [step, setStep] = useState<"id_lookup" | "form">("id_lookup");
  const [prefill, setPrefill] = useState<QuranCompetitionRegistration | null>(
    null
  );
  const [idInput, setIdInput] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const handleLookup = async () => {
    const normalized = normalizeIdCard(idInput);
    if (!normalized || normalized === "A") {
      toast({
        title: "އައިޑީކާޑް ނަންބަރު ލިޔުއްވާ",
        variant: "destructive",
      });
      return;
    }

    setLookupLoading(true);
    try {
      const doc = await getQuranRegistrationById(normalized);
      const mapped = mapDocToPrefill(doc as Record<string, unknown>);
      setPrefill(mapped);
      setStep("form");
      toast({
        title: "ރެޖިސްޓްރޭޝަން ފެނިއްޖެ",
        variant: "default",
      });
    } catch {
      toast({
        title: "ރެޖިސްޓްރޭޝަން ނުފެނުނު! އަލުން ރެޖިސްޓާކޮށްލައްވާ",
        variant: "destructive",
      });
      setPrefill(null);
      setStep("form");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleNewParticipant = () => {
    setPrefill(null);
    setStep("form");
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div
        className="relative flex justify-center items-center h-40 md:h-60 lg:h-72 bg-gradient-to-br from-cyan-900 via-teal-800 to-cyan-950"
        dir="rtl"
      >
        <h1 className="font-dhivehi text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
          އިންނަމާދޫ ކައުންސިލްގެ 9 ވަނަ ޤުރުއާން މުބާރާތް
        </h1>
      </div>
      <div className="my-10">
        {step === "id_lookup" ? (
          <div
            className="flex flex-col gap-6 bg-white shadow-lg p-8 rounded-lg max-w-7xl mx-auto"
            dir="rtl"
          >
            <p className="font-dhivehi text-2xl text-right text-cyan-800">
              {`މުބާރާތުގައި 2025 ވަނަ އަހަރު ބައިވެރިވެފައިވާނަމަ އަ.އި.ޑީ.ކާޑު ނަންބަރު ޖައްސަވާ ސާރޗް ކުރައްވާ! އަދި 2025 ވަނަ އަހަރު ބައިވެރިވެފައި ނުވާނަމަ އަލުން ރެޖިސްކޮށްލައްވާ!`}
            </p>
            <div>
              <p className="font-dhivehi text-xl text-right text-cyan-950 mb-2">
                އައިޑީކާޑް ނަންބަރު
              </p>
              <Input
                value={idInput}
                onChange={(e) => {
                  const digits = e.target.value
                    .replace(/^A/i, "")
                    .replace(/\D/g, "");
                  setIdInput(digits ? `A${digits}` : "");
                }}
                placeholder="A123456"
                className="rounded-md font-dhivehi border-gray-300 text-right font-bold tracking-widest text-cyan-950 max-w-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={handleLookup}
                disabled={lookupLoading}
                className="bg-cyan-700 text-white hover:bg-cyan-600 font-dhivehi text-lg"
              >
                {lookupLoading ? "ހޯދަނީ..." : "ސާރޗް ކުރައްވާ"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleNewParticipant}
                className="font-dhivehi text-lg border-cyan-600 text-cyan-700 hover:bg-cyan-50"
              >
                ރެޖިސްޓާ ކުރުމަށް
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <QuranRegistrationForm
              type="Create"
              registration={prefill || undefined}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default QuranCompetitionRegistrationPage;
