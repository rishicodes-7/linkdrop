"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setLoading(true); setError(""); setMessage("");

    if (mode === "signup") {
      // Check username availability
      const { data: existing } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username.toLowerCase())
        .single();

      if (existing) { setError("Username already taken!"); setLoading(false); return; }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }

      // Create profile
      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          username: username.toLowerCase(),
          bio: "",
        });
      }
      setMessage("Account created! Check your email to verify.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cal+Sans&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0c0c; }
        .ld-input { transition: border-color 0.2s; }
        .ld-input:focus { border-color: #6366f1 !important; outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .ld-btn { transition: all 0.15s; }
        .ld-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.4) !important; }
        .ld-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
            Link<span style={{ color: "#6366f1" }}>Drop</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
            Your links, one beautiful page
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 16, padding: 32 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#0c0c0c", borderRadius: 10, padding: 4 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); }}
                style={{ flex: 1, padding: "8px", background: mode === m ? "#6366f1" : "transparent", color: mode === m ? "#fff" : "rgba(255,255,255,0.4)", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textTransform: "capitalize" }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {message && <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{message}</div>}

          {mode === "signup" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: 500 }}>Username</label>
              <div style={{ display: "flex", alignItems: "center", background: "#0c0c0c", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" }}>
                <span style={{ padding: "12px 12px 12px 14px", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>linkdrop/</span>
                <input className="ld-input" style={{ flex: 1, background: "transparent", border: "none", padding: "12px 14px 12px 0", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}
                  placeholder="yourname" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: 500 }}>Email</label>
            <input className="ld-input" style={{ width: "100%", background: "#0c0c0c", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}
              type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: 500 }}>Password</label>
            <input className="ld-input" style={{ width: "100%", background: "#0c0c0c", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}
              type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} />
          </div>

          <button className="ld-btn" onClick={handleAuth} disabled={loading}
            style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", url: "" });
  const [adding, setAdding] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [copied, setCopied] = useState(false);

  const host = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const { data: linksData } = await supabase.from("links").select("*").eq("user_id", user.id).order("position", { ascending: true });
    if (profileData) { setProfile(profileData); setBio(profileData.bio || ""); }
    if (linksData) setLinks(linksData);
    setLoading(false);
  };

  const addLink = async () => {
    if (!form.title.trim() || !form.url.trim()) return;
    setAdding(true);
    let url = form.url;
    if (!url.startsWith("http")) url = "https://" + url;
    const { error } = await supabase.from("links").insert({
      user_id: user.id, title: form.title, url, position: links.length,
    });
    if (!error) { setForm({ title: "", url: "" }); setShowForm(false); await fetchData(); }
    setAdding(false);
  };

  const deleteLink = async (id) => {
    await supabase.from("links").delete().eq("id", id);
    await fetchData();
  };

  const saveBio = async () => {
    await supabase.from("profiles").update({ bio }).eq("id", user.id);
    setProfile(p => ({ ...p, bio }));
    setEditingBio(false);
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${host}/${profile?.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .ld-input:focus { border-color: #6366f1 !important; outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .ld-input { transition: border-color 0.2s; }
        .ld-btn { transition: all 0.15s; }
        .ld-btn:hover:not(:disabled) { opacity: 0.85; }
        .link-card { transition: all 0.15s; }
        .link-card:hover { border-color: #333 !important; background: #1a1a1a !important; }
        .del-btn { opacity: 0; transition: opacity 0.15s; }
        .link-card:hover .del-btn { opacity: 1; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <header style={{ background: "#0c0c0c", borderBottom: "1px solid #1a1a1a", padding: "16px clamp(16px,4vw,32px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>
          Link<span style={{ color: "#6366f1" }}>Drop</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{user.email}</span>
          <button onClick={() => supabase.auth.signOut()}
            style={{ padding: "7px 14px", background: "transparent", border: "1px solid #2a2a2a", borderRadius: 8, color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            Sign out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px clamp(16px,4vw,32px)" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Loading...</div>
        ) : (
          <>
            {/* Profile Card */}
            <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 16, padding: 28, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                      {profile?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 600 }}>@{profile?.username}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{links.length} links</div>
                    </div>
                  </div>

                  {editingBio ? (
                    <div style={{ marginTop: 12 }}>
                      <input className="ld-input" style={{ width: "100%", background: "#0c0c0c", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}
                        placeholder="Write a short bio..." value={bio} onChange={e => setBio(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && saveBio()} />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button onClick={saveBio} style={{ padding: "7px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>Save</button>
                        <button onClick={() => setEditingBio(false)} style={{ padding: "7px 16px", background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: 8, cursor: "pointer" }} onClick={() => setEditingBio(true)}>
                      <span style={{ fontSize: 14, color: bio ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}>
                        {bio || "Click to add a bio..."}
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile link */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={copyProfileLink}
                    style={{ padding: "8px 14px", background: copied ? "rgba(99,102,241,0.15)" : "transparent", border: `1px solid ${copied ? "#6366f1" : "#2a2a2a"}`, borderRadius: 8, color: copied ? "#818cf8" : "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                    {copied ? "✓ Copied!" : "Copy Link"}
                  </button>
                  <a href={`/${profile?.username}`} target="_blank" rel="noreferrer"
                    style={{ padding: "8px 14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center" }}>
                    View Page ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Links section */}
            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Your Links</div>
              <button onClick={() => setShowForm(!showForm)}
                style={{ padding: "8px 16px", background: showForm ? "transparent" : "linear-gradient(135deg, #6366f1, #8b5cf6)", border: showForm ? "1px solid #2a2a2a" : "none", borderRadius: 8, color: showForm ? "rgba(255,255,255,0.4)" : "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {showForm ? "Cancel" : "+ Add Link"}
              </button>
            </div>

            {/* Add Link Form */}
            {showForm && (
              <div style={{ background: "#161616", border: "1px solid #6366f1", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input className="ld-input" style={{ width: "100%", background: "#0c0c0c", border: "1px solid #2a2a2a", borderRadius: 8, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}
                    placeholder="Link title (e.g. My GitHub)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  <input className="ld-input" style={{ width: "100%", background: "#0c0c0c", border: "1px solid #2a2a2a", borderRadius: 8, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}
                    placeholder="URL (e.g. github.com/yourname)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} onKeyDown={e => e.key === "Enter" && addLink()} />
                  <button className="ld-btn" onClick={addLink} disabled={adding || !form.title || !form.url}
                    style={{ padding: "11px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {adding ? "Adding..." : "Add Link"}
                  </button>
                </div>
              </div>
            )}

            {/* Links List */}
            {links.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
                No links yet — add your first one!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {links.map(link => (
                  <div className="link-card" key={link.id} style={{ background: "#161616", border: "1px solid #222", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{link.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.url}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{link.clicks} clicks</span>
                      <button className="del-btn" onClick={() => deleteLink(link.id)}
                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, padding: "2px 4px", lineHeight: 1 }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    }).catch(() => setChecking(false));
    setTimeout(() => setChecking(false), 3000);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Loading...</div>
    </div>
  );

  return user ? <Dashboard user={user} /> : <AuthPage />;
}