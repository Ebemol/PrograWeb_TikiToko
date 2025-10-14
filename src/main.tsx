import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StreamPage from "./StreamPage";
import Login from "./LoginPage";
import Register from "./Register";
import Us from "./Us";
import Feed from "./FeedPage";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import TermsConditions from "./TermsConditions";
import PayPage from "./PayPage";
import Shop from "./Shop";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/strem" element={<StreamPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/Us" element={<Us/>}/>
        <Route path="/pay" element={<PayPage/>}/>
      </Routes>
    </HashRouter>
  </StrictMode>
);