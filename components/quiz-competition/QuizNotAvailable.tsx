"use client";

export default function QuizNotAvailable() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-12 shadow-sm max-w-md mx-auto text-center"
      dir="ltr"
    >
      <div
        dir="rtl"
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-100 mb-5 text-4xl animate-pulse"
        role="img"
        aria-label="Something went wrong"
      >
        😟
      </div>
      <h2 className="text-xl font-dhivehi text-slate-800 mb-2">
        މައްސަލައެއް ދިމާވެއްޖެ
      </h2>
      <p className="text-slate-600 text-base font-dhivehi">
        ކުޑަ އިރުކޮޅެއްތެރޭ އަލުން ޗެކްކޮށްލަދެއްވާ
      </p>
      <p className="text-slate-600 text-base font-dhivehi">
        (ނައުސަމް އަށް ނުގުޅިއަސް އިރުކޮޅަކުން އޯކޭ ވާނެ)
      </p>
    </div>
  );
}
