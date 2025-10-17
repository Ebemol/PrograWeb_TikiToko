import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

// --- Componentes de UI Auxiliares ---
const SummaryRow: React.FC<{ label: string; value: string | number; valueColor?: string }> = ({
  label,
  value,
  valueColor = "white",
}) => (
  <div className="d-flex justify-content-between align-items-center mb-2">
    <span className="text-secondary fw-medium">{label}</span>
    <span className="fw-semibold" style={{ color: valueColor }}>
      {value}
    </span>
  </div>
);

const PaymentStatus: React.FC<{ status: "success" | "error"; onReset: () => void }> = ({ status, onReset }) => {
  const isSuccess = status === "success";
  const details = {
    icon: isSuccess ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger",
    title: isSuccess ? "¡Pago completado!" : "¡Oh no, algo salió mal!",
    message: isSuccess
      ? "Tus monedas han sido añadidas a tu cuenta. Gracias por tu compra."
      : "No se pudo procesar tu pago. Por favor, verifica tus datos o intenta con otra tarjeta.",
    buttonText: isSuccess ? "Volver a la tienda" : "Intentar de nuevo",
  };

  const navigate = useNavigate();
  const handleAction = isSuccess ? () => navigate("/shop") : onReset;

  return (
    <div className="text-center p-4 d-flex flex-column align-items-center" style={{ animation: "fadeIn 0.5s" }}>
      <i className={`bi ${details.icon}`} style={{ fontSize: "4rem", marginBottom: "1rem" }}></i>
      <h4 className="fw-bold mb-2">{details.title}</h4>
      <p className="text-secondary mb-4">{details.message}</p>
      <button className="btn btn-outline-light px-4" onClick={handleAction} style={{ borderRadius: "10px" }}>
        {details.buttonText}
      </button>
    </div>
  );
};

// --- Componente Principal ---
const PayPage: React.FC = () => {
  const navigate = useNavigate();

  const orderDetails = {
    username: "Progra",
    totalAmount: 15.45,
    currency: "PEN",
    coins: 350,
  };

  const [cardDetails, setCardDetails] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardDetails.number)) newErrors.number = "Número de tarjeta inválido.";
    if (cardDetails.holder.trim().length < 3) newErrors.holder = "El nombre es muy corto.";
    if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(cardDetails.expiry)) newErrors.expiry = "Formato MM/YY inválido.";
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) newErrors.cvv = "CVV inválido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === "number") value = value.replace(/[^\d]/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
    if (name === "expiry") value = value.replace(/[^\d]/g, "").replace(/(.{2})/, "$1 / ").trim().slice(0, 7);
    if (name === "cvv") value = value.replace(/[^\d]/g, "").slice(0, 4);

    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      setPaymentStatus(isSuccess ? "success" : "error");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
        <div className="container-fluid">
          <button
            className="navbar-brand d-flex align-items-center"
            onClick={() => navigate("/feed")}
            style={{ paddingLeft: "40px", border: "none", background: "transparent" }}
          >
            <img
              src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
              alt="TikTok Banner"
              width="90"
              height="40"
              className="d-inline-block align-text-top"
            />
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div
              className="card border-0 shadow-lg"
              style={{ backgroundColor: "#1a1a1a", borderRadius: "16px", animation: "fadeIn 0.6s", color: "#eaeaea" }}
            >
              <div className="card-body p-4 p-md-5">
                {paymentStatus !== "idle" ? (
                  <PaymentStatus status={paymentStatus} onReset={() => setPaymentStatus("idle")} />
                ) : (
                  <>
                    <h4 className="text-center mb-4 fw-bold text-white">Resumen del pedido</h4>
                    <div className="mb-4 p-3 rounded" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                      <SummaryRow label="Cuenta" value={orderDetails.username} />
                      <SummaryRow label="Monedas a recibir" value={`🪙 ${orderDetails.coins}`} />
                      <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
                      <SummaryRow
                        label="Total a pagar"
                        value={`${orderDetails.currency} ${orderDetails.totalAmount.toFixed(2)}`}
                        valueColor="#28a745"
                      />
                    </div>

                    <h5 className="mb-3 fw-semibold text-white">Método de pago</h5>
                    <form onSubmit={handleSubmit}>
                      {Object.keys(cardDetails).map((key) => (
                        <div key={key} className="mb-3">
                          <div className="input-group">
                            <span className="input-group-text bg-dark border-0 text-secondary">
                              <i
                                className={`bi ${
                                  key === "number"
                                    ? "bi-credit-card"
                                    : key === "holder"
                                    ? "bi-person"
                                    : key === "expiry"
                                    ? "bi-calendar-event"
                                    : "bi-lock"
                                }`}
                              ></i>
                            </span>
                            <input
                              type={key === "cvv" ? "password" : "text"}
                              name={key}
                              value={cardDetails[key as keyof typeof cardDetails]}
                              onChange={handleInputChange}
                              className={`form-control bg-dark text-light border-0 ${errors[key] ? "is-invalid" : ""}`}
                              placeholder={
                                key === "number"
                                  ? "0000 0000 0000 0000"
                                  : key === "holder"
                                  ? "Nombre del Titular"
                                  : key === "expiry"
                                  ? "MM / YY"
                                  : "CVV"
                              }
                            />
                          </div>
                          {errors[key] && <div className="text-danger small mt-1 ms-2">{errors[key]}</div>}
                        </div>
                      ))}

                      <div className="d-grid mt-4">
                        <button type="submit" className="btn fw-semibold py-2 pay-button" disabled={isLoading}>
                          {isLoading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Procesando...</span>
                            </div>
                          ) : (
                            `Confirmar pago (${orderDetails.currency} ${orderDetails.totalAmount.toFixed(2)})`
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {paymentStatus === "idle" && (
              <div className="text-center mt-4">
                <button className="btn btn-link text-secondary" onClick={() => navigate("/shop")}>
                  Volver a la tienda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .form-control { border-radius: 10px !important; }
          .input-group-text { border-radius: 10px 0 0 10px !important; }
          .form-control::placeholder { color: rgba(255,255,255,0.4); }
          .form-control:focus { box-shadow: 0 0 0 0.25rem rgba(238,29,82,0.25); background-color: #2c2c2c !important;}
          .pay-button {
             background-color: #EE1D52; color: white; border: none; border-radius: 10px; transition: all 0.3s ease;
          }
          .pay-button:hover:not(:disabled) { background-color: #ff3468; transform: scale(1.02); }
          .pay-button:disabled { background-color: #555; cursor: not-allowed; }
          .is-invalid { border: 1px solid #dc3545 !important; }
        `}
      </style>
    </div>
  );
};

export default PayPage;
