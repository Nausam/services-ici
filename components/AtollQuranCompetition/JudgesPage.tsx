// app/judges/page.tsx
import React from "react";

type Judge = {
  name: string;
  address: string;
};

const JUDGES: Judge[] = [
  { name: "ޢަބްދުﷲ ވަޙީދު", address: "މއ. ފައްޔޫމް" },
  { name: "މޫސާ އަޙްމަދު", address: "ފ. ނިލަންދޫ" },
  { name: "އަޤްސާމް މުޙައްމަދު", address: "މާދަޑު. މަޠަން ޏ. ފުވައްމުލައް" },
];

function JudgeCard({ judge }: { judge: Judge }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 flex flex-col items-center text-center">
      <h3 className="font-dhivehi text-2xl font-bold text-gray-900">
        {judge.name}
      </h3>
      <p className="mt-2 font-dhivehi text-lg text-gray-600">{judge.address}</p>
    </div>
  );
}

export default function JudgesPage() {
  return (
    <div className="w-full bg-white py-10 mt-[100px]" dir="rtl">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="mb-8 text-center font-dhivehi text-3xl font-semibold">
          ފަނޑިޔާރުން
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {JUDGES.map((j, i) => (
            <JudgeCard key={i} judge={j} />
          ))}
        </div>
      </div>
    </div>
  );
}
