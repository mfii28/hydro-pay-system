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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart,
  FileText,
  Home,
  PiggyBank,
  Settings,
  Users,
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
    <Sidebar className="border-r border-border/40">
      <div className="flex h-16 items-center border-b border-border/40 px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-xl text-water-600">WaterBill</span>
        </Link>
        <SidebarTrigger className="ml-auto md:hidden" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-colors duration-200 hover:bg-accent/50 ${
                      location.pathname === item.path
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">{item.title}</span>
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