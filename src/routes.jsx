import { createBrowserRouter } from "react-router";
import Login from "./pages/admin/Login";
import DashboardLayout from "./pages/admin/dashboard/DashboardLayout";

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
        element: <h1>Tag</h1>
      },
    ],
  },
]);
