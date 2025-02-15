import React from "react";
import ServiceTable from "@/components/admin/ServiceTable";
import QuranCompetitionTable from "@/components/quran-competition/QuranCompetitionTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import HomeCardForm from "@/components/admin/home-cards/HomeCardForm";

const Admin = () => {
  return (
    <section className="h-full p-8 container mx-auto">
      <div className="mt-8">
        <div className="flex items-center justify-center w-full mt-10">
          <Tabs
            dir="rtl"
            defaultValue="admin"
            className="flex flex-col items-center justify-center w-full"
          >
            <TabsList>
              <TabsTrigger value="admin" className="font-dhivehi text-2xl">
                އެޑްމިން
              </TabsTrigger>
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
              <ServiceTable />
            </TabsContent>
            <TabsContent value="quran-competition" className="w-full">
              <QuranCompetitionTable />
            </TabsContent>

            <TabsContent value="admin" className="w-full mt-5">
              {/* <HomeCardForm entityType="Competitions" type="Create" /> */}
              <Tabs
                dir="rtl"
                defaultValue="services"
                className="flex flex-col items-center justify-center w-full"
              >
                <TabsList>
                  <TabsTrigger
                    value="services"
                    className="font-dhivehi text-2xl"
                  >
                    ހޯމް ކާޑްސް
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="w-full">
                  <HomeCardForm type="Create" />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Admin;
