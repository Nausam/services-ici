// app/host-island/page.tsx
import React from "react";

type OpenHours = {
  open: string;
  close: string;
  days?: string;
};

type Listing = {
  name: string;
  phone?: string;
  hours?: OpenHours;
  note?: string;
};

type CouncilMember = {
  name: string;
  designation: string;
  phone: string;
};

type HealthCentre = {
  name: string;
  reception?: string;
  emergency?: string;
  opd?: OpenHours;
  pharmacy?: OpenHours;
  note?: string;
};

/* -------------------- DATA -------------------- */

const SHOPS: Listing[] = [
  { name: "ތިންނިރު", phone: "7981444" },
  { name: "ހާރޓްމާޓް", phone: "7900245" },
  { name: "ކުރި", phone: "7379465" }, // removed stray "7"
  { name: "ގަހާމާ", phone: "7572677" },
  { name: "ޒީނައިސް", phone: "7664949" },
  { name: "އައި.ބީ.ބީ ޔުޓެންސިލްސް", phone: "7539111" },
];

const RESTAURANTS: Listing[] = [
  { name: "ލަކޯޒާ", phone: "9785919" },
  { name: "ގުޑްކޮފީ", phone: "7933919" },
  { name: "ފަލިދޫ", phone: "9153944" },
  { name: "ފުރޮސްޓީ", phone: "9781995" },
];

const BUGGIES: Listing[] = [
  { name: "އަސްރަފް", phone: "7531332" },
  { name: "މުޙައްމަދު ޝިފާޒް", phone: "7254006" },
  { name: "ޙުސައިން ޒަރީރު", phone: "7900245" },
  { name: "އަޙްމަދު އަޒުމަތު", phone: "9974894" },
  { name: "ޙުސައިން ރީހާން", phone: "7761542" },
];

const COUNCIL: CouncilMember[] = [
  {
    name: "އިމްރާން ޝަރީފް",
    designation: "ކައުންސިލް އެގްޒެކެޓިވް",
    phone: "9122102",
  },
  {
    name: "އާމިނަތު ޝާޒުލީ",
    designation: "އ. ކައުންސިލް އެގްޒެކެޓިވް",
    phone: "9892099",
  },
];

const HEALTH_CENTRE: HealthCentre = {
  name: "ސިއްޙީ މަރުކަޒު",
  reception: "9948570", // އާމިނަތު ސުނާ
};

/* -------------------- UI HELPERS -------------------- */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className="border-b border-gray-200 px-5 py-3">
        <h2 className="font-dhivehi text-2xl font-semibold text-right">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

/** RTL table where columns are declared in intended RTL order.
 *  The last column can be phone numbers (shown LTR but positioned last).
 */
function InfoTable({
  columns,
  rows,
  lastColumnIsPhone = true,
}: {
  columns: string[]; // e.g. ["ނަން","މަގާމް","ފޯނު"]
  rows: React.ReactNode[][]; // each row length must match columns length
  lastColumnIsPhone?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table
        className="min-w-full table-fixed border-separate border-spacing-0"
        dir="rtl"
      >
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c, i) => (
              <th
                key={i} // ✅ use index to avoid duplicate key error
                className={`px-3 py-2 text-right text-[15px] font-dhivehi font-medium ${
                  i === columns.length - 1 ? "w-40" : ""
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((cells, r) => (
            <tr key={r} className={r % 2 ? "bg-white" : "bg-gray-50/60"}>
              {cells.map((cell, i) => (
                <td
                  key={i}
                  className={`px-3 py-2 align-middle text-right font-dhivehi text-lg text-gray-600 ${
                    i === cells.length - 1 && lastColumnIsPhone
                      ? "text-left"
                      : "text-right"
                  }`}
                >
                  {/* If phone column: render LTR + tabular numbers for neat alignment */}
                  {i === cells.length - 1 && lastColumnIsPhone ? (
                    <span dir="ltr" className="tabular-nums tracking-wide">
                      {cell}
                    </span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------- PAGE -------------------- */

export default function HostIslandInfoPage() {
  return (
    <div className="w-full bg-white py-10 mt-[100px]" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 space-y-8">
        {/* Health Centre */}
        <SectionCard title="ސިއްޙީ މަރުކަޒު">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
              <div className="font-dhivehi text-lg font-semibold">
                {HEALTH_CENTRE.name}
              </div>
              <div className="mt-2 text-sm">
                <span dir="ltr" className="font-dhivehi text-lg text-gray-600">
                  {HEALTH_CENTRE.reception ?? "—"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                <div className="font-dhivehi text-lg font-semibold">
                  ފާރމަސީ
                </div>
                <div className="mt-1 text-sm">
                  <span
                    dir="ltr"
                    className="font-dhivehi text-lg text-gray-600"
                  >
                    7706783
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Council */}
        <SectionCard title="ކައުންސިލް">
          <InfoTable
            columns={["", "", ""]}
            rows={COUNCIL.map((m) => [m.name, m.designation, m.phone])}
          />
        </SectionCard>

        {/* Shops */}
        <SectionCard title="ފިހާރަ">
          <InfoTable
            columns={["", ""]}
            rows={SHOPS.map((s) => [s.name, s.phone ?? "—"])}
          />
        </SectionCard>

        {/* Restaurants */}
        <SectionCard title="ކެފޭ / ރެސްޓޯރެންޓް">
          <InfoTable
            columns={["", ""]}
            rows={RESTAURANTS.map((r) => [r.name, r.phone ?? "—"])}
          />
        </SectionCard>

        {/* Buggies */}
        <SectionCard title="ބަގީ ސާރވިސް">
          <InfoTable
            columns={["", ""]}
            rows={BUGGIES.map((b) => [b.name, b.phone ?? "—"])}
          />
        </SectionCard>
      </div>
    </div>
  );
}
