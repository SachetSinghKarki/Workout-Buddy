import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useAuthContext } from "./Hooks/UseAuthContext";
import { Toaster } from "react-hot-toast";  // ✅ Import Toaster
import Home from "./Routes/Home.jsx/Home";
import Layout from "./Components/Layout/Layout";
import Login from "./Routes/Login/Login";
import Signup from "./Routes/Signup/Signup";

const App = () => {
  const { user, loading } = useAuthContext();  // Ensure loading state is handled

  if (loading) {
    return <div>Loading...</div>;  // Prevent unnecessary redirects before user is loaded
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: user ? <Home /> : <Navigate to="/login" />,
          // element:<Home/>
        },
        {
          path: "/login",
          element: !user ? <Login /> : <Navigate to="/" />,
          // element:<Login/>
        },
        {
          path: "/signup",
          element: !user ? <Signup /> : <Navigate to="/" />,
          // element:<Signup/>
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />  {/* ✅ Toaster added */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
