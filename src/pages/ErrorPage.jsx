import React from "react";
import { useNavigate,  } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Сторінку не знайдено</h1>
      <p>Щось пішло не так!</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
};

export default ErrorPage;