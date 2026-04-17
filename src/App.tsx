import { useState, useEffect, useRef } from "react";
import "./component.css";

/* ── Google Fonts loader ── */
const GoogleFonts = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
);

/* ── Icons (inline SVG) ── */
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Nav links ── */
const NAV_LINKS = [
  { href: "#how", label: "How It Works" },
  { href: "#demo", label: "Live Demo" },
  { href: "#stack", label: "Tech Stack" },
  { href: "#docs", label: "Clinical Docs" },
];

/* ── Navbar ── */
function Navbar({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  return (
    <>
      <nav className="navbar">
        <a href="#" className="navbar-logo">
          <span className="navbar-logo-shield"><ShieldIcon /></span>
          Safe
        </a>
        <div className="navbar-center">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`navbar-link${active === l.href ? " navbar-link--active" : ""}`}
              onClick={() => setActive(l.href)}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="navbar-right">
          <span className="navbar-badge">Hack Brooklyn '24</span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <button
          className="navbar-mobile-btn"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="navbar-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div style={{ padding: "0.75rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Hero ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section className="hero-section">
      <div className="hero-bg-grid" />
      <div className="hero-bg-glow" />
      <div className={`hero-line-top${loaded ? " loaded" : ""}`} />
      <div className={`hero-line-bottom${loaded ? " loaded" : ""}`} />

      <div className="hero-content">
        <p className="hero-eyebrow fade-up delay-1">
          Counselor-side AI co-pilot
        </p>

        <h1 className="hero-title fade-up delay-2">
          <span className="hero-title-accent">Safe.</span>
        </h1>

        <p className="hero-tagline fade-up delay-3">
          Real-time clinical guidance for crisis counselors —{" "}
          so no one is ever alone on the hardest calls.
        </p>

        <div className="cta-group fade-up delay-4">
          <a href="https://github.com/nuzhatk2021/safe" className="cta-btn cta-btn--amber" target="_blank" rel="noreferrer">
            View on GitHub →
          </a>
          <a href="#demo" className="cta-btn cta-btn--ghost">
            See Live Demo
          </a>
        </div>

        <div className="hero-stats fade-up delay-5">
          {[
            { num: "6", label: "Clinical Sources" },
            { num: "<3s", label: "Response Time" },
            { num: "0", label: "Hallucinated Advice" },
            { num: "24h", label: "Built in" },
          ].map((s) => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features / Why ── */
function WhySection() {
  const features = [
    {
      color: "amber" as const,
      icon: "🎯",
      title: "Counselor-First",
      desc: "Every mental health AI is patient-facing. Safe is the only tool built for the counselor — the person holding it all together on the hardest calls.",
    },
    {
      color: "crimson" as const,
      icon: "⚡",
      title: "Real-Time Escalation",
      desc: "Pattern-matching risk detection fires a red banner before the response loads. When seconds matter, Safe doesn't wait.",
    },
    {
      color: "emerald" as const,
      icon: "📚",
      title: "Grounded in Evidence",
      desc: "The model only responds from vetted clinical literature. It cannot hallucinate advice. If it's not in the docs, Safe won't say it.",
    },
    {
      color: "sapphire" as const,
      icon: "🔊",
      title: "Hands-Free Voice",
      desc: "ElevenLabs reads suggested phrases aloud — so counselors never have to look away from the call to get guidance.",
    },
  ];

  return (
    <section className="section" id="why">
      <p className="section-eyebrow">Why Safe</p>
      <h2 className="section-title">Built for the person<br />on the other end.</h2>
      <p className="section-subtitle">
        Crisis counselors pick up calls with zero support. No guidance. No safety net.
        Just them and a person in their most vulnerable moment.
      </p>
      <div className="feature-grid">
        {features.map((f) => (
          <div key={f.title} className={`feature-card feature-card--${f.color}`}>
            <div className={`feature-icon feature-icon--${f.color}`}>{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── How It Works ── */
function HowSection() {
  const steps = [
    {
      num: "01",
      title: "Situation Summary",
      desc: "The counselor types a quick mid-call summary — no forms, no structure needed. Just a sentence describing what's happening.",
    },
    {
      num: "02",
      title: "Risk Scan",
      desc: "Pattern-matching layer scans for escalation language and fires a red warning banner immediately if triggered — before the full response loads.",
    },
    {
      num: "03",
      title: "Clinical Retrieval",
      desc: "MiniLM embeds the query. FAISS searches the vetted clinical document store and returns the most relevant chunks from SAMHSA, DBT, CBT, and NIMH literature.",
    },
    {
      num: "04",
      title: "Live Resource Search",
      desc: "Tavily fetches current web resources alongside the local retrieval — ensuring counselors have access to the most up-to-date information available.",
    },
    {
      num: "05",
      title: "Grounded Response",
      desc: "Claude Haiku synthesizes a calm, structured response using only the retrieved context. It will not generate advice that doesn't exist in the documents.",
    },
    {
      num: "06",
      title: "Voice Playback",
      desc: "ElevenLabs reads the suggested phrase aloud. Counselors never need to look away — Safe fits seamlessly into the call.",
    },
  ];

  return (
    <section className="section" id="how" style={{ paddingTop: "2rem" }}>
      <div className="section-divider"><hr /></div>
      <div style={{ paddingTop: "5rem" }}>
        <p className="section-eyebrow">How It Works</p>
        <h2 className="section-title">Six steps. Under three seconds.</h2>
        <div className="flow-list">
          {steps.map((s) => (
            <div key={s.num} className="flow-item">
              <div className="flow-num">{s.num}</div>
              <div className="flow-body">
                <h3 className="flow-title">{s.title}</h3>
                <p className="flow-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Chat Demo ── */
function DemoSection() {
  return (
    <section className="section" id="demo" style={{ paddingTop: "2rem" }}>
      <div className="section-divider"><hr /></div>
      <div style={{ paddingTop: "5rem" }}>
        <p className="section-eyebrow">Live Demo</p>
        <h2 className="section-title">What a call looks like.</h2>
        <p className="section-subtitle">
          A real example of Safe in action — from counselor input to grounded clinical response in seconds.
        </p>

        <div className="chat-demo">
          <div className="chat-demo-header">
            <div className="chat-demo-dots">
              <span /><span /><span />
            </div>
            <span className="chat-demo-title">Safe — Session Active</span>
            <span className="chat-demo-status">Live</span>
          </div>

          <div className="chat-demo-body">
            {/* Risk banner */}
            <div className="risk-banner">
              <span className="risk-banner-icon">⚠️</span>
              <div>
                <div className="risk-banner-title">Escalation Pattern Detected</div>
                <div className="risk-banner-text">
                  Keywords suggest possible dissociation or depersonalization. Elevated attention recommended. Follow your organization's crisis protocol.
                </div>
              </div>
            </div>

            {/* Counselor input */}
            <div className="chat-msg chat-msg--user">
              <div className="chat-msg-label">Counselor</div>
              <div className="chat-bubble chat-bubble--user">
                Caller is a 19 year old male, first time calling, says he feels completely numb and disconnected — like he's watching himself from outside his body.
              </div>
            </div>

            {/* Safe response */}
            <div className="chat-msg chat-msg--system">
              <div className="chat-msg-label">Safe · Retrieved from DBT Skills Manual</div>
              <div className="chat-bubble chat-bubble--system">
                <strong>Grounding — 5-4-3-2-1 Technique</strong>
                This caller is describing dissociation. Use sensory grounding to reconnect them to the present moment.
                <br /><br />
                <em>Say this now:</em> "I hear you — that feeling of watching yourself can be really frightening. Let's try something together. Can you tell me five things you can see right now, wherever you are?"
                <br /><br />
                Pause between each sense. Keep your voice calm and slow. Avoid asking about the dissociation directly until they're grounded.
              </div>
            </div>

            {/* Session note preview */}
            <div className="chat-msg chat-msg--system" style={{ alignSelf: "stretch", maxWidth: "100%" }}>
              <div className="chat-msg-label">Session Note Draft — 1 Click</div>
              <div className="chat-bubble chat-bubble--system" style={{ width: "100%" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>
                  Auto-generated · Review before saving
                </span>
                <br /><br />
                19M, first contact. Presenting: dissociation / depersonalization symptoms ("numb," "watching himself"). Intervention: sensory grounding (5-4-3-2-1). Caller engaged. Risk level: Moderate — monitor for escalation. Follow-up recommended within 48h.
              </div>
            </div>
          </div>

          <div className="chat-demo-input">
            <span className="chat-demo-input-field">Type a situation summary…</span>
            <button className="chat-demo-send">Send</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Tech Stack ── */
function StackSection() {
  const stack = [
    { layer: "LLM", tool: "Claude Haiku 4.5", purpose: "Calm, grounded response synthesis", sponsored: false },
    { layer: "RAG", tool: "LlamaIndex", purpose: "Clinical document ingestion & retrieval", sponsored: false },
    { layer: "Live Search", tool: "Tavily API", purpose: "Real-time resource retrieval", sponsored: true },
    { layer: "Embeddings", tool: "HuggingFace MiniLM", purpose: "Local semantic embeddings, zero cost", sponsored: false },
    { layer: "Vector Store", tool: "FAISS", purpose: "Fast similarity search over clinical chunks", sponsored: false },
    { layer: "Voice", tool: "ElevenLabs", purpose: "Reads suggestions aloud — hands-free", sponsored: true },
    { layer: "UI", tool: "Gradio", purpose: "Clean chat interface + audio playback", sponsored: false },
    { layer: "Document Store", tool: "AWS S3", purpose: "Clinical PDFs + serialized FAISS index", sponsored: false },
    { layer: "Hosting", tool: "AWS EC2", purpose: "Live public URL, free tier", sponsored: false },
  ];

  return (
    <section className="section" id="stack" style={{ paddingTop: "2rem" }}>
      <div className="section-divider"><hr /></div>
      <div style={{ paddingTop: "5rem" }}>
        <p className="section-eyebrow">Tech Stack</p>
        <h2 className="section-title">Built for the real world.</h2>
        <p className="section-subtitle">
          Every layer chosen for reliability under pressure — not for convenience.
        </p>
        <div className="stack-grid">
          {stack.map((s) => (
            <div key={s.tool} className="stack-card">
              <div className="stack-layer">{s.layer}</div>
              <div className={`stack-tool${s.sponsored ? " stack-tool--sponsored" : ""}`}>
                {s.tool}
                {s.sponsored && <span className="stack-sponsor-badge">Sponsor</span>}
              </div>
              <div className="stack-purpose">{s.purpose}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Clinical Docs ── */
function DocsSection() {
  const docs = [
    { name: "SAMHSA Crisis Counseling Program Guidelines", source: "SAMHSA" },
    { name: "Treatment Improvement Protocol — Brief Interventions", source: "SAMHSA" },
    { name: "Beck Institute CBT Resource Library", source: "Beck Institute" },
    { name: "DBT Skills Training Manual (public summary)", source: "Linehan, 1993" },
    { name: "Safe Messaging Guidelines for Mental Health Professionals", source: "AFSP" },
    { name: "Suicide Prevention Resource Center Fact Sheets", source: "NIMH" },
  ];

  return (
    <section className="section" id="docs" style={{ paddingTop: "2rem" }}>
      <div className="section-divider"><hr /></div>
      <div style={{ paddingTop: "5rem" }}>
        <p className="section-eyebrow">Clinical Documents</p>
        <h2 className="section-title">Evidence-based. Verified. Vetted.</h2>
        <p className="section-subtitle">
          Safe retrieves exclusively from publicly available, peer-reviewed sources.
          No Wikipedia. No forums. Only what clinical professionals trust.
        </p>
        <div className="doc-list">
          {docs.map((d) => (
            <div key={d.name} className="doc-item">
              <span className="doc-dot" />
              <span className="doc-name">{d.name}</span>
              <span className="doc-source">{d.source}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2.5rem", padding: "1.5rem", background: "var(--color-amber-light)", border: "1px solid rgba(var(--rgb-amber), 0.22)", borderRadius: "5px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-amber)", marginBottom: "0.5rem" }}>
            ⚠️ A note on risk flagging
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-muted)", lineHeight: "1.7" }}>
            Safe detects escalation language and surfaces a warning banner before the response is shown.
            This is a pattern-matching layer — not a replacement for clinical judgment.
            Always follow your organization's crisis protocol.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-logo">🛡️ Safe</div>
        <p className="footer-tagline">Built with care for the people who answer the hardest calls.</p>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <a href="https://github.com/nuzhatk2021/safe" className="footer-link" target="_blank" rel="noreferrer">GitHub</a>
        <span className="footer-link" style={{ cursor: "default" }}>Hack Brooklyn '24</span>
        <span className="footer-link" style={{ cursor: "default" }}>Anthropic · Tavily · ElevenLabs</span>
      </div>
    </footer>
  );
}

/* ── Root App ── */
export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("safe-theme") as "light" | "dark") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("safe-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    document.documentElement.classList.add("theme-switching");
    setTheme((t) => (t === "dark" ? "light" : "dark"));
    setTimeout(() => document.documentElement.classList.remove("theme-switching"), 350);
  };

  return (
    <>
      <GoogleFonts />
      <div className="app-root" data-theme={theme}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="app-main">
          <Hero />
          <WhySection />
          <HowSection />
          <DemoSection />
          <StackSection />
          <DocsSection />
        </main>
        <Footer />
      </div>
    </>
  );
}