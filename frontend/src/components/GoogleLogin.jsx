import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const GoogleLogin = ({ setToken }) => {
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const handleResponse = async (response) => {
     
      if (!response.credential) {
        console.error("❌ No credential received");
        return;
      }

      try {
        const res = await axios.post(`${API}/api/auth/google`, {
          credential: response.credential,
        });

        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        navigate("/");
      } catch (err) {
        console.error("BACKEND ERROR:", err);
      }
    };

    const loadGoogle = () => {
      if (!window.google || !googleBtnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleResponse,
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
      });
    };

    setTimeout(loadGoogle, 500);
  }, []);

  return <div ref={googleBtnRef}></div>;
};

export default GoogleLogin;