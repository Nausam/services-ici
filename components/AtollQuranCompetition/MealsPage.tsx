// app/meals/page.tsx
import React from "react";

type MealRow = {
  slot:
    | "ހެނދުނު ސައި"
    | "މެންދުރުގެ ކެއުން"
    | "ހަވީރު ސައި"
    | "ރޭގަނޑުގެ ކެއުން";
  time: string; // "07:30 – 08:30"
  venue: string; // "Main Hall", "Cafeteria", etc.
  notes?: string; // optional detail
};

type DayPlan = {
  date: string; // "2025-09-08"
  dayLabel: string; // "Mon"
  rows: MealRow[];
};

// ===== EDIT THESE WITH YOUR REAL TIMES/VENUES =====
const PLAN: DayPlan[] = [
  {
    date: "2025-09-03",
    dayLabel: "ބުދަ",
    rows: [
      { slot: "ހަވީރު ސައި", time: "15:45 – 17:00", venue: "ޕްރީސްކޫލް" }, // Tea
      { slot: "ރޭގަނޑުގެ ކެއުން", time: "19:45 – 21:00", venue: "ޕްރީސްކޫލް" }, // Dinner
    ],
  },
  {
    date: "2025-09-04",
    dayLabel: "ބުރާސްފަތި",
    rows: [
      { slot: "ހެނދުނު ސައި", time: "07:45 – 09:00", venue: "ޕްރީސްކޫލް" }, // Breakfast
      { slot: "މެންދުރުގެ ކެއުން", time: "13:00 – 14:30", venue: "ޕްރީސްކޫލް" }, // Lunch
      { slot: "ހަވީރު ސައި", time: "15:45 – 17:00", venue: "ޕްރީސްކޫލް" }, // Tea
      { slot: "ރޭގަނޑުގެ ކެއުން", time: "19:45 – 21:00", venue: "ޕްރީސްކޫލް" }, // Dinner
    ],
  },
  {
    date: "2025-09-05",
    dayLabel: "ހުކުރު",
    rows: [
      { slot: "ހެނދުނު ސައި", time: "07:45 – 09:00", venue: "ޕްރީސްކޫލް" },
      { slot: "މެންދުރުގެ ކެއުން", time: "13:00 – 14:30", venue: "ޕްރީސްކޫލް" },
      { slot: "ހަވީރު ސައި", time: "15:45 – 17:00", venue: "ޕްރީސްކޫލް" },
      { slot: "ރޭގަނޑުގެ ކެއުން", time: "19:45 – 21:00", venue: "ޕްރީސްކޫލް" },
    ],
  },
  {
    date: "2025-09-06",
    dayLabel: "ހޮނިހިރު",
    rows: [
      { slot: "ހެނދުނު ސައި", time: "07:45 – 09:00", venue: "ޕްރީސްކޫލް" }, // Breakfast only
    ],
  },
];

export default function MealsPage() {
  return (
    <div className="w-full bg-white py-10  mt-[100px]" dir="rtl">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="mb-6 text-center font-dhivehi text-2xl md:text-3xl font-semibold">
          ކެއުމުގެ ގަޑިތައް ހަމަޖެހިފައިވާގޮތް
        </h1>

        <div className="space-y-8">
          {PLAN.map((day, idx) => (
            <section
              key={day.date}
              className="rounded-2xl bg-white shadow-sm ring-1 ring-muted"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-dhivehi text-xl md:text-2xl font-semibold">
                  ދުވަސް {idx + 1} : {day.date} ({day.dayLabel})
                </h2>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y">
                  <thead className="bg-muted/40 text-sm">
                    <tr className="[direction:ltr]">
                      <th className="px-4 py-3 text-right font-dhivehi font-medium text-xl">
                        ކޮށްތު
                      </th>
                      <th className="px-4 py-3 text-right font-dhivehi font-medium text-xl">
                        ގަޑި
                      </th>
                      <th className="px-4 py-3 text-right font-dhivehi font-medium text-xl">
                        ތަން
                      </th>
                      <th className="px-4 py-3 text-right font-dhivehi font-medium text-xl">
                        އިތުރު މަޢުލޫމާތު
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {day.rows.map((r, idx) => (
                      <tr key={idx} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-sm font-dhivehi font-medium">
                          {r.slot}
                        </td>
                        <td className="px-4 py-3 font-dhivehi text-sm">
                          {r.time}
                        </td>
                        <td className="px-4 py-3 font-dhivehi text-sm">
                          {r.venue}
                        </td>
                        <td className="px-4 py-3 font-dhivehi text-sm text-muted-foreground">
                          {r.notes ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
