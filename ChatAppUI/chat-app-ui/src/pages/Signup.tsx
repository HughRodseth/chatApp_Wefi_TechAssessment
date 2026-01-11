import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export function SignupPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            await register(
                userName,
                password,
                displayName || undefined
            );
            toast.success("Account created successfully!");
            navigate("/channels", { replace: true });
        } catch (err: any) {
            toast.error("Signup failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <h2>Sign up</h2>
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
                        Display name (optional)
                    </label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
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
                    {submitting ? "Creating account..." : "Sign up"}
                </button>
            </form>

            <p style={{ marginTop: 16 }}>
                Already have an account?{" "}
                <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}
