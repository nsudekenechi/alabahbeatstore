import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "../../../components/admin/Header";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");
  useEffect(() => {
    if (!user) navigate("/auth/login");
  }, []);
  if (!user) return <></>;
  return (
    <div className="grid md:grid-cols-12 bg-[#fafafa]">
      <Header />
      <div className="md:col-span-11 min-h-screen z-10 md:p-10">
        <Outlet />
      </div>
    </div>
  );
}
