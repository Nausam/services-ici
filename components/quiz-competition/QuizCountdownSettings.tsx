"use client";

import React, { useEffect, useState } from "react";
import {
  getQuizCountdownSettings,
  updateQuizCountdownSettings,
} from "@/lib/actions/quizCompetition";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/UserProvider";
import PlaceholderCard from "../PlaceholderCard";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function toDateTimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

const QuizCountdownSettings = () => {
  const [countdownEnabled, setCountdownEnabled] = useState(false);
  const [countdownTargetAt, setCountdownTargetAt] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { isSuperAdmin } = useUser();

  useEffect(() => {
    const load = async () => {
      const s = await getQuizCountdownSettings();
      setCountdownEnabled(s.countdownEnabled);
      setCountdownTargetAt(toDateTimeLocal(s.countdownTargetAt));
      setLoaded(true);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateQuizCountdownSettings({
      countdownEnabled,
      countdownTargetAt: countdownTargetAt
        ? new Date(countdownTargetAt).toISOString()
        : null,
    });
    setSaving(false);
  };

  if (!isSuperAdmin) {
    return (
      <PlaceholderCard title="ސުވާލު ކައުންޓްޑައުން ސެޓިންގްސް ތިޔަފަރާތަށް ލިބިފައެއް ނުވޭ!" />
    );
  }

  if (!loaded) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-10 h-10 border-4 border-cyan-600 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 border border-cyan-200 rounded-xl bg-white shadow-md max-w-lg">
      <h2 className="font-dhivehi text-2xl text-cyan-950 font-bold mb-4">
        ސުވާލު ކައުންޓްޑައުން ސެޓިންގްސް
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="countdown-enabled" className="font-dhivehi text-cyan-900">
            ކައުންޓްޑައުން ފެށޭން ކުރޭ
          </Label>
          <Switch
            id="countdown-enabled"
            checked={countdownEnabled}
            onCheckedChange={setCountdownEnabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="countdown-target" className="font-dhivehi text-cyan-900">
            ކައުންޓްޑައުން ކުރާ ތާރީޚާއި ގަޑި
          </Label>
          <input
            id="countdown-target"
            type="datetime-local"
            dir="ltr"
            value={countdownTargetAt}
            onChange={(e) => setCountdownTargetAt(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-cyan-600 hover:bg-cyan-700 font-dhivehi"
        >
          {saving ? "ސޭވިނީ..." : "ސޭވް ކުރޭ"}
        </Button>
      </div>
    </div>
  );
};

export default QuizCountdownSettings;
