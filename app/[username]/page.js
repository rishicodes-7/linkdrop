"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage({ params }) {
  const [resolvedParams, setResolvedParams] = useState(null);
  const username = resolvedParams?.username;

  useEffect(() => {
    params.then ? params.then(setResolvedParams) : setResolvedParams(params);
  }, []);

  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();

      if (!profileData) { setNotFound(true); setLoading(false); return; }

      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profileData.id)
        .order("position", { ascending: true });

      setProfile(profileData);
      setLinks(linksData || []);
      setLoading(false);
    };

    fetchProfile();
  }, [username]);

  const handleLinkClick = async (link) => {
    // Increment click count
    await supabase
      .from("links")
      .update({ clicks: link.clicks + 1 })
      .eq("id", link.id);

    window.open(link.url, "_blank");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Loading...</div>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", flexDirection: "column", gap: 16 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');`}</style>
      <div style={{ fontSize: 64 }}>404</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>Page not found</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>@{username} doesn't exist</div>
      <a href="/" style={{ marginTop: 8, padding: "10px 24px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", textDecoration: "none", borderRadius: 10, fontSize: 14, fontWeight: 500 }}>
        Create your page →
      </a>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", fontFamily: "'Inter', sans-serif", padding: "60px 20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0c0c; }
        .link-btn { transition: all 0.15s; }
        .link-btn:hover { transform: translateY(-2px); background: #1e1e1e !important; border-color: #6366f1 !important; }
      `}</style>

      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {/* Profile header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#fff", margin: "0 auto 16px" }}>
            {profile.username[0].toUpperCase()}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>@{profile.username}</div>
          {profile.bio && (
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>{profile.bio}</div>
          )}
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {links.length === 0 ? (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 14, padding: "40px 0" }}>No links yet</div>
          ) : (
            links.map(link => (
              <button className="link-btn" key={link.id} onClick={() => handleLinkClick(link)}
                style={{ width: "100%", padding: "18px 24px", background: "#161616", border: "1px solid #222", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textAlign: "center", display: "block" }}>
                {link.title}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.5)"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.2)"}>
            Create your LinkDrop →
          </a>
        </div>
      </div>
    </div>
  );
}