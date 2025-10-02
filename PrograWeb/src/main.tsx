import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "./LoginPage";   // ✅ Importa el componente correcto

import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { HashRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
