// app/services/expats/new/page.tsx
import ExpatRegistrationForm from "@/components/expats/ExpatRegistrationForm";
import {
  createExpatRegistration,
  uploadExpatFile,
} from "@/lib/appwrite/expats.actions";
import type { ExpatRegistration } from "@/types/expat";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function NewExpatPage() {
  async function registerAction(formData: FormData) {
    "use server";

    // Get files
    const passportFile = formData.get("passportDoc");
    const photoFile = formData.get("photo");

    if (!(passportFile instanceof File) || passportFile.size === 0) {
      throw new Error("Passport file is required");
    }
    if (!(photoFile instanceof File) || photoFile.size === 0) {
      throw new Error("Profile photo is required");
    }

    // Uploads
    const [passportDocUrl, photoUrl] = await Promise.all([
      uploadExpatFile(passportFile),
      uploadExpatFile(photoFile),
    ]);

    // Build payload
    const payload: ExpatRegistration = {
      givenNames: String(formData.get("givenNames") || "").trim(),
      surname: String(formData.get("surname") || "").trim(),
      passportNumber: String(formData.get("passportNumber") || "").trim(),
      nationality: String(formData.get("nationality") || "").trim(),
      dateOfBirth: String(formData.get("dateOfBirth") || ""),
      sex: String(formData.get("sex") || "M") as ExpatRegistration["sex"],

      placeOfBirth: String(formData.get("placeOfBirth") || "").trim(),
      placeOfIssue: String(formData.get("placeOfIssue") || "").trim(),
      dateOfIssue: String(formData.get("dateOfIssue") || ""),
      dateOfExpiry: String(formData.get("dateOfExpiry") || ""),

      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      employerName: String(formData.get("employerName") || "").trim(),
      jobTitle: String(formData.get("jobTitle") || "").trim(),
      localAddress: String(formData.get("localAddress") || "").trim(),

      emergencyName: String(formData.get("emergencyName") || "").trim(),
      emergencyPhone: String(formData.get("emergencyPhone") || "").trim(),

      passportDocUrl,
      photoUrl,
      notes: String(formData.get("notes") || "").trim(),
    };

    await createExpatRegistration(payload);

    // optional: revalidate any list page
    revalidatePath("/services/expats");
    redirect("/services/expats/success");
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-6">
      <h1 dir="rtl" className="font-dhivehi text-3xl mb-4">
        ބައިވެރި ރެޖިސްޓްރޭޝަން
      </h1>
      <ExpatRegistrationForm action={registerAction} />
    </section>
  );
}
