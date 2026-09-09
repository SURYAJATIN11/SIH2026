const DEFAULT_BASE = localStorage.getItem("sr_api_base") || "http://127.0.0.1:8000";

export const api = {
  get baseUrl() {
    return localStorage.getItem("sr_api_base") || DEFAULT_BASE;
  },
  setBaseUrl(url) {
    const cleaned = url ? url.trim().replace(/\/$/, "") : "http://127.0.0.1:8000";
    localStorage.setItem("sr_api_base", cleaned);
  },
  async request(path, options = {}) {
    const base = this.baseUrl.replace(/\/$/, "");
    const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;

    const token = localStorage.getItem("sr_auth_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      if (!res.ok) {
        let errMessage = `HTTP ${res.status} (${res.statusText})`;
        try {
          const errData = await res.json();
          if (errData.detail) {
            errMessage = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
          } else if (errData.error) {
            errMessage = errData.error;
          }
        } catch {
          // ignore non-json error
        }
        throw new Error(errMessage);
      }

      if (res.status === 204) return null;
      return await res.json();
    } catch (e) {
      // Fallback: If 127.0.0.1 failed, try localhost or vice-versa
      if ((e.message.includes("Failed to fetch") || e.message.includes("NetworkError")) && !options._retried) {
        const altHost = base.includes("127.0.0.1") 
          ? base.replace("127.0.0.1", "localhost") 
          : base.replace("localhost", "127.0.0.1");
        const altUrl = path.startsWith("http") ? path : `${altHost}${path.startsWith("/") ? "" : "/"}${path}`;
        try {
          const altRes = await fetch(altUrl, { ...options, headers });
          if (altRes.ok) {
            this.setBaseUrl(altHost);
            if (altRes.status === 204) return null;
            return await altRes.json();
          }
        } catch {}
      }

      if (e.message.includes("Failed to fetch") || e.message.includes("NetworkError")) {
        throw new Error(`Cannot reach backend at ${base}. Ensure FastAPI is running on port 8000.`);
      }
      throw e;
    }
  },
  async health() {
    try {
      return await this.request("/api/v1/health");
    } catch {
      try {
        return await this.request("/health");
      } catch {
        const altHost = this.baseUrl.includes("127.0.0.1") ? "http://localhost:8000" : "http://127.0.0.1:8000";
        const altRes = await fetch(`${altHost}/api/v1/health`);
        if (altRes.ok) {
          this.setBaseUrl(altHost);
          return await altRes.json();
        }
        throw new Error("Backend offline");
      }
    }
  },
  get(path, params) {
    let url = path;
    if (params) {
      const qs = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null)).toString();
      if (qs) url += (url.includes("?") ? "&" : "?") + qs;
    }
    return this.request(url);
  },
  post(path, body) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body || {}),
    });
  },
  patch(path, body) {
    return this.request(path, {
      method: "PATCH",
      body: JSON.stringify(body || {}),
    });
  },
  put(path, body) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(body || {}),
    });
  },
  delete(path) {
    return this.request(path, { method: "DELETE" });
  },
  async login(payload) {
    const profile = await this.post("/api/v1/auth/login", payload);
    if (profile && profile.token) {
      localStorage.setItem("sr_auth_token", profile.token);
      localStorage.setItem("sr_official_user", JSON.stringify(profile));
    }
    return profile;
  },
  async getOfficials() {
    try {
      return await this.get("/api/v1/auth/officials");
    } catch {
      return [];
    }
  },
  getOfficial() {
    try {
      const stored = localStorage.getItem("sr_official_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
  setOfficial(profile) {
    if (profile) {
      localStorage.setItem("sr_official_user", JSON.stringify(profile));
      if (profile.token) localStorage.setItem("sr_auth_token", profile.token);
    } else {
      localStorage.removeItem("sr_official_user");
      localStorage.removeItem("sr_auth_token");
    }
  },
  logout() {
    localStorage.removeItem("sr_official_user");
    localStorage.removeItem("sr_auth_token");
  },
};