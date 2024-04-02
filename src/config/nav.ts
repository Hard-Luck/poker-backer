import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Dashboard", icon: HomeIcon },
  { href: "/floats", title: "Floats", icon: Cog },
  { href: "/session/new", title: "Add Session", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];
