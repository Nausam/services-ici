import React from "react";
import ServiceTable from "@/components/admin/ServiceTable";
import QuranCompetitionTable from "@/components/quran-competition/QuranCompetitionTable";

const Admin = () => {
  return (
    <section className="h-screen p-8 container mx-auto">
      <div className="mt-8">
        {/* <div>
          <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
            ރެޖިސްޓްރޭޝަންސް
          </h2>
          <ServiceTable />
        </div> */}

        <div className="mt-10">
          <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
            ޤުރުއާން މުބާރާތުގެ ބައިވެރިން
          </h2>

          <QuranCompetitionTable />
        </div>
      </div>
    </section>
  );
};

export default Admin;
