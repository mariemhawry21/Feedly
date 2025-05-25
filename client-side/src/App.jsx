import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import CreatePost from "./views/CreatePost";
import ProtectedRoute from "./components/ProtectedRoute";
import EditPost from "./views/EditPost";
import Layout from "./components/Layout";
import { useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { FilterProvider } from "./contexts/FilterContext";

import LoadingThreeDotsJumping from "./components/Loading";
function App() {
  const { loading } = useAuth();

  if (loading) return <LoadingThreeDotsJumping />;
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<Home />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
