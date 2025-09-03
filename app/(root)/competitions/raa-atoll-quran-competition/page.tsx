import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeInfoTab from "@/components/AtollQuranCompetition/HomeInfoTab";
import SchedulePage from "@/components/AtollQuranCompetition/Schedule";
import MealsPage from "@/components/AtollQuranCompetition/MealsPage";
import HostIslandInfoPage from "@/components/AtollQuranCompetition/HostIslandInfoPage";
import JudgesPage from "@/components/AtollQuranCompetition/JudgesPage";
import Persons from "@/components/AtollQuranCompetition/Persons";
const Page = () => {
  const items = [
    { v: "home", label: "ތަޢާރަފް" },
    { v: "schedule", label: "ޝެޑިއުލް" },
    { v: "judges", label: "ފަނޑިޔާރުން" },
    { v: "eating", label: "ކެއުމުގެ ގަޑިތައް" },
    { v: "phone", label: "ކޯޑިނޭޓަރުން" },
    { v: "innamaadhoo", label: "އިންނަމާދޫގެ މަޢުލޫމާތު" },
  ];

  return (
    <div className="w-full">
      {/* HERO / BANNER */}
      <header
        className="h-40 md:h-60 lg:h-72 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/images/atollQuranBanner.png')",
        }}
      />

      {/* MAIN CONTENT */}
      <main className="bg-white">
        {/* Small overlap effect, but with gap below the image */}
        <div className="relative mt-6 md:mt-8">
          <div className="mx-auto max-w-5xl px-4 pt-6 md:pt-8">
            <Tabs dir="rtl" defaultValue="home" className="w-full">
              {/* TAB BUTTONS */}
              <TabsList
                className="
                  grid w-full max-w-[720px] mx-auto
                  grid-cols-2 gap-2
                  sm:grid-cols-3
                  md:grid-cols-4
                  bg-transparent p-0
                "
              >
                {items.map(({ v, label }, i) => {
                  const centerMd =
                    i === 4
                      ? "md:col-start-2"
                      : i === 5
                      ? "md:col-start-3"
                      : "";
                  return (
                    <TabsTrigger
                      key={v}
                      value={v}
                      className={`${centerMd}
                        w-full justify-center rounded-xl px-3 py-2
                        text-center font-dhivehi text-base md:text-xl
                        whitespace-nowrap shadow-sm
                        data-[state=active]:bg-cyan-700
                        data-[state=active]:text-white
                      `}
                    >
                      {label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* TAB CONTENT */}
              <div className="mt-6">
                <TabsContent value="home" className="w-full">
                  <HomeInfoTab />
                </TabsContent>
                <TabsContent value="schedule" className="w-full">
                  <SchedulePage />
                </TabsContent>
                <TabsContent value="judges" className="w-full">
                  <JudgesPage />
                </TabsContent>
                <TabsContent value="eating" className="w-full">
                  <MealsPage />
                </TabsContent>
                <TabsContent value="phone" className="w-full">
                  <Persons />
                </TabsContent>
                <TabsContent value="innamaadhoo" className="w-full">
                  <HostIslandInfoPage />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
