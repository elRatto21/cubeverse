"use client";

import * as React from "react";
import {
  BookOpenIcon,
  BoxIcon,
  ChartLineIcon,
  MessageCircleIcon,
  Repeat2Icon,
  SwordsIcon,
  TimerIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavNotifications from "./nav-notifications";

const data = {
  playItems: [
    {
      title: "Timer",
      url: "timer",
      icon: TimerIcon,
    },
    {
      title: "1vs1",
      url: "battle",
      icon: SwordsIcon,
    },
    {
      title: "Train",
      url: "train",
      icon: Repeat2Icon,
    },
    {
      title: "Learn",
      url: "learn",
      icon: BookOpenIcon,
    }
  ],
  socialItems: [
    {
      title: "Chat",
      url: "chat",
      icon: MessageCircleIcon,
    },
    {
      title: "Friends",
      url: "friends",
      icon: UsersIcon,
    },
    {
      title: "Profile",
      url: "profile",
      icon: UserIcon,
    },
    {
        title: "Stats",
        url: "stats",
        icon: ChartLineIcon
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} className="shadow-md select-none">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton size="lg" asChild className="w-fit">
              <a href="">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-600 text-sidebar-primary-foreground">
                  <BoxIcon className="size-6" />
                </div>
                <div className="grid flex-1 text-left ml-1 text-xl leading-tight">
                  <span className="truncate font-superbold text-purple-600">
                    cubeverse
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
            <NavNotifications />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Play" items={data.playItems} />
        <NavMain title="Social" items={data.socialItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
