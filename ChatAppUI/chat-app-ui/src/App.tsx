import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { ChannelListPage } from "./pages/Channels";
import { ChannelPage } from "./pages/Channel";
import { Toaster } from "react-hot-toast";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "8px 16px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        {user && (
          <Link to="/channels" style={{ marginRight: 16 }}>
            Channels
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: 16 }}>
              Logged in as <strong>{user.userName}</strong>
            </span>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 8 }}>
              Login
            </Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "0.95rem",
            },

            // Success toast
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "white",
              },
              style: {
                background: "#1f2937",
                color: "#d1fae5",
              },
            },

            // Error toast
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "white",
              },
              style: {
                background: "#7f1d1d",
                color: "#fee2e2",
              },
            },
          }}
        />
        <NavBar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/channels" element={<ChannelListPage />} />
            <Route path="/channels/:channelId" element={<ChannelPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/channels" replace />} />
          <Route path="*" element={<Navigate to="/channels" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
