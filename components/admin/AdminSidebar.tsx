// components/admin/AdminSidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  AlignJustify,
  BookOpen,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Mic2,
  PanelLeft,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

export type AdminSection =
  | "admin"
  | "waste"
  | "quran-competition"
  | "quiz"
  | "bangi-huthuba-competition"
  | "madhaha-competition"
  | "permission";

export type AdminSidebarProps = {
  value: AdminSection;
  onChange: (next: AdminSection) => void;
  className?: string;
};

const ITEMS: { key: AdminSection; label: string; icon: React.ElementType }[] = [
  { key: "admin", label: "އެޑްމިން", icon: LayoutDashboard },
  { key: "waste", label: "ކުނި މެނޭޖްމަންޓް", icon: Trash2 },
  { key: "quran-competition", label: "ޤުރުއާން މުބާރާތް", icon: BookOpen },
  { key: "quiz", label: "ސުވާލު މުބާރާތް", icon: ListChecks },
  {
    key: "bangi-huthuba-competition",
    label: "ބަންގި އަދި ޙުތުބާ",
    icon: Mic2,
  },
  { key: "madhaha-competition", label: "މަދަޙަ މުބާރާތް", icon: AlignJustify },
  { key: "permission", label: "ހުއްދަ ރިކުއެސްޓް", icon: KeyRound },
];

function SidebarInner({
  value,
  onChange,
  onItemSelect,
}: Pick<AdminSidebarProps, "value" | "onChange"> & {
  onItemSelect?: () => void;
}) {
  const activeIndex = useMemo(
    () => ITEMS.findIndex((x) => x.key === value),
    [value]
  );

  return (
    <div
      dir="rtl"
      className="h-full flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white">
          <PanelLeft className="h-5 w-5" />
        </div>
        <span className="font-dhivehi text-2xl font-semibold text-slate-800">
          އެޑްމިން ޑޭޝްބޯޑް
        </span>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-3 flex flex-col gap-1" aria-label="Admin sections">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            const active = i === activeIndex;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onChange(item.key);
                  onItemSelect?.();
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-row-reverse items-center gap-3 w-full rounded-xl px-3 py-2.5 text-right font-dhivehi text-lg font-medium transition-colors",
                  active
                    ? "bg-cyan-600 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-white" : "text-slate-500"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

export default function AdminSidebar({
  value,
  onChange,
  className,
}: AdminSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("lg:w-64 w-full", className)}>
      {/* Desktop */}
      <div className="hidden lg:block h-[calc(100vh-5rem)] sticky top-6 min-h-0">
        <SidebarInner value={value} onChange={onChange} />
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full rounded-xl h-11 font-dhivehi justify-center gap-2 border-slate-200 bg-white hover:bg-slate-50"
            >
              <AlignJustify className="h-4 w-4 shrink-0" />
              <span>މެނޫ</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] p-0" dir="rtl">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Menu</SheetTitle>
              <SheetDescription>Navigate admin sections</SheetDescription>
            </SheetHeader>

            <div className="h-full pt-4">
              <SidebarInner
                value={value}
                onChange={onChange}
                onItemSelect={() => setOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
