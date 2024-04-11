import AddMenu from "./components/Menu/AddMenu";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Login from "./components/Sign-in/up/Login";
import { Route, Routes, Outlet } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Show Login component on initial route */}
      <Route
        path="/"
        element={
          <Layout>
            <Outlet /> {/* Render children components within Layout */}
          </Layout>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<AddMenu />} />
        <Route path="/customers" element="" /> {/* Element for customers route */}
        <Route path="/report" element="" /> {/* Element for report route */}
        <Route path="/inventory" element="" /> {/* Element for inventory route */}
        <Route path="/settings" element="" /> {/* Element for settings route */}
      </Route>
    </Routes>
  );
}

