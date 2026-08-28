import { notFound } from "next/navigation";
import {
  ArrowDown,
  CalendarClock,
  FilePenLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import HomeCardRegistrationForm from "@/components/home-card/HomeCardRegistrationForm";
import { getHomeCardByLink } from "@/lib/actions/home.actions";

export const dynamic = "force-dynamic";

type HomeCardRouteProps = {
  params: Promise<{ slug: string[] }>;
};

const formatDueDate = (dueDate?: string) => {
  if (!dueDate) return "";

  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Indian/Maldives",
  }).format(date);
};

const HomeCardRoutePage = async ({ params }: HomeCardRouteProps) => {
  const { slug } = await params;
  const card = await getHomeCardByLink(`/${slug.join("/")}`);

  if (!card || card.hidden) notFound();

  const formattedDueDate = formatDueDate(card.dueDate);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf4f3] pb-16 md:pb-24">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[520px] bg-[#073d44]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-28 size-96 rounded-full border-[64px] border-white/[0.025]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-6 size-[420px] rounded-full bg-teal-300/10 blur-3xl"
      />

      <section
        className="relative mx-auto flex max-w-6xl flex-col gap-7 px-3 pb-8 pt-10 sm:px-5 md:gap-9 md:pt-16"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-2 text-teal-50/70">
          <div className="inline-flex items-center gap-2 font-dhivehi text-sm">
            <Sparkles className="size-4 text-amber-300" />
            އިންނަމާދޫ ކައުންސިލް
          </div>
          <div className="hidden items-center gap-2 font-dhivehi text-sm sm:flex">
            <ShieldCheck className="size-4" />
            ރަސްމީ ރަޖިސްޓްރޭޝަން
          </div>
        </div>

        <article className="grid overflow-hidden rounded-[28px] border border-white/15 bg-white shadow-[0_32px_90px_-38px_rgba(0,0,0,0.55)] md:min-h-[430px] md:grid-cols-[0.82fr_1.45fr] md:rounded-[36px]">
          <div className="order-2 flex flex-col justify-center p-6 text-right sm:p-8 md:order-1 md:p-10 lg:p-12">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 font-dhivehi text-sm text-teal-800">
              <FilePenLine className="size-4" />
              އޮންލައިން ފޯމު
            </div>

            <h1 className="font-dhivehi text-3xl font-normal leading-[1.75] text-slate-950 sm:text-4xl lg:text-5xl">
              {card.title}
            </h1>
            <p className="mt-3 font-dhivehi text-base leading-9 text-slate-500 md:text-lg">
              {card.description}
            </p>

            {formattedDueDate && (
              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <CalendarClock className="size-5" />
                </div>
                <div>
                  <p className="font-dhivehi text-xs leading-6 text-amber-700">
                    ފޯމު ހުށަހެޅުމުގެ ސުންގަޑި
                  </p>
                  <p className="font-geist text-sm font-semibold text-slate-800">
                    {formattedDueDate}
                  </p>
                </div>
              </div>
            )}

            <a
              href="#registration-form"
              className="mt-7 inline-flex w-fit items-center gap-2 font-dhivehi text-sm text-teal-700 transition hover:text-teal-900"
            >
              ފޯމްއަށް ދޭ
              <span className="flex size-8 items-center justify-center rounded-full bg-teal-50">
                <ArrowDown className="size-4" />
              </span>
            </a>
          </div>

          <div
            className="relative order-1 min-h-[250px] overflow-hidden bg-cover bg-center md:order-2 md:min-h-full"
            style={{ backgroundImage: `url('${card.image}')` }}
            role="img"
            aria-label={card.title}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#073d44]/40 via-transparent to-white/5 md:bg-gradient-to-l" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent md:hidden" />
          </div>
        </article>

        <div id="registration-form" className="scroll-mt-6">
          <HomeCardRegistrationForm homeCardId={card.$id} />
        </div>
      </section>
    </main>
  );
};

export default HomeCardRoutePage;
