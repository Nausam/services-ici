// app/admin/page.tsx
"use client";

import AdminSidebar, {
  type AdminSection,
} from "@/components/admin/AdminSidebar";
import { useState } from "react";

import HomeCardForm from "@/components/admin/home-cards/HomeCardForm";
import ServiceTable from "@/components/admin/ServiceTable";
import BangiHuthubaCompetitionDashboard from "@/components/huthuba-bangi-competition/BangiHuthubaCompetitionDashboard";
import MadhahaCompetitionDashboard from "@/components/madhaha-competition/MadhahaCompetitionDashboard";
import PermissionRequestsTable from "@/components/permissions/PermissionRequestsTable";
import QuizStatistics from "@/components/quiz-competition/QuizStatistics";
import QuizSubmissionsList from "@/components/quiz-competition/QuizSubmissionList";
import UploadQuiz from "@/components/quiz-competition/UploadQuiz";
import QuranCompetitionTable from "@/components/quran-competition/QuranCompetitionTable";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>("admin");

  return (
    <section className="container mx-auto px-4 md:px-6 py-6">
      <div className="grid grid-cols-1 lg:[grid-template-columns:1fr_18rem] gap-6">
        {/* Sidebar */}
        <AdminSidebar
          value={section}
          onChange={setSection}
          className="lg:order-2"
        />

        {/* Content */}
        <div dir="rtl" className="min-h-[70vh]">
          {section === "admin" && (
            <Card className="border-0 shadow-none ring-0 bg-transparent">
              <CardContent className="p-4 md:p-6">
                <Tabs dir="rtl" defaultValue="homeCard" className="w-full">
                  <TabsList className="grid grid-cols-2 gap-2 w-full md:w-[460px] mx-auto">
                    <TabsTrigger
                      value="homeCard"
                      className="font-dhivehi text-xl"
                    >
                      ހޯމް ކާޑްސް
                    </TabsTrigger>
                    <TabsTrigger
                      value="quizQuestion"
                      className="font-dhivehi text-xl"
                    >
                      ސުވާލު އަޕްލޯޑް
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="homeCard" className="w-full mt-5">
                    <HomeCardForm type="Create" />
                  </TabsContent>

                  <TabsContent value="quizQuestion" className="w-full mt-5">
                    <UploadQuiz />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {section === "waste" && (
            <Card className="border-0 shadow-none ring-0 bg-transparent">
              <CardContent className="p-0">
                <ServiceTable />
              </CardContent>
            </Card>
          )}

          {section === "quran-competition" && (
            <Card className="border-0 shadow-none ring-0 bg-transparent">
              <CardContent className="p-0">
                <QuranCompetitionTable />
              </CardContent>
            </Card>
          )}

          {section === "quiz" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-none ring-0 bg-transparent">
                <CardContent className="p-4 md:p-6">
                  <QuizStatistics />
                </CardContent>
              </Card>
              <Card className="rounded-2xl ring-1 ring-border">
                <CardContent className="p-0">
                  <QuizSubmissionsList />
                </CardContent>
              </Card>
            </div>
          )}

          {section === "bangi-huthuba-competition" && (
            <Card className="border-0 shadow-none ring-0 bg-transparent">
              <CardContent className="p-0">
                <BangiHuthubaCompetitionDashboard />
              </CardContent>
            </Card>
          )}

          {section === "madhaha-competition" && (
            <Card className="rborder-0 shadow-none ring-0 bg-transparent">
              <CardContent className="p-0">
                <MadhahaCompetitionDashboard />
              </CardContent>
            </Card>
          )}

          {section === "permission" && (
            <Card className="border-0 shadow-none ring-0 bg-transparent">
              <CardContent className="p-0">
                <PermissionRequestsTable />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
