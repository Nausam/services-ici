// components/admin/AdminSidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
  PanelsTopLeft,
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
      className="h-full flex flex-col gap-4 p-4 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-xl ring-1 ring-gray-200/50 rounded-3xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-4 border-b border-gray-200/50">
        <div className="inline-flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl shadow-md">
            <PanelsTopLeft className="h-5 w-5 text-white" />
          </div>
          <span className="font-dhivehi text-2xl font-semibold bg-gradient-to-l from-cyan-900 to-teal-800 bg-clip-text text-transparent">
            އެޑްމިން ޑޭޝްބޯޑް
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 px-2 pb-2">
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
                className={cn(
                  "relative group w-full rounded-2xl font-dhivehi text-lg transition-all duration-300 ease-out overflow-hidden",
                  "hover:scale-[1.02] hover:shadow-lg",
                  active
                    ? "bg-gradient-to-l from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/30"
                    : "bg-white/60 hover:bg-white text-gray-700 hover:text-cyan-900 shadow-sm hover:shadow-md"
                )}
              >
                {/* Accent border indicator for active item */}
                {active && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/90 rounded-r-full transition-all duration-500" />
                )}
                
                {/* Hover glow effect */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-l from-cyan-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    active && "opacity-0"
                  )}
                />

                {/* Content */}
                <div className="relative w-full flex flex-row-reverse items-center justify-start gap-3 px-4 py-3 text-right">
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                      active ? "text-white" : "text-cyan-600"
                    )}
                  />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function AdminSidebar({
  value,
  onChange,
  className,
}: AdminSidebarProps) {
  // Control mobile drawer so we can close it after click
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("lg:w-72 w-full", className)}>
      {/* Desktop */}
      <div className="hidden lg:block h-[calc(100vh-4rem)] sticky top-6">
        <SidebarInner value={value} onChange={onChange} />
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full rounded-xl mb-4 flex flex-row-reverse gap-2"
            >
              <span className="font-dhivehi text-xl">މެނޫ</span>
              <AlignJustify className="h-4 w-4 shrink-0" />
            </Button>
          </SheetTrigger>

          {/* Add title/description to satisfy Radix a11y */}
          <SheetContent side="right" className="w-[320px]" dir="rtl">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Menu</SheetTitle>
              <SheetDescription>Navigate admin sections</SheetDescription>
            </SheetHeader>

            <div className="pt-6 h-full">
              <SidebarInner
                value={value}
                onChange={onChange}
                onItemSelect={() => setOpen(false)} // close after selecting
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
