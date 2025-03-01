// app/admin/page.tsx

"use client";

import ServiceTable from "@/components/admin/ServiceTable";
import QuranCompetitionTable from "@/components/quran-competition/QuranCompetitionTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeCardForm from "@/components/admin/home-cards/HomeCardForm";
import QuizStatistics from "@/components/quiz-competition/QuizStatistics";
import UploadQuiz from "@/components/quiz-competition/UploadQuiz";
import PermissionRequestsTable from "@/components/permissions/PermissionRequestsTable";
import QuizSubmissionsList from "@/components/quiz-competition/QuizSubmissionList";

export default function AdminPage() {
  return (
    <section className="p-8 container mx-auto">
      <div>
        <Tabs dir="rtl" defaultValue="admin" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full h-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto overflow-x-auto">
            <TabsTrigger value="admin" className="font-dhivehi text-2xl">
              އެޑްމިން
            </TabsTrigger>
            <TabsTrigger
              value="quran-competition"
              className="font-dhivehi text-2xl"
            >
              ޤުރުއާން މުބާރާތް
            </TabsTrigger>
            <TabsTrigger value="competitions" className="font-dhivehi text-2xl">
              ކުނި މެނޭޖްމަންޓް
            </TabsTrigger>
            <TabsTrigger value="quiz" className="font-dhivehi text-2xl">
              ސުވާލު މުބާރާތް
            </TabsTrigger>
            <TabsTrigger value="permission" className="font-dhivehi text-2xl">
              ހުއްދަ ރިކުއެސްޓް
            </TabsTrigger>
          </TabsList>

          <TabsContent value="competitions" className="w-full">
            <ServiceTable />
          </TabsContent>

          <TabsContent value="quran-competition" className="w-full">
            <QuranCompetitionTable />
          </TabsContent>

          <TabsContent value="admin" className="w-full mt-5">
            <Tabs dir="rtl" defaultValue="services" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full h-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto overflow-x-auto">
                <TabsTrigger value="homeCard" className="font-dhivehi text-2xl">
                  ހޯމް ކާޑްސް
                </TabsTrigger>
                <TabsTrigger
                  value="quizQuestion"
                  className="font-dhivehi text-2xl"
                >
                  ސުވާލު އަޕްލޯޑް
                </TabsTrigger>
              </TabsList>

              <TabsContent value="homeCard" className="w-full">
                <HomeCardForm type="Create" />
              </TabsContent>

              <TabsContent value="quizQuestion" className="w-full">
                <UploadQuiz />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="quiz" className="w-full">
            <div>
              <QuizStatistics />
              <QuizSubmissionsList />
            </div>
          </TabsContent>

          <TabsContent value="permission" className="w-full">
            <PermissionRequestsTable />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
