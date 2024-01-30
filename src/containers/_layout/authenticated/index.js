import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from '../../../sevices/utils';
import NavigatorBar from '../../../components/Navbar/NavigatorBar';
import "../layout.css";

export function AuthenticatedLayout({ children }) {
  let navigate = useNavigate();
  const [footerYear, setFooterYear] = useState();

  useEffect(() => {
    const d = new Date();
    setFooterYear(d.getFullYear());
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      logout();
      navigate("/");
    }
  }, [sessionStorage.getItem("token")]);

  return (
    <>
      {sessionStorage.getItem("token") ? (
        <div>
          <NavigatorBar />
          <div className="main-cont">{children}</div>
          <footer className="footer">
            <p className="copyright">© Copyright {footerYear} AryApp - Todos los derechos reservados</p>
          </footer>
        </div>
      ) : null}
    </>
  );
}