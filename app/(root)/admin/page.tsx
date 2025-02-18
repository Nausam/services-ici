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
import QuizCompetitionTable from "@/components/quiz-competition/QuizCompetitionTable";
import QuizStatistics from "@/components/quiz-competition/QuizStatistics";

const Admin = () => {
  return (
    <section className="h-screen p-8 container mx-auto">
      <div className="mt-8 h-screen">
        <div className="flex items-center justify-center w-full mt-10">
          <Tabs
            dir="rtl"
            defaultValue="admin"
            className="flex flex-col items-center justify-center w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full h-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto overflow-x-auto whitespace-nowrap">
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

              <TabsTrigger value="quiz" className="font-dhivehi text-2xl">
                ސުވާލު މުބާރާތް
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

            <TabsContent value="quiz" className="w-full">
              {/* <QuizCompetitionTable /> */}
              <QuizStatistics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Admin;
