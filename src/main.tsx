import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StreamPage from "./StreamPage";
import Login from "./LoginPage";
import Register from "./Register";
import Us from "./Us";
import Feed from "./FeedPage";
import "bootstrap/dist/css/bootstrap.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import TermsConditions from "./TermsConditions";
import PayPage from "./PayPage";
import Shop from "./Shop";
import GiftPage from "./GiftPage";
import DiscoverLivePage from "./DiscoverLivePage";
import HerramientasPage from "./HerramientaPage"; 

import Configuracion from "./UserSettingsModal";
import Create from "./Create";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/stream" element={<StreamPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/us" element={<Us />} />
        <Route path="/pay" element={<PayPage />} />
        <Route path="/regalos" element={<GiftPage />} />
        <Route path="/viewer" element={<DiscoverLivePage />} />
        <Route path="/herramientas" element={<HerramientasPage />} />
        <Route path="/settings" element={<Configuracion />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);