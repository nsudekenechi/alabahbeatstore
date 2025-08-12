import { useState } from "react";
import { postData } from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = async (data) => {
    setLoading(true);
    try {
      const resp = await postData("/auth/login", data);
      sessionStorage.setItem("admin_token", resp.data.data);
      navigate("/admin/dashboard");
    } catch (err) {
      toast(err.response.data.error, { type: "error" });
      console.error(err.response);
    } finally {
      setLoading(false);
    }
  };
  return { login, loading };
};
