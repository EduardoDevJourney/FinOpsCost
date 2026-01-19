import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./features/Dashboard/DashboardPage";

import TagLayout from "./layouts/TagLayout";
import TagsPage from "./features/Tags/TagsPage";

import ReportLayout from "./layouts/ReportsLayout";
import ReportsPage from "./features/Reports/ReportsPage";

import { FilterProvider } from "./contexts/FilterContext";

export default function App() {
  return (
    <FilterProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
          </Route>

          <Route path="tags" element={<TagLayout />}>
            <Route index element={<TagsPage />} />
          </Route>

          <Route path="reports" element={<ReportLayout />}>
            <Route index element={<ReportsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FilterProvider>
  );
}
