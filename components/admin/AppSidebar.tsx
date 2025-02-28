"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  Package,
  Boxes,
  UserCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "../ui/nav-main";

// This is sample data.
const data = {
  navMain: [
    {
      title: "އެޑްމިން",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "ހޯމް ކާޑް",
          url: "/admin/home-card",
        },
      ],
    },
    {
      title: "ކައުންސިލް ޙިދުމަތްތައް",
      url: "#",
      icon: Calendar,
      isActive: true,
      items: [
        {
          title: "ކުނި މެނޭޖްކުރުން",
          url: "/admin/services/waste-management",
        },
        {
          title: "ހުއްދަ",
          url: "/admin/permissions",
        },
      ],
    },
    {
      title: "ކައުންސިލް މުބާރާތްތައް",
      url: "#",
      icon: Calendar,
      isActive: true,
      items: [
        {
          title: "ޤުރުއާން މުބާރާތް",
          url: "/admin/competitions/quran",
        },
        {
          title: "ސުވާލު މުބާރާތް",
          url: "/admin/competitions/quiz",
        },
        {
          title: "މަދަހަ މުބާރާތް",
          url: "/requests/overtime",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="mt-20 transition-all duration-300 data-[collapsed]:w-0"
      collapsible="icon"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
