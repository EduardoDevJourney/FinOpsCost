// src/components/Sidebar/Sidebar.tsx
import SidebarItem from "./SidebarItem";
import {
  HiHome,
  HiTag,
  HiChartBar,
  HiUser,
  HiChevronDoubleLeft,
} from "react-icons/hi";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const items = [
    { to: "/", icon: <HiHome className="w-6 h-6" />, label: "Dashboard" },
    { to: "/tags", icon: <HiTag className="w-6 h-6" />, label: "Tags" },
    {
      to: "/reports",
      icon: <HiChartBar className="w-6 h-6" />,
      label: "Reports",
    },
  ];

  return (
    <aside
      className={[
        "bg-white h-full border-r border-gray-100 flex flex-col",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      ].join(" ")}
    >
      <button
        onClick={onToggle}
        className="transition-transform duration-300 ease-in-out self-end mt-1"
      >
        <HiChevronDoubleLeft
          color="#884FD1"
          className={`w-6 h-6 ${collapsed ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      <nav className="flex-1 mt-4">
        {items.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>
      <div className="p-4">
        <SidebarItem
          to="/logout"
          icon={<HiUser className="w-6 h-6" />}
          label="Logout"
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
