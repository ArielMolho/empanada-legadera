import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../layout.css";

export function UnauthenticatedLayout({ children }) {
  let navigate = useNavigate();
  const [footerYear, setFooterYear] = useState();

  useEffect(() => {
    const d = new Date();
    setFooterYear(d.getFullYear());
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/historial");
    }
  }, [sessionStorage.getItem("token")]);

  return (
    <div>
      <div className="main-cont">{children}</div>
      <footer className="footer">
        <p className="copyright">© Copyright {footerYear} AryApp - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}