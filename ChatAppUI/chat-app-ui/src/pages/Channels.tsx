import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Channel } from "../api/client";
import toast from "react-hot-toast";

export function ChannelListPage() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);

    const loadChannels = async () => {
        setLoading(true);
        try {
            const list = await api.listChannels();
            setChannels(list);
        } catch (err: any) {
            toast.error("Failed to load channels");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadChannels();
    }, []);

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!newName.trim()) {
            return;
        }
        setCreating(true);
        try {
            await api.createChannel(newName.trim());
            toast.success("Channel created successfully");
            setNewName("");
            await loadChannels();
        } catch (err: any) {
            toast.error("Failed to create channel");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "20px auto" }}>
            <h2>Channels</h2>

            {loading ? (
                <div>Loading channels...</div>
            ) : channels.length === 0 ? (
                <div>No channels yet. Create the first one!</div>
            ) : (
                <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 24 }}>
                    {channels.map((channel) => (
                        <li
                            key={channel.id}
                            style={{
                                padding: "8px 0",
                                borderBottom: "1px solid #eee",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Link to={`/channels/${channel.id}`}>{channel.name}</Link>
                            <span style={{ fontSize: "0.8rem", color: "#666" }}>
                                Started by: {channel.user.userName || channel.user.displayName}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <h3>Create a new channel</h3>
            <form onSubmit={handleCreate}>
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        type="text"
                        placeholder="Channel name"
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                        required
                        style={{ flex: 1, padding: 8, boxSizing: "border-box" }}
                    />
                    <button type="submit" disabled={creating}>
                        {creating ? "Creating..." : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
