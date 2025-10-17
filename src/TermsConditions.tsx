import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const TermsConditions: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("");

  const sections = [
    { id: "relacion", title: "1. Relación con Nosotros" },
    { id: "aceptacion", title: "2. Aceptación de los Términos" },
    { id: "uso", title: "3. Uso del Servicio" },
    { id: "propiedad", title: "4. Propiedad Intelectual" },
    { id: "responsabilidad", title: "5. Responsabilidad y Limitaciones" },
    { id: "cambios", title: "6. Cambios y Actualizaciones" },
  ];

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollY = window.scrollY + 100;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollY && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  return (
    <div style={{ backgroundColor: "#0d0d0d", color: "white", minHeight: "100vh" }}>
      {/* 🔝 Header fijo */}
      <nav
        className="navbar navbar-dark bg-black fixed-top shadow-sm"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-start ps-3">
          <button
            onClick={() => navigate("/feed")}
            className="btn btn-link text-white text-decoration-none p-0"
          >
            <img
              src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
              alt="TikTok Banner"
              width="100"
              height="40"
              className="d-inline-block align-text-top"
            />
          </button>
        </div>
      </nav>

      {/* 📜 Contenido principal */}
      <div className="container-fluid" style={{ paddingTop: "90px" }}>
        <div className="row justify-content-center">
          {/* Sidebar */}
          <div
            className="col-md-3 col-lg-2 d-none d-md-block position-fixed"
            style={{
              top: "80px",
              left: 0,
              height: "calc(100vh - 80px)",
              borderRight: "1px solid rgba(255,255,255,0.1)",
              padding: "25px 15px",
              overflowY: "auto",
              backgroundColor: "#0d0d0d",
            }}
          >
            <ul className="nav flex-column gap-2">
              {sections.map((section) => (
                <li key={section.id} className="nav-item">
                  <button
                    onClick={() => handleScroll(section.id)}
                    className={`btn btn-sm w-100 text-start fw-light ${
                      activeSection === section.id ? "text-highlight" : "text-light"
                    }`}
                    style={{
                      backgroundColor:
                        activeSection === section.id
                          ? "rgba(238, 29, 82, 0.12)"
                          : "transparent",
                      border: "none",
                      borderRadius: "8px",
                      transition: "all 0.25s ease",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLButtonElement).style.backgroundColor =
                        "rgba(255,255,255,0.05)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLButtonElement).style.backgroundColor =
                        activeSection === section.id
                          ? "rgba(238, 29, 82, 0.12)"
                          : "transparent")
                    }
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contenido principal */}
          <div
            className="col-md-9 offset-md-3 col-lg-8 offset-lg-2 px-4 py-5"
            style={{
              minHeight: "100vh",
              lineHeight: "1.8",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.9)",
              maxWidth: "780px",
              margin: "0 auto",
              textAlign: "left",
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}
          >
            {/* Sección 1 */}
            <section id="relacion" className="mb-5" style={{ scrollMarginTop: "100px" }}>
              <h3 className="mb-3 fw-semibold section-title">1. Relación con Nosotros</h3>
              <p className="section-text">
          Bienvenido a TikTok (la “Plataforma”), que es proporcionada por TikTok Pte. Ltd. o una de sus afiliadas (“TikTok” o “nosotros”). 

Usted está leyendo los términos de servicio (los “Términos”), que rigen la relación y que constituyen un acuerdo entre usted y nosotros, además de establecer los términos y condiciones mediante los cuales puede acceder y hacer uso de la Plataforma y de nuestros sitios web, servicios, aplicaciones, productos y contenido relacionado (conjuntamente, los “Servicios”). Nuestros Servicios son prestados para efectos de uso privado y no comercial. Para fines de estos Términos, “usted” y “suyo” significa usted como usuario de los Servicios. 

Los Términos constituyen un acuerdo legalmente vinculante entre usted y nosotros. Por favor, tómese el tiempo para leerlos cuidadosamente. 
              </p>
            </section>

            {/* Sección 2 */}
            <section id="aceptacion" className="mb-5" style={{ scrollMarginTop: "100px" }}>
              <h3 className="mb-3 fw-semibold section-title">2. Aceptación de los Términos</h3>
              <p className="section-text">
                Al utilizar nuestros Servicios, confirma que tiene la capacidad para celebrar un
                contrato vinculante y que acepta cumplir con estos Términos. También reconoce haber
                leído y comprendido nuestra Política de Privacidad y nuestras Normas de la
                Comunidad, que se incorporan por referencia.
              </p>
            </section>

            {/* Sección 3 */}
            <section id="uso" className="mb-5" style={{ scrollMarginTop: "100px" }}>
              <h3 className="mb-3 fw-semibold section-title">3. Uso del Servicio</h3>
              <p className="section-text">
                El Servicio está destinado a uso personal y no comercial. No debe utilizarlo de
                manera que infrinja leyes o derechos de terceros. Cualquier intento de manipular,
                dañar o interferir con el funcionamiento de la plataforma será motivo de suspensión.
              </p>
            </section>

            {/* Sección 4 */}
            <section id="propiedad" className="mb-5" style={{ scrollMarginTop: "100px" }}>
              <h3 className="mb-3 fw-semibold section-title">4. Propiedad Intelectual</h3>
              <p className="section-text">
                Todo el contenido, diseño, código fuente, logotipos y materiales disponibles en la
                plataforma son propiedad exclusiva de TikTok o de sus licenciantes. No se concede
                ningún derecho de reproducción o distribución sin autorización expresa.
              </p>
            </section>

            {/* Sección 5 */}
            <section id="responsabilidad" className="mb-5" style={{ scrollMarginTop: "100px" }}>
              <h3 className="mb-3 fw-semibold section-title">
                5. Responsabilidad y Limitaciones
              </h3>
              <p className="section-text">
                TikTok no garantiza la disponibilidad continua del servicio ni la ausencia de
                errores. El uso de la plataforma se realiza bajo su propio riesgo, y no seremos
                responsables de daños indirectos, incidentales o consecuentes derivados de su uso.
              </p>
            </section>

            {/* Sección 6 */}
            <section id="cambios" className="mb-5" style={{ scrollMarginTop: "100px" }}>
              <h3 className="mb-3 fw-semibold section-title">6. Cambios y Actualizaciones</h3>
              <p className="section-text">
                TikTok puede modificar estos Términos en cualquier momento para reflejar cambios
                legales o mejoras del servicio. Le recomendamos revisar esta página periódicamente.
                El uso continuo de la plataforma tras cualquier cambio constituye aceptación de los
                nuevos Términos.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* ✨ Estilos adicionales */}
      <style>
        {`
          .section-title {
            color: #ffffff;
            font-size: 1.4rem;
            letter-spacing: 0.3px;
            transition: color 0.3s ease;
          }

          .section-text {
            color: rgba(255,255,255,0.85);
            font-weight: 300;
            font-size: 1.05rem;
            line-height: 1.9;
            text-align: justify;
            animation: fadeIn 0.6s ease-in-out;
          }

          .text-highlight {
            color: #EE1D52 !important;
            font-weight: 500 !important;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,0.2);
            border-radius: 3px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255,255,255,0.3);
          }
        `}
      </style>
    </div>
  );
};

export default TermsConditions;
