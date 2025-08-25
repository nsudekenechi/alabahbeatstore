import { createBrowserRouter } from "react-router";
import Login from "./pages/admin/Login";
import DashboardLayout from "./pages/admin/dashboard/DashboardLayout";
import Tag from "./pages/admin/dashboard/Tag";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <h1>Hello</h1>,
      },
      {
        path: "tag",
        element: <Tag/>
      },
    ],
  },
]);
