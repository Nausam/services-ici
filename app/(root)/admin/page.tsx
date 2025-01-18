import React from "react";
import ServiceTable from "@/components/admin/ServiceTable";

const Admin = () => {
  return (
    <section className="min-h-scren p-8 container mx-auto">
      <div className="mt-8">
        <div>
          <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
            ރެޖިސްޓްރޭޝަންސް
          </h2>
          <ServiceTable />
        </div>

        {/* <div className="mt-10">
          <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
            ސާވިސް ރިކުއެސްޓްސް
          </h2>
        </div> */}
      </div>
    </section>
  );
};

export default Admin;
