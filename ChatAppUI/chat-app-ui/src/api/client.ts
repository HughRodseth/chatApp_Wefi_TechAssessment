const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:5001";

// The Auth Response object interface.
export interface AuthResponse {
  userId?: string;
  userName?: string;
  displayName?: string;
  bearerToken?: string;
  sessionId?: string;
}

// The Current User object interface.
export interface CurrentUser {
  userId: number;
  userName: string;
  displayName?: string;
}

// The stored auth info object interface.
interface StoredAuth {
  bearerToken?: string;
  userId: number;
  userName: string;
  displayName?: string;
}

// The channel object interface.
export interface Channel {
  id: number;
  name: string;
  createdByUserId: number;
  createdAt?: string;
  user: CurrentUser;
}

// The channel member object interface.
export interface ChannelMember {
  id: number;
  channelId: number;
  userId: number;
  joinedAt?: string;
}

// The message object interface.
export interface Message {
  id: number;
  channelId: number;
  userId: number;
  body: string;
  createdAt?: string;
  user: CurrentUser;
}

// Generic AutoQuery response
export interface QueryResponse<T> {
  offset: number;
  total: number;
  results: T[];
}

const AUTH_STORAGE_KEY = "chatapp_auth";

function saveAuth(auth: StoredAuth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function loadAuth(): StoredAuth | null {
  const rawAuthStorage = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawAuthStorage) return null;
  try {
    return JSON.parse(rawAuthStorage) as StoredAuth;
  } catch {
    return null;
  }
}

function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// Request api helper.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const auth = loadAuth();

  const headers: Record<string, string> = {
    Accept: "application/json",
    // Content type set if request has body
    ...(options.body ? { "Content-Type": "application/json" } : {}),
  };

  // Merges headers passed in options
  if (options.headers && typeof options.headers === "object") {
    Object.entries(options.headers as Record<string, string>).forEach(
      ([key, value]) => {
        headers[key] = value;
      }
    );
  }

  // Supports JWT via BearerToken if available
  if (auth?.bearerToken) {
    headers["Authorization"] = `Bearer ${auth.bearerToken}`;
  }

  const returnedResult = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!returnedResult.ok) {
    const resultToText = await returnedResult.text();

    try {
      const parsedResult = JSON.parse(resultToText);
      const resultMessage =
        parsedResult?.responseStatus?.message ||
        parsedResult?.message ||
        returnedResult.statusText;

      throw new Error(resultMessage);
    } catch {
      throw new Error(resultToText || returnedResult.statusText);
    }
  }

  if (returnedResult.status === 204) {
    // No content
    return undefined as T;
  }

  const jsonResponse = (await returnedResult.json()) as T;
  return jsonResponse;
}

export const api = {
  // Authentication -- register, login, logout, get current user
  async registerUser(
    userName: string,
    password: string,
    displayName?: string
  ): Promise<CurrentUser> {
    const body = {
      UserName: userName,
      Password: password,
      DisplayName: displayName,
    };

    const authResponse = await request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const userId = authResponse.userId
      ? parseInt(authResponse.userId, 10)
      : NaN;

    if (!authResponse.userName || isNaN(userId)) {
      throw new Error("Invalid AuthResponse from /register");
    }

    const stored: StoredAuth = {
      bearerToken: authResponse.bearerToken,
      userId,
      userName: authResponse.userName,
      displayName: authResponse.displayName,
    };
    saveAuth(stored);

    return {
      userId: stored.userId,
      userName: stored.userName,
      displayName: stored.displayName,
    };
  },

  //Login api method
  async login(userName: string, password: string): Promise<CurrentUser> {
    const queryString = new URLSearchParams({
      UserName: userName,
      Password: password,
    }).toString();

    const authResponse = await request<AuthResponse>(`/login?${queryString}`, {
      method: "GET",
    });

    const userId = authResponse.userId
      ? parseInt(authResponse.userId, 10)
      : NaN;

    if (!authResponse.userName || isNaN(userId)) {
      throw new Error("Invalid AuthResponse from /login");
    }

    const stored: StoredAuth = {
      bearerToken: authResponse.bearerToken,
      userId,
      userName: authResponse.userName,
      displayName: authResponse.displayName,
    };
    saveAuth(stored);

    return {
      userId: stored.userId,
      userName: stored.userName,
      displayName: stored.displayName,
    };
  },

  // The logout method
  async logout(): Promise<void> {
    clearAuth();
  },

  // Get current user from stored auth info
  getCurrentUserFromStorage(): CurrentUser | null {
    const auth = loadAuth();
    if (!auth) return null;
    return {
      userId: auth.userId,
      userName: auth.userName,
      displayName: auth.displayName,
    };
  },

  // Get Channels List
  async listChannels(): Promise<Channel[]> {
    const response = await request<QueryResponse<Channel>>("/channels");
    return response.results;
  },

  // Create Channel
  async createChannel(name: string): Promise<Channel> {
    const auth = loadAuth();
    if (!auth) {
      throw new Error("Not authenticated");
    }

    const body = {
      Name: name,
      CreatedByUserId: auth.userId,
      CreatedAt: new Date().toISOString(),
    };

    return request<Channel>("/channels", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // Update a channel
  async updateChannel(id: number, name: string): Promise<Channel> {
    const body = {
      Id: id,
      Name: name,
    };

    return request<Channel>(`/channels/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  // Delete a channel
  async deleteChannel(id: number): Promise<void> {
    await request<void>(`/channels/${id}`, {
      method: "DELETE",
    });
  },

  // Channel Members
  async listChannelMembers(
    optionalParameters: {
      channelId?: number;
      userId?: number;
    } = {}
  ): Promise<ChannelMember[]> {
    const params = new URLSearchParams();
    if (optionalParameters.channelId != null)
      params.set("ChannelId", String(optionalParameters.channelId));
    if (optionalParameters.userId != null)
      params.set("UserId", String(optionalParameters.userId));

    const queryString = params.toString();
    const response = await request<QueryResponse<ChannelMember>>(
      queryString ? `/channel-members?${queryString}` : "/channel-members"
    );
    return response.results;
  },

  // subscribe/join a channel.
  async joinChannel(channelId: number): Promise<ChannelMember> {
    const auth = loadAuth();
    if (!auth) throw new Error("Not authenticated");

    const body = {
      ChannelId: channelId,
      UserId: auth.userId,
      JoinedAt: new Date().toISOString(),
    };

    return request<ChannelMember>("/channel-members", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // unsubscribe/leave a channel.
  async deleteChannelMember(id: number): Promise<void> {
    await request<void>(`/channel-members/${id}`, {
      method: "DELETE",
    });
  },

  // List messages in a channel.
  async listMessages(channelId: number): Promise<Message[]> {
    const queryStrings = new URLSearchParams({
      ChannelId: String(channelId),
    }).toString();

    const response = await request<QueryResponse<Message>>(
      `/messages?${queryStrings}`
    );
    return response.results;
  },

  // Create a message in a channel.
  async createMessage(channelId: number, bodyText: string): Promise<Message> {
    const auth = loadAuth();
    if (!auth) throw new Error("Not authenticated");

    const body = {
      ChannelId: channelId,
      UserId: auth.userId,
      Body: bodyText,
    };

    return request<Message>("/messages", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // update a message in a channel.
  async updateMessage(id: number, bodyText: string): Promise<Message> {
    const body = {
      Id: id,
      Body: bodyText,
    };

    return request<Message>(`/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  // Delete a message in a channel.
  async deleteMessage(id: number): Promise<void> {
    const body = {
      Id: id,
      DeletedAt: new Date().toISOString(),
    };

    await request<void>(`/messages/${id}`, {
      method: "DELETE",
      body: JSON.stringify(body),
    });
  },
};
