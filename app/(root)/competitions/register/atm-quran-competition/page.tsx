"use client";

import QuranRegistrationForm from "@/components/quran-competition/QuranRegistrationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getQuranRegistrationById } from "@/lib/actions/quranCompetition.actions";
import { QuranCompetitionRegistration } from "@/types";
import { useState } from "react";

function mapDocToPrefill(
  doc: Record<string, unknown>
): QuranCompetitionRegistration {
  const toDate = (value: unknown) =>
    typeof value === "string" && value.includes("T")
      ? value.slice(0, 10)
      : (value as string) || "";

  return {
    fullName: (doc.fullName as string) || "",
    idCardNumber: (doc.idCardNumber as string) || "",
    address: (doc.address as string) || "",
    sex: (doc.sex as string) || "",
    dateOfBirth: toDate(doc.dateOfBirth),
    contactNumber: (doc.contactNumber as string) || "",
    keyStage: "",
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
    competitionType: "atm-quran",
  };
}

function normalizeIdCard(input: string): string {
  const digits = input.replace(/^A/i, "").replace(/\D/g, "");
  return digits ? `A${digits}` : input;
}

const AtmQuranCompetitionRegistrationPage = () => {
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
        title: "ކުރީގެ ރެޖިސްޓްރޭޝަން ފެނިއްޖެ",
        variant: "default",
      });
    } catch {
      toast({
        title: "ކުރީގެ ރެޖިސްޓްރޭޝަން ނުފެނުނު. އަލުން ރެޖިސްޓާ ކުރައްވާ",
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
        className="relative isolate flex justify-center items-center h-40 md:h-60 lg:h-72 overflow-hidden"
        dir="rtl"
        style={{
          backgroundColor: "#083344",
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(34, 211, 238, 0.36), transparent 35%), radial-gradient(ellipse at 18% 82%, rgba(45, 212, 191, 0.28), transparent 38%), linear-gradient(135deg, #0e7490 0%, #115e59 48%, #082f49 100%)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage:
              "linear-gradient(30deg, rgba(255, 255, 255, 0.16) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.16) 87.5%, rgba(255, 255, 255, 0.16)), linear-gradient(150deg, rgba(255, 255, 255, 0.16) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.16) 87.5%, rgba(255, 255, 255, 0.16))",
            backgroundSize: "72px 42px",
          }}
        />
        <svg
          aria-hidden="true"
          className="h-24 w-full text-white/20 md:h-32"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0,
          }}
          viewBox="0 0 1200 180"
        >
          <path
            d="M0 116c112-36 214-40 310-16 98 25 153 65 260 36 119-32 175-88 302-62 110 23 194 76 328 31v75H0Z"
            fill="currentColor"
          />
          <path
            d="M0 145c128-34 213-23 317 0 103 23 196 43 314 1 135-48 217-73 352-33 69 20 135 25 217 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 32,
            left: 32,
            top: 24,
            height: 1,
            background:
              "linear-gradient(to left, transparent, rgba(207, 250, 254, 0.48), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 32,
            left: 32,
            bottom: 24,
            height: 1,
            background:
              "linear-gradient(to left, transparent, rgba(153, 246, 228, 0.38), transparent)",
          }}
        />
        <h1 className="relative z-10 font-dhivehi text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
          އ.ތ.މ ކޮމެޓީގެ 4 ވަނަ ޤުރުއާން މުބާރާތް
        </h1>
      </div>
      <div className="my-10">
        {step === "id_lookup" ? (
          <div
            className="flex flex-col gap-6 bg-white shadow-lg p-8 rounded-lg max-w-7xl mx-auto"
            dir="rtl"
          >
            <p className="font-dhivehi text-2xl text-right text-cyan-800">
              އިންނަމާދޫ ކައުންސިލް ޤުރުއާން މުބާރާތުގައި 2025 ވަނަ އަހަރު ބައިވެރިވެފައިވާނަމަ އައިޑީކާޑް ނަންބަރު ޖައްސަވާ ސާރޗް ކުރައްވާ. ބައިވެރިވެފައި ނުވާނަމަ އަލުން ރެޖިސްޓާ ކުރައްވާ.
            </p>
            <div>
              <p className="font-dhivehi text-xl text-right text-cyan-950 mb-2">
                އައިޑީކާޑް ނަންބަރު
              </p>
              <Input
                value={idInput}
                onChange={(event) => {
                  const digits = event.target.value
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
                އަލުން ރެޖިސްޓާ ކުރައްވާ
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <QuranRegistrationForm
              type="Create"
              registration={prefill || undefined}
              competitionType="atm-quran"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AtmQuranCompetitionRegistrationPage;
