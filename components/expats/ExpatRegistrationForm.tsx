// components/expats/ExpatRegistrationForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  action: (formData: FormData) => Promise<void>;
  className?: string;
};

function Submitter() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="font-dhivehi text-xl">
      {pending ? "ސަބްމިޓް ވާނީ..." : "ރެޖިސްޓަރ ކުރޭ"}
    </Button>
  );
}

export default function ExpatRegistrationForm({ action, className }: Props) {
  const [passportName, setPassportName] = useState<string>("");
  const [photoName, setPhotoName] = useState<string>("");

  return (
    <form
      dir="rtl"
      action={action}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 rounded-2xl ring-1 ring-border bg-background/60 backdrop-blur",
        className
      )}
    >
      {/* Identity */}
      <div className="space-y-2">
        <Label htmlFor="givenNames" className="font-dhivehi text-lg">
          ނަން (ގިވަން)
        </Label>
        <Input id="givenNames" name="givenNames" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="surname" className="font-dhivehi text-lg">
          ސަރނޭމް
        </Label>
        <Input id="surname" name="surname" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passportNumber" className="font-dhivehi text-lg">
          ޕާސްޕޯޓް ނަމްބަރު
        </Label>
        <Input id="passportNumber" name="passportNumber" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationality" className="font-dhivehi text-lg">
          އަހަރެންސީ
        </Label>
        <Input id="nationality" name="nationality" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="font-dhivehi text-lg">
          އަހަރެންސީ އަހަރެން
        </Label>
        <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sex" className="font-dhivehi text-lg">
          ސެކްސް
        </Label>
        <select
          id="sex"
          name="sex"
          required
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="M">އައްސަން (M)</option>
          <option value="F">އަދިއްސަން (F)</option>
          <option value="X">X</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeOfBirth" className="font-dhivehi text-lg">
          އަހަރު ދަން
        </Label>
        <Input id="placeOfBirth" name="placeOfBirth" />
      </div>

      {/* Passport issuance */}
      <div className="space-y-2">
        <Label htmlFor="placeOfIssue" className="font-dhivehi text-lg">
          އިސޫ ކުރި ދަން
        </Label>
        <Input id="placeOfIssue" name="placeOfIssue" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfIssue" className="font-dhivehi text-lg">
          އިސޫ ތާރީޚް
        </Label>
        <Input id="dateOfIssue" name="dateOfIssue" type="date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfExpiry" className="font-dhivehi text-lg">
          ނިމުންދާ ތާރީޚް
        </Label>
        <Input id="dateOfExpiry" name="dateOfExpiry" type="date" />
      </div>

      {/* Local contact */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="font-dhivehi text-lg">
          ފޯނު
        </Label>
        <Input id="phone" name="phone" type="tel" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="font-dhivehi text-lg">
          އީމެއިލް
        </Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employerName" className="font-dhivehi text-lg">
          އިމްޕްލޯއަރ
        </Label>
        <Input id="employerName" name="employerName" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle" className="font-dhivehi text-lg">
          ޖޮބް ޓައިޓަލް
        </Label>
        <Input id="jobTitle" name="jobTitle" />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="localAddress" className="font-dhivehi text-lg">
          ލޯކަލް އެޑްރެސް
        </Label>
        <Textarea id="localAddress" name="localAddress" rows={2} />
      </div>

      {/* Emergency contact */}
      <div className="space-y-2">
        <Label htmlFor="emergencyName" className="font-dhivehi text-lg">
          އެމޯޖެންސީ ނަން
        </Label>
        <Input id="emergencyName" name="emergencyName" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emergencyPhone" className="font-dhivehi text-lg">
          އެމޯޖެންސީ ފޯނު
        </Label>
        <Input id="emergencyPhone" name="emergencyPhone" type="tel" />
      </div>

      {/* Files */}
      <div className="space-y-2">
        <Label htmlFor="passportDoc" className="font-dhivehi text-lg">
          ޕާސްޕޯޓް ފޮޓޯ/ޕީޑީއެފް
        </Label>
        <Input
          id="passportDoc"
          name="passportDoc"
          type="file"
          required
          onChange={(e) => setPassportName(e.target.files?.[0]?.name ?? "")}
          accept="image/*,application/pdf"
        />
        {passportName && (
          <p className="text-xs text-muted-foreground">{passportName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo" className="font-dhivehi text-lg">
          ފޮޓޯ (ޕްރޮފައިލް)
        </Label>
        <Input
          id="photo"
          name="photo"
          type="file"
          required
          onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
          accept="image/*"
        />
        {photoName && (
          <p className="text-xs text-muted-foreground">{photoName}</p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="notes" className="font-dhivehi text-lg">
          ނޯޓްސް
        </Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <Submitter />
      </div>
    </form>
  );
}
