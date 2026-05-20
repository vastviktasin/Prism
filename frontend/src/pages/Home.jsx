import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function AnimatedSection({ children, className, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`${className} ${inView ? "revealed" : "hidden-section"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const steps = [
  {
    num: "01",
    title: "Connect your repo",
    desc: "Integrate with GitHub, GitLab, or Bitbucket in under 60 seconds. No infrastructure changes needed.",
  },
  {
    num: "02",
    title: "Open a pull request",
    desc: "PRism automatically triggers on every PR — no manual invocation, no config per repo.",
  },
  {
    num: "03",
    title: "Review AI intelligence",
    desc: "Get instant summaries, risk scores, security signals, and architecture insights right in your PR thread.",
  },
];

const testimonials = [
  {
    quote: "PRism cut our PR review cycle from two days to under three hours. The risk scoring alone has prevented four production incidents this quarter.",
    name: "Priya Shankar",
    role: "Staff Engineer, Vercel",
    avatar: "PS",
  },
  {
    quote: "The architecture awareness is genuinely uncanny. It correctly flagged that a 'minor refactor' was actually restructuring our entire auth layer.",
    name: "Marcus Webb",
    role: "Engineering Lead, Linear",
    avatar: "MW",
  },
  {
    quote: "We've tried every code review tool out there. PRism is the only one that actually understands what a change means, not just what it is.",
    name: "Camille Droit",
    role: "CTO, Loom",
    avatar: "CD",
  },
];

const features = [
  {
    icon: "◈",
    title: "AI Summaries",
    desc: "Convert massive, multi-file pull requests into crisp engineering narratives that reviewers actually read.",
    accent: "#a78bfa",
  },
  {
    icon: "⚡",
    title: "Risk Detection",
    desc: "Detect high-impact modifications — database migrations, auth changes, infra shifts — before they reach production.",
    accent: "#f472b6",
  },
  {
    icon: "⬡",
    title: "Security Signals",
    desc: "Surface sensitive code patterns across authentication, secrets handling, and third-party integrations.",
    accent: "#34d399",
  },
  {
    icon: "⌬",
    title: "Architecture Lens",
    desc: "Understand structural shifts: new services, dependency changes, API surface modifications, and module boundaries.",
    accent: "#60a5fa",
  },
  {
    icon: "◎",
    title: "Review Routing",
    desc: "Automatically suggest the right reviewers based on code ownership, expertise signals, and historical context.",
    accent: "#fb923c",
  },
  {
    icon: "≋",
    title: "Trend Analytics",
    desc: "Track team velocity, review bottlenecks, recurring risk patterns, and code health over time.",
    accent: "#22d3ee",
  },
];



export default function Home() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({
  x: 0,
  y: 0,
});
  const [count, setCount] = useState({ a: 0, b: 0, c: 0, d: 0 });
  const statsRef = useRef(null);
  const statsCounted = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
  setMousePosition({
    x: e.clientX,
    y: e.clientY,
  });
};

window.addEventListener(
  "mousemove",
  handleMouseMove
);
    setTimeout(() => setLoaded(true), 100);

    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      setOffset({ x, y });
    };
    const scroll = () => setScrollY(window.scrollY);

    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", scroll);
    return () => {
        window.removeEventListener(
  "mousemove",
  handleMouseMove
);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  function animateCount(key, target) {
    const dur = 1800;
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(prev => ({ ...prev, [key]: +(target * ease).toFixed(1) }));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsCounted.current) {
        statsCounted.current = true;
        animateCount("a", 94);
        animateCount("b", 32);
        animateCount("c", 12);
        animateCount("d", 99.9);
      }
    }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const heroParallax = scrollY * 0.3;

  return (
    <div className="page">
      <div className="noise" />
      <div className="grid" />

      <div className="orb orb1" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} />
      <div className="orb orb2" style={{ transform: `translate(${-offset.x * 0.8}px, ${-offset.y * 0.8}px)` }} />
      <div className="orb orb3" style={{ transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)` }} />

      {/* NAV */}
      <nav className={`nav ${scrollY > 60 ? "nav-scrolled" : ""}`}>
        <div className="nav-logo">
          <span className="logo-prism">PR</span><span className="logo-ism">ism</span>
        </div>
        <div className="nav-links">
          <a href="#">Features</a>
          <a href="#">Docs</a>
          <a href="#">Pricing</a>
          <a href="#">Changelog</a>
        </div>
        <button className="nav-cta">Get Early Access</button>
      </nav>

      {/* HERO */}
      <section
  className="hero"
  style={{
    transform: `translateY(${heroParallax}px)`
  }}
>
  <div className="hero-layout">
    <div className="hero-inner">
    </div>

  </div>
  <div
  className="hero-rings"
  style={{
    transform: `
      translate(-50%, -50%)
      rotate(${mousePosition.x * 0.02}deg)
      scale(${1 + mousePosition.y * 0.0002})
    `
  }}
></div>

  <div
  className="hero-beam"
  style={{
    transform: `
      translate(
        ${mousePosition.x * 0.02}px,
        ${mousePosition.y * 0.02}px
      )
    `
  }}
></div>

  <div className="hero-particles">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
        <div className={`hero-inner ${loaded ? "hero-loaded" : ""}`}>
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Native Developer Intelligence Platform
          </div>

          <h1 className="hero-title">
            See Beyond<br />
            <span className="gradient-text">The Diff.</span>
          </h1>

          <p className="hero-subtitle">
            PRism transforms chaotic GitHub pull requests into elegant AI-powered
            summaries, risk analysis, architecture awareness, and actionable code
            review intelligence for modern engineering teams.
          </p>

          <div className="hero-buttons">
            <Link to="/analyze" className="primary-btn">
            <span>Analyze Pull Request</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
            <button className="secondary-btn">
              View Demo
            </button>
          </div>

          <div className="hero-logos">
            <span className="logo-label">Trusted by engineers at</span>
            <div className="logo-row">
              {["Vercel", "Linear", "Loom", "Stripe", "Notion"].map(l => (
                <span key={l} className="company-logo">{l}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="preview-card">
            <div className="holo-shine"></div>
  <div className="preview-top">
    <div className="dots">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <p>AI Analysis Engine</p>
  </div>

  <div className="preview-content">
    <div className="risk-row">
      <div>
        <span className="preview-label">
          Risk Score
        </span>

        <h1 className="risk-score">
          87
        </h1>
      </div>

      <div>
        <span className="preview-label">
          Complexity
        </span>

        <p className="complexity">
          Medium
        </p>
      </div>
    </div>

    <div className="summary-box">
      <p className="preview-label">
        SUMMARY
      </p>

      <p>
        Authentication middleware and session validation
        logic were modified across multiple API layers.
      </p>
    </div>

    <div className="tag-row">
      <span>Security</span>
      <span>Infrastructure</span>
      <span>Database</span>
    </div>
  </div>
</div>

        <div className="scroll-hint">
          <div className="mouse">
            <div className="wheel" />
          </div>
          
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <AnimatedSection className="stats-grid" delay={0}>
          {[
            { val: `${count.a}%`, label: "Faster PR reviews" },
            { val: `${count.b / 10}x`, label: "More bugs caught pre-merge" },
            { val: `${Math.round(count.c)}K+`, label: "Engineers using PRism" },
            { val: `${count.d}%`, label: "Uptime SLA" },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </AnimatedSection>
      </section>

      {/* INTELLIGENT REVIEW */}
      <section className="section-split">
        <AnimatedSection className="split-left" delay={0}>
          <p className="section-tag">INTELLIGENT CODE REVIEW</p>
          <h2 className="section-heading">Instantly understand what actually changed.</h2>
          <p className="section-description">
            PRism uses large language models tuned on millions of code reviews to identify
            architectural shifts, risky modifications, authentication changes, database
            migrations, and critical review areas — before code is merged.
          </p>
          <ul className="check-list">
            {["Detects auth and security changes automatically", "Surfaces breaking API modifications", "Identifies database schema drift", "Flags dependency version conflicts"].map(item => (
              <li key={item}>
                <span className="check-icon">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </AnimatedSection>

        <AnimatedSection className="split-right" delay={150}>
          <div className="floating-card">
            <div className="card-top">
              <div className="dots">
                <span /><span /><span />
              </div>
              <p className="card-title">AI Analysis Engine</p>
              <span className="card-live">● LIVE</span>
            </div>

            <div className="analysis-block">
              <div className="risk-row">
                <div className="risk">
                  <span className="risk-label">Risk Score</span>
                  <div className="risk-score">87</div>
                  <div className="risk-bar">
                    <div className="risk-fill" style={{ width: "87%" }} />
                  </div>
                </div>
                <div className="complexity">
                  <span className="risk-label">Complexity</span>
                  <div className="complexity-score">Medium</div>
                </div>
              </div>

              <div className="summary">
                <p className="mini-title">SUMMARY</p>
                <p>Authentication middleware and session validation logic were modified across multiple API layers. Potential JWT rotation vulnerability introduced in <code>auth/token.ts</code>.</p>
              </div>

              <div className="changed-files">
                <p className="mini-title">CHANGED FILES</p>
                <div className="file-list">
                  {[
                    { name: "auth/middleware.ts", type: "risk", lines: "+142 −38" },
                    { name: "api/session.ts", type: "warn", lines: "+67 −12" },
                    { name: "db/migrations/001.sql", type: "info", lines: "+23 −0" },
                  ].map(f => (
                    <div key={f.name} className="file-item">
                      <span className={`file-dot dot-${f.type}`} />
                      <span className="file-name">{f.name}</span>
                      <span className="file-lines">{f.lines}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tags">
                <span>Security</span>
                <span>Database</span>
                <span>Infrastructure</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FEATURES GRID */}
      <section className="features-section">
        <AnimatedSection className="features-header">
          <p className="section-tag">PLATFORM CAPABILITIES</p>
          <h2 className="section-heading center">Everything your team needs<br />to review with confidence.</h2>
        </AnimatedSection>

        <div className="features-grid">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} className="feature-card" delay={i * 80}>
              <div className="feature-icon" style={{ color: f.accent, borderColor: `${f.accent}22`, background: `${f.accent}10` }}>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <AnimatedSection className="how-header">
          <p className="section-tag">HOW IT WORKS</p>
          <h2 className="section-heading center">Up and running in minutes.</h2>
        </AnimatedSection>

        <div className="steps">
          {steps.map((s, i) => (
            <AnimatedSection key={s.num} className="step" delay={i * 120}>
              <div className="step-num">{s.num}</div>
              {i < steps.length - 1 && <div className="step-connector" />}
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <AnimatedSection className="testimonials-header">
          <p className="section-tag">TESTIMONIALS</p>
          <h2 className="section-heading center">What engineering teams say.</h2>
        </AnimatedSection>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} className="testimonial-card" delay={i * 100}>
              <div className="quote-mark">"</div>
              <p className="quote-text">{t.quote}</p>
              <div className="quote-author">
                <div className="author-avatar">{t.avatar}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <AnimatedSection className="cta-inner">
          <h2 className="cta-title">Start reviewing smarter.</h2>
          <p className="cta-desc">Join thousands of engineers who've eliminated blind merges forever.</p>
          <div className="hero-buttons">
            <button className="primary-btn">
              <span>Get Early Access</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="secondary-btn">Read the docs</button>
          </div>
        </AnimatedSection>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">
          <span className="logo-prism">PR</span><span className="logo-ism">ism</span>
        </div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Changelog</a>
          <a href="#">GitHub</a>
        </div>
        <p className="footer-copy">© 2025 PRism. All rights reserved.</p>
      </footer>
    </div>
  );
}