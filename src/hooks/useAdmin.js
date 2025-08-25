import { useState } from "react";
import { deleteData, getData, postData, updateData } from "../api/api";
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

export const useTag = () => {
  const config = {
    headers: {
      Authorization: `Token ${sessionStorage.getItem("admin_token")}`,
    },
  };
  const [isLoading, setisLoading] = useState(false);

  const createTag = async (data) => {
    setisLoading(true);
    try {
      console.log(data);
      const resp = await postData("/admin/tag", data, config);
      return resp.data;
    } catch (err) {
      toast(err.response.data.error, { type: "error" });
      console.error(err.response);
    } finally {
      setTimeout(() => {
        setisLoading(false);
      }, 1000);
    }
  };

  const getTags = async () => {
    setisLoading(true);
    try {
      const resp = await getData("/admin/tag", config);
      return resp.data;
    } catch (err) {
      toast(err.response.data.error, { type: "error" });
      console.error(err.response);
    } finally {
      setisLoading(false);
    }
  };

  const updateTag = async (data, id) => {
    setisLoading(true);
    try {
      const resp = await updateData(`/admin/tag/${id}`, data, config);
      return resp.data;
    } catch (err) {
      toast(err.response.data.error, { type: "error" });
      console.error(err.response);
    } finally {
      setTimeout(() => {
        setisLoading(false);
      }, 1000);
    }
  };

  const deleteTag = async (id) => {
    setisLoading(true);
    try {
      const resp = await deleteData(`/admin/tag/${id}`, config);
      return resp.data;
    } catch (err) {
      toast(err.response.data.error, { type: "error" });
      console.error(err.response);
    } finally {
      setTimeout(() => {
        setisLoading(false);
      }, 1000);
    }
  };
  return { isLoading, createTag, getTags, updateTag, deleteTag };
};
