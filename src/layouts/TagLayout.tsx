import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

export default function TagLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((c) => !c);

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="p-4 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
