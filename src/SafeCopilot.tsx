import { useState, useRef, useCallback } from "react";
import "./safe-copilot.css";

const SAMPLE_GUIDANCE = {
  technique: "Active Listening",
  phrase:
    "I'm here to listen and help you understand what's been going on with your body, can you tell me more about these symptoms?",
  risk: "Medium",
  reason:
    "The caller's symptoms could be related to a medical condition, such as a viral or bacterial infection, or possibly a more serious condition like meningitis, but more information is needed to determine the level of risk.",
  nextSteps: [
    "Explore medical history",
    "Assess symptom severity",
    "Check for support system",
  ],
  questions: [
    "Can you tell me more about when these symptoms started and how they've been affecting you?",
    "Have you experienced any other symptoms, such as a runny nose, cough, or fever, along with the headache and sore throat?",
    "Have you seen a doctor or received any medical treatment for these symptoms, or is this your first time reaching out for help?",
  ],
};

const THEMES = [
  { name: "default", dot: "#a855f7" },
  { name: "ocean", dot: "#22d3ee" },
  { name: "slate", dot: "#94a3b8" },
  { name: "void", dot: "#18181b" },
];

const THEME_VARS: Record<string, Record<string, string>> = {
  default: {
    "--bg": "#1a1040",
    "--bg2": "#120b30",
    "--card": "rgba(255,255,255,0.06)",
    "--card-border": "rgba(255,255,255,0.1)",
    "--accent": "#7c3aed",
    "--accent2": "#a855f7",
    "--text": "#e2d9ff",
    "--muted": "#9580c8",
    "--hint": "#5e4d8a",
    "--input-bg": "rgba(255,255,255,0.07)",
    "--chip-bg": "rgba(167,139,250,0.12)",
    "--chip-border": "rgba(167,139,250,0.25)",
    "--chip-text": "#c4b5fd",
    "--chip-hover": "rgba(167,139,250,0.22)",
  },
  ocean: {
    "--bg": "#0c1a2e",
    "--bg2": "#071120",
    "--card": "rgba(255,255,255,0.06)",
    "--card-border": "rgba(34,211,238,0.15)",
    "--accent": "#0ea5e9",
    "--accent2": "#22d3ee",
    "--text": "#e0f2fe",
    "--muted": "#7ab8d4",
    "--hint": "#3a7d99",
    "--input-bg": "rgba(14,165,233,0.08)",
    "--chip-bg": "rgba(34,211,238,0.1)",
    "--chip-border": "rgba(34,211,238,0.2)",
    "--chip-text": "#7dd3fc",
    "--chip-hover": "rgba(34,211,238,0.2)",
  },
  slate: {
    "--bg": "#0f172a",
    "--bg2": "#080e1e",
    "--card": "rgba(255,255,255,0.05)",
    "--card-border": "rgba(148,163,184,0.15)",
    "--accent": "#64748b",
    "--accent2": "#94a3b8",
    "--text": "#e2e8f0",
    "--muted": "#94a3b8",
    "--hint": "#475569",
    "--input-bg": "rgba(148,163,184,0.08)",
    "--chip-bg": "rgba(148,163,184,0.1)",
    "--chip-border": "rgba(148,163,184,0.2)",
    "--chip-text": "#cbd5e1",
    "--chip-hover": "rgba(148,163,184,0.2)",
  },
  void: {
    "--bg": "#09090b",
    "--bg2": "#000000",
    "--card": "rgba(255,255,255,0.04)",
    "--card-border": "rgba(255,255,255,0.08)",
    "--accent": "#a855f7",
    "--accent2": "#c084fc",
    "--text": "#fafafa",
    "--muted": "#a1a1aa",
    "--hint": "#52525b",
    "--input-bg": "rgba(255,255,255,0.06)",
    "--chip-bg": "rgba(168,85,247,0.1)",
    "--chip-border": "rgba(168,85,247,0.2)",
    "--chip-text": "#d8b4fe",
    "--chip-hover": "rgba(168,85,247,0.2)",
  },
};

type GuidanceData = typeof SAMPLE_GUIDANCE | null;

function getRiskConfig(risk: string) {
  if (risk === "High") return { cls: "risk-high", icon: "🚨", label: "HIGH RISK — Escalate immediately" };
  if (risk === "Medium") return { cls: "risk-medium", icon: "⚠️", label: "MEDIUM RISK — Monitor closely" };
  return { cls: "risk-low", icon: "✓", label: "LOW RISK" };
}

export function SafeCopilot() {
  const [situation, setSituation] = useState(
    "What is happening on this call?\n\ndays. It started with this dull headache that just wouldn't go away. Yesterday I noticed I was getting tired way faster than usual, even just walking up the stairs. Today I woke up with a sore throat and this weird pressure behind my eyes."
  );
  const [guidance, setGuidance] = useState<GuidanceData>(SAMPLE_GUIDANCE);
  const [loading, setLoading] = useState(false);
  const [followupQ, setFollowupQ] = useState("");
  const [followupA, setFollowupA] = useState(
    "To further assess the caller's risk level, I would suggest asking about the caller's medical history, any prior diagnoses, and current medications. I would also recommend asking about the caller's support system and whether they have a primary care physician they can contact. Suggested phrase: \"Let's take a moment to understand your health better. Have you experienced these symptoms before, and do you have a doctor you usually see?\""
  );
  const [sessionSummary, setSessionSummary] = useState(
    "CALLER SUMMARY: The caller has been experiencing a dull headache, fatigue, sore throat, and pressure behind the eyes for the past three days, with symptoms worsening over time.\n\nINTERVENTION USED: Active Listening, using open-ended questions to gather more information about the caller's symptoms and medical history.\n\nRISK ASSESSMENT: Medium, due to the potential for underlying medical conditions such as viral or bacterial infection.\n\nCOUNSELOR ACTIONS: Gathered information about the caller's symptoms, onset, and progression.\n\nFOLLOW-UP NEEDED: Yes\n\nREFERRALS SUGGESTED: Primary care physician, urgent care if symptoms worsen."
  );
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [activeTheme, setActiveTheme] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const questionRef = useRef<HTMLTextAreaElement>(null);

  const applyTheme = useCallback((idx: number) => {
    setActiveTheme(idx);
    const vars = THEME_VARS[THEMES[idx].name];
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, []);

  const handleGetGuidance = useCallback(async () => {
    if (!situation.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1300));
    setGuidance(SAMPLE_GUIDANCE);
    setLoading(false);
  }, [situation]);

  const handleClickSuggestion = useCallback((text: string) => {
    setFollowupQ(text);
    setHintVisible(true);
    setTimeout(() => setHintVisible(false), 2500);
    questionRef.current?.focus();
  }, []);

  const handleAsk = useCallback(async () => {
    if (!followupQ.trim()) return;
    setFollowupA("Thinking...");
    await new Promise((r) => setTimeout(r, 900));
    setFollowupA(
      "To further assess the caller's risk level, I would suggest asking about the caller's medical history, any prior diagnoses, and current medications. Suggested phrase: \"Let's take a moment to understand your health better. Have you experienced these symptoms before, and do you have a doctor you usually see?\""
    );
  }, [followupQ]);

  const handleSummary = useCallback(async () => {
    if (!guidance) return;
    setSummaryLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSessionSummary(
      "CALLER SUMMARY: The caller has been experiencing a dull headache, fatigue, sore throat, and pressure behind the eyes for the past three days, with symptoms worsening over time.\n\nINTERVENTION USED: Active Listening, using open-ended questions to gather more information about the caller's symptoms and medical history.\n\nRISK ASSESSMENT: Medium, due to the potential for underlying medical conditions such as viral or bacterial infection.\n\nCOUNSELOR ACTIONS: Gathered information about the caller's symptoms, onset, and progression.\n\nFOLLOW-UP NEEDED: Yes\n\nREFERRALS SUGGESTED: Primary care physician, urgent care if symptoms worsen."
    );
    setSummaryLoading(false);
  }, [guidance]);

  const riskConfig = guidance ? getRiskConfig(guidance.risk) : null;

  return (
    <div className="safe-shell">
      {/* HEADER */}
      <header className="safe-header">
        <div className="header-left">
          <span className="hack-badge">HACK BROOKLYN 2026</span>
          <h1 className="safe-wordmark">SAFE</h1>
          <p className="safe-tagline">Real-time clinical guidance — built for the counselor, not the patient.</p>
        </div>
        <div className="header-right">
          <span className="theme-label">THEME</span>
          <div className="theme-dots">
            {THEMES.map((t, i) => (
              <div
                key={t.name}
                className={`theme-dot${activeTheme === i ? " active" : ""}`}
                style={{ background: t.dot }}
                onClick={() => applyTheme(i)}
                title={t.name}
              />
            ))}
          </div>
        </div>
        <div className="header-logo">✳</div>
      </header>

      {/* 3-COLUMN GRID */}
      <div className="three-col">

        {/* ── COL 1: Input ── */}
        <div className="col col-input">
          <div className="card">
            <div className="card-label">CALLER SITUATION</div>
            <textarea
              className="safe-textarea highlight-input"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={7}
            />
            <button
              className="btn-main"
              onClick={handleGetGuidance}
              disabled={loading || !situation.trim()}
            >
              {loading ? <><span className="spinner" /> Analyzing…</> : "Get Guidance →"}
            </button>
          </div>

          <div className="card">
            <div className="card-label">YOUR QUESTION</div>
            <textarea
              ref={questionRef}
              className={`safe-textarea${hintVisible ? " highlight-input" : ""}`}
              placeholder="Ask Safe anything — or tap a suggestion"
              value={followupQ}
              onChange={(e) => setFollowupQ(e.target.value)}
              rows={3}
            />
            {hintVisible && <div className="hint-pill">✦ Added from suggestion</div>}
            <div className="q-placeholder-text">e.g. What if the caller refuses to engage?</div>
          </div>

          {followupQ.trim() && (
            <button className="btn-ask" onClick={handleAsk}>
              Ask Safe →
            </button>
          )}

          {/* Affirmation */}
          <div className="affirmation">
            <span className="affirmation-icon">💜</span>
            <div>
              <p className="affirmation-title">Helping someone could change a life.</p>
              <p className="affirmation-sub">Take a deep breath — you're making a difference.</p>
            </div>
          </div>
        </div>

        {/* ── COL 2: Guidance ── */}
        <div className="col col-guidance">
          {riskConfig && (
            <div className={`risk-banner ${riskConfig.cls}`}>
              {riskConfig.icon} {riskConfig.label}
            </div>
          )}

          <div className="card phrase-card-wrap">
            <div className="rag-pill">✦ Generated using clinical safety protocols (RAG)</div>
            <div className="phrase-label">● RECOMMENDED RESPONSE</div>
            <blockquote className="phrase-quote">
              "{guidance?.phrase ?? "Enter a situation and click Get Guidance to begin."}"
            </blockquote>
            {guidance && (
              <>
                <div className="meta-line">
                  <span className="meta-key">Technique:</span> {guidance.technique}
                </div>
                <div className="meta-line">
                  <span className="meta-key">Why:</span> {guidance.reason}
                </div>
              </>
            )}
          </div>

          {guidance && (
            <div className="card">
              <div className="card-label">NEXT STEPS — TAP TO ASK SAFE</div>
              <div className="bubble-row">
                {guidance.nextSteps.map((step) => (
                  <button
                    key={step}
                    className="step-bubble"
                    onClick={() => handleClickSuggestion(step)}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── COL 3: Questions + Answer + Notes ── */}
        <div className="col col-right">
          {guidance && (
            <div className="card">
              <div className="card-label">QUICK ACTIONS</div>
              <p className="tap-hint">Tap a question — Safe answers instantly</p>
              <div className="q-chip-list">
                {guidance.questions.map((q) => (
                  <button
                    key={q}
                    className="q-chip"
                    onClick={() => handleClickSuggestion(q)}
                  >
                    <span className="q-dot">●</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card answer-card">
            <div className="card-label">SAFE'S ANSWER</div>
            {followupA ? (
              <p className="answer-text">{followupA}</p>
            ) : (
              <p className="placeholder-text">Answers will appear here when you tap a question or ask your own.</p>
            )}
          </div>

        </div>

      </div>

      {/* ── Full-width Session Notes ── */}
      <div className="card notes-card-full">
        <div className="notes-full-header">
          <div className="card-label">END OF CALL — SESSION NOTES</div>
          <button
            className="btn-notes"
            onClick={handleSummary}
            disabled={summaryLoading || !guidance}
          >
            {summaryLoading ? <><span className="spinner spinner-sm" /> Generating…</> : "Generate Note"}
          </button>
        </div>
        {sessionSummary ? (
          <pre className="notes-text">{sessionSummary}</pre>
        ) : (
          <p className="placeholder-text">Session notes will appear here after guidance is generated.</p>
        )}
      </div>
    </div>
  );
}