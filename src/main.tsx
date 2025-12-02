import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

// --- TUS COMPONENTES (Rutas corregidas: están en la raíz de src/) ---
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

// --- STREAMING (Rutas corregidas) ---
import DiscoverLivePage from "./DiscoverLivePage"; // Estaba en ./Pages/
import GoLivePage from "./Streamsconfigs";         // Tu archivo se llama Streamsconfigs.tsx
import WatchPage from "./WatchPage";               // Estaba en ./Pages/

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
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

        {/* --- RUTAS DE STREAMING --- */}
        
        {/* 1. Explorar */}
        <Route path="/viewer" element={<DiscoverLivePage />} />

        {/* 2. Emitir (Apunta a tu archivo Streamsconfigs.tsx) */}
        <Route path="/golive" element={<GoLivePage />} />

        {/* 3. Ver (Esta es la que fallaba, ahora la encuentra bien) */}
        <Route path="/ver/:id" element={<WatchPage />} />

      </Routes>
    </HashRouter>
  </StrictMode>
);