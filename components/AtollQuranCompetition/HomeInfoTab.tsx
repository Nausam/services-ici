// components/HomeInfoTab.tsx
import React from "react";

type ScheduleItem = {
  date: string; // e.g. "2025-09-08"
  day?: string; // e.g. "Mon"
  time: string; // e.g. "08:30 – 10:30"
  title: string; // e.g. "Opening & Registration"
  location?: string;
};

type Island = {
  name: string;
  imgSrc: string; // put your real image paths here
};

const schedule: ScheduleItem[] = [
  // TODO: Replace with real dates/times
  {
    date: "2025-09-08",
    day: "Mon",
    time: "08:30 – 10:30",
    title: "Opening & Registration",
    location: "Main Hall",
  },
  {
    date: "2025-09-08",
    day: "Mon",
    time: "11:00 – 13:00",
    title: "Preliminary Round A",
    location: "Hall A",
  },
  {
    date: "2025-09-09",
    day: "Tue",
    time: "09:00 – 12:00",
    title: "Preliminary Round B",
    location: "Hall B",
  },
  {
    date: "2025-09-10",
    day: "Wed",
    time: "14:00 – 16:00",
    title: "Semi-Finals",
    location: "Main Hall",
  },
  {
    date: "2025-09-11",
    day: "Thu",
    time: "20:30 – 22:00",
    title: "Finals & Awarding",
    location: "Main Hall",
  },
];

const islands: Island[] = [
  { name: "Alifushi", imgSrc: "/assets/islands/alifushi.jpg" },
  { name: "Angolhitheemu", imgSrc: "/assets/islands/angolhitheemu.jpg" },
  { name: "Dhuvaafaru", imgSrc: "/assets/islands/dhuvaafaru.jpg" },
  { name: "Hulhudhuffaaru", imgSrc: "/assets/islands/hulhudhuffaaru.jpg" },
  { name: "Inguraidhoo", imgSrc: "/assets/islands/inguraidhoo.jpg" },
  { name: "Innamaadhoo", imgSrc: "/assets/islands/innamaadhoo.jpg" },
  { name: "Maakurathu", imgSrc: "/assets/islands/maakurathu.jpg" },
  { name: "Rasgetheemu", imgSrc: "/assets/islands/rasgetheemu.jpg" },
  { name: "Rasmaadhoo", imgSrc: "/assets/islands/rasmaadhoo.jpg" },
  { name: "Ungoofaaru", imgSrc: "/assets/islands/ungoofaaru.jpg" },
  { name: "Vaadhoo", imgSrc: "/assets/islands/vaadhoo.jpg" },
];

export default function HomeInfoTab() {
  return (
    <section className="w-full py-10 mt-[100px]">
      <div className="mx-auto max-w-5xl px-4 space-y-6">
        {/* Intro */}
        <div className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-muted">
          <h2 className="mb-2 text-2xl md:text-3xl font-semibold font-dhivehi text-center">
            ރާ އަތޮޅު ޤުރުއާން މައުލޫމާތް
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-muted-foreground text-center">
            Welcome to the information hub for the{" "}
            <strong>Raa Atoll Quran Competition</strong>. Here you’ll find the
            event introduction, schedule, and participating islands. (Update
            this text with your official wording.)
          </p>
        </div>

        {/* Schedule */}
        <div className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-muted">
          <h3 className="mb-4 text-xl font-semibold font-dhivehi text-center">
            ސެކިއުލް (Schedule)
          </h3>

          {/* Mobile-friendly list, table-like on md+ */}
          <div className="grid gap-3 md:gap-2">
            <div className="hidden md:grid grid-cols-12 items-center rounded-lg bg-muted/40 px-3 py-2 text-sm font-medium">
              <div className="col-span-3">Date</div>
              <div className="col-span-3">Time</div>
              <div className="col-span-4">Event</div>
              <div className="col-span-2">Location</div>
            </div>

            {schedule.map((s, idx) => (
              <div
                key={`${s.date}-${idx}`}
                className="grid grid-cols-1 gap-1 rounded-xl border px-3 py-3 md:grid-cols-12 md:items-center md:gap-2 md:border-0 md:border-b md:rounded-none"
              >
                <div className="text-sm md:col-span-3">
                  <div className="font-medium">
                    {s.date}
                    {s.day ? ` • ${s.day}` : ""}
                  </div>
                </div>
                <div className="text-sm md:col-span-3">{s.time}</div>
                <div className="text-sm md:col-span-4 font-medium">
                  {s.title}
                </div>
                <div className="text-sm md:col-span-2 text-muted-foreground">
                  {s.location ?? "-"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participating islands */}
        <div className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-muted">
          <h3 className="mb-4 text-xl font-semibold font-dhivehi text-center">
            ބައިވެރިވެފައިވާ ރަށްތައް
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {islands.map((isl) => (
              <figure
                key={isl.name}
                className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-muted"
              >
                <img
                  src={isl.imgSrc}
                  alt={isl.name}
                  className="h-28 w-full object-cover md:h-36"
                />
                <figcaption className="px-3 py-2 text-center text-sm font-medium">
                  {isl.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
