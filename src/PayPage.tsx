import React from "react";
import { useNavigate } from "react-router-dom";

const PayPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#ffffffff", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">

        <div className="container-fluid">
          <button
            className="navbar-brand d-flex align-items-center"
            onClick={() => navigate("/feed")}
            style={{ border: "none", background: "transparent" }}
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

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Resumen del pedido</h3>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Cuenta</label>
                  <div className="form-control-plaintext">Progra</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Total</label>
                  <div className="form-control-plaintext text-success">PEN 15.45</div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Monedas</label>
                  <div className="form-control-plaintext text-primary">350</div>
                </div>

                <h5 className="mb-3">Método de pago</h5>
                <form>
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">Número de tarjeta</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cardHolder" className="form-label">Nombre del titular</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardHolder"
                      placeholder="Eber Ebemol"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expiryDate" className="form-label">Fecha cad. (MM/YY)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="expiryDate"
                        placeholder="10/29"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cvv" className="form-label">Código de seguridad (CVV)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cvv"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <p className="form-text text-muted">
                    Tu método de pago no será cargado hasta que se realice el pedido. Si no deseas vincularlo, puedes desmarcar la casilla correspondiente en la página de métodos de pago.
                  </p>

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary fw-bold">
                      Pagar ahora
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-outline-secondary" onClick={() => navigate("/shop")}>
                Volver a la tienda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPage;