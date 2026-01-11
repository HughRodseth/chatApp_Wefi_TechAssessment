import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const from =
        (location.state as { from?: string } | null)?.from ?? "/channels";

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            await login(userName, password);
            toast.success("Login successful!");
            navigate(from, { replace: true });
        } catch (err: any) {
            toast.error("Login failed - Invalid Username or Password");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4 }}>
                        Username
                    </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                        required
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4 }}>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                    />
                </div>

                <button type="submit" disabled={submitting} style={{ width: "100%" }}>
                    {submitting ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: 16 }}>
                Don&'t have an account?{" "}
                <Link to="/signup">Sign up here</Link>
            </p>
        </div>
    );
}
