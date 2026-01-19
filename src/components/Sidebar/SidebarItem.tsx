// src/components/Sidebar/SidebarItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

export default function SidebarItem({
  to,
  icon,
  label,
  collapsed,
}: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center transition-all duration-300 ease-in-out",
          isActive
            ? "bg-purple-100 text-purple-700 font-semibold"
            : "text-gray-600 hover:bg-purple-50",
          // se estiver colapsado, centraliza o ícone e remove padding horizontal
          collapsed ? "justify-center px-0 py-3" : "justify-start px-4 py-3",
        ].join(" ")
      }
    >
      {/* wrapper fixo para o ícone, evita que encolha */}
      <div className="w-6 h-6 flex-shrink-0">{icon}</div>

      {/* texto some via opacidade e largura zero para não ocupar espaço */}
      <span
        className={[
          "ml-3 whitespace-nowrap transition-all duration-300 ease-in-out",
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
        ].join(" ")}
      >
        {label}
      </span>
    </NavLink>
  );
}
