import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.css";

// --- COMPONENTES ---
import Login from "./LoginPage";
import Register from "./Register";
import Create from "./Create";
import StreamPage from "./StreamPage"; 
import Feed from "./FeedPage";
import TermsConditions from "./TermsConditions";
import Shop from "./Shop";
import Us from "./Us";
import PayPage from "./PayPage";
import GiftPage from "./GiftPage";
import HerramientasPage from "./HerramientaPage"; 
import Configuracion from "./UserSettingsModal"; 

// --- STREAMING ---
import DiscoverLivePage from "./DiscoverLivePage";
import GoLivePage from "./Streamsconfigs"; 
import WatchPage from "./WatchPage";
import GuestPage from "./GuestPage"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rutas Generales */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<Create />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/us" element={<Us />} />
        <Route path="/pay" element={<PayPage />} />
        <Route path="/gifts" element={<GiftPage />} />
        <Route path="/tools" element={<HerramientasPage />} />
        <Route path="/settings" element={<Configuracion />} />
        <Route path="/stream" element={<StreamPage />} />

        {/* STREAM */}
        <Route path="/viewer" element={<DiscoverLivePage />} />
        <Route path="/golive" element={<GoLivePage />} />
        <Route path="/ver/:id" element={<WatchPage />} />
        <Route path="/guest/:id" element={<GuestPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
