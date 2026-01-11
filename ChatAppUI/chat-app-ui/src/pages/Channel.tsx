// src/pages/ChannelPage.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Channel, Message } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export function ChannelPage() {
    const { channelId } = useParams<{ channelId: string }>();
    const { user } = useAuth();

    const [channel, setChannel] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [joining, setJoining] = useState(false);

    if (!channelId) {
        return <div>Invalid channel id.</div>;
    }

    const channelIdNum = Number(channelId);

    useEffect(() => {
        let active = true;

        async function load() {
            if (!user) return;
            setLoading(true);

            try {
                const channels = await api.listChannels();
                const activeChannel = channels.find((c) => c.id === channelIdNum) ?? null;
                if (!activeChannel) {
                    throw new Error("Channel not found");
                }

                const memberOfChannel = await api.listChannelMembers({
                    channelId: channelIdNum,
                    userId: user.userId,
                });
                const isMember = memberOfChannel.length > 0;

                const channelMessages = await api.listMessages(channelIdNum);

                if (!active) {
                    return;
                }

                setChannel(activeChannel);
                setIsMember(isMember);
                setMessages(channelMessages);
            } catch (err: any) {
                toast.error("Failed to load channel data");
                if (!active) {
                    return;
                }
            } finally {
                setLoading(false);
                if (!active) {
                    return;
                }

            }
        }

        void load();

        return () => {
            active = false;
        };
    }, [channelIdNum, user]);

    // Poll for new messages.
    useEffect(() => {
        let cancelled = false;

        async function poll() {
            if (!channelIdNum) {
                return;
            }

            try {
                setLoadingMessages(true);
                const messages = await api.listMessages(channelIdNum);
                if (!cancelled) {
                    setMessages(messages);
                }
            } catch {
                // ignore polling errors
            } finally {
                if (!cancelled) {
                    setLoadingMessages(false);
                }
            }
        }

        void poll();

        const id = window.setInterval(() => {
            void poll();
        }, 5000); // every 5 seconds

        return () => {
            cancelled = true;
            window.clearInterval(id);
        };
    }, [channelIdNum]);

    const handleJoin = async () => {
        if (joining) {
            return;
        }
        setJoining(true);
        try {
            await api.joinChannel(channelIdNum);
            setIsMember(true);
        } catch (err: any) {
            toast.error("Failed to join channel");
        } finally {
            setJoining(false);
        }
    };

    const handleSend = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isMember) {
            return;
        }
        const trimmed = text.trim();
        if (!trimmed) {
            return;
        }

        setSending(true);
        try {
            const messageResponse = await api.createMessage(channelIdNum, trimmed);
            setMessages((prev) => [...prev, messageResponse]);
            setText("");
        } catch (err: any) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <div>Loading channel...</div>;
    }

    if (!channel) {
        return <div>Channel not found.</div>;
    }

    return (
        <div style={{ maxWidth: 800, margin: "20px auto" }}>
            <h2>Channel: {channel.name}</h2>

            {!isMember && (
                <div
                    style={{
                        padding: 12,
                        marginBottom: 16,
                        border: "1px solid #646cff",
                        borderRadius: 4,
                    }}
                >
                    <strong>You must join this channel before you can post.</strong>
                    <br />
                    <br />
                    <button type="button" onClick={handleJoin} disabled={joining} >
                        {joining ? "Joining..." : "Join channel"}
                    </button>
                </div>
            )}

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    padding: 8,
                    height: 400,
                    overflowY: "auto",
                    marginBottom: 8,
                    backgroundColor: "#fafafa",
                }}
            >
                {messages.length === 0 ? (
                    <div style={{
                        color: "#777",
                        border: "1px solid #646cff",
                        borderRadius: 4,
                        padding: 8,
                    }}>
                        {loadingMessages ? "Loading messages..." : "No messages yet."}
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            style={{
                                marginBottom: 8,
                                padding: 6,
                                color: "#646464",
                                border: "1px solid #646cff",
                                borderRadius: 4,
                            }}
                        >
                            <div style={{
                                fontSize: "0.75rem",
                                color: "#888",
                                marginTop: 2,
                            }}>
                                {message.user.displayName || message.user.userName}
                            </div>
                            <div><strong>{message.body}</strong></div>
                            {message.createdAt && (
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#888",
                                        marginTop: 2,
                                    }}
                                >
                                    {new Date(message.createdAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={!isMember || sending}
                    placeholder={
                        isMember
                            ? "Type your message..."
                            : "Join this channel to start chatting"
                    }
                    style={{ flex: 1, padding: 8, boxSizing: "border-box" }}
                />
                <button
                    type="submit"
                    disabled={!isMember || sending}
                    style={{ padding: "0 16px" }}
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
}
