import React from "react";
import ServiceTable from "@/components/admin/ServiceTable";
import QuranCompetitionTable from "@/components/quran-competition/QuranCompetitionTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <section className="h-full p-8 container mx-auto">
      <div className="mt-8">
        <div className="flex items-center justify-center w-full mt-10">
          <Tabs
            dir="rtl"
            defaultValue="quran-competition"
            className="flex flex-col items-center justify-center w-full"
          >
            <TabsList>
              <TabsTrigger
                value="quran-competition"
                className="font-dhivehi text-2xl"
              >
                ޤުރުއާން މުބާރާތް
              </TabsTrigger>
              <TabsTrigger
                value="competitions"
                className="font-dhivehi text-2xl"
              >
                ކުނި މެނޭޖްމަންޓް
              </TabsTrigger>
            </TabsList>
            <TabsContent value="competitions" className="w-full">
              {" "}
              <ServiceTable />
            </TabsContent>
            <TabsContent value="quran-competition" className="w-full">
              <QuranCompetitionTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Admin;
