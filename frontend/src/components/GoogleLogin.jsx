import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const GoogleLogin = ({ setToken }) => {
    const navigate = useNavigate();
  const googleBtnRef = useRef(null);

 useEffect(() => {
  const handleResponse = async (response) => {
    try {
      const res = await axios.post(`${API}/api/auth/google`, {
        token: response.credential,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const loadGoogle = () => {
    if (!window.google || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleResponse,
    });

    window.google.accounts.id.renderButton(
      googleBtnRef.current,
      { theme: "outline", size: "large" }
    );
  };

  const timeout = setTimeout(loadGoogle, 500);
  return () => clearTimeout(timeout);
}, []);


  return <div  ref={googleBtnRef}></div>;
};

export default GoogleLogin;