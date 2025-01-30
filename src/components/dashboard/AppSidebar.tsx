import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart,
  FileText,
  Home,
  PiggyBank,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Manage Customers",
    icon: Users,
    path: "/dashboard/customers",
  },
  {
    title: "Manage Rates",
    icon: Settings,
    path: "/dashboard/rates",
  },
  {
    title: "Generate Bills",
    icon: FileText,
    path: "/dashboard/bills",
  },
  {
    title: "Payments",
    icon: PiggyBank,
    path: "/dashboard/payments",
  },
  {
    title: "Reports",
    icon: BarChart,
    path: "/dashboard/reports",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      location.pathname === item.path
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}