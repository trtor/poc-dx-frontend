import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppSearchDx } from "./pages/app-index/app";
import { MedSearchPage } from "./pages/medication/med-page";
import { NotFound } from "./pages/not-found/not-found";

function MainRoutes(): JSX.Element {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || ""}>
      <Routes>
        <Route path="/med" element={<MedSearchPage />} />
        <Route path="/" element={<AppSearchDx />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
