import { useState, useEffect } from "react";

function Typewriter({ text }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index));

      index++;

      if (index > text.length) {
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [text]);

  return <p>{displayed}</p>;
}
export default function Analyze() {
  const [loading, setLoading] = useState(false);
const [showResult, setShowResult] = useState(false);

const [prUrl, setPrUrl] = useState("");
const [result, setResult] = useState(null);

  return (
    <div className="analyze-page">
      <div className="analyze-bg"></div>
      <div className="cyber-grid"></div>

<div className="scan-line"></div>

<div className="floating-node node1"></div>
<div className="floating-node node2"></div>
<div className="floating-node node3"></div>

      <div className="analyze-container">
        <p className="analyze-tag">
          AI PULL REQUEST ANALYSIS
        </p>

        <h1 className="analyze-title">
          Paste your GitHub
          <br />
          pull request link.
        </h1>

        <p className="analyze-subtitle">
          PRism will generate an AI-powered summary,
          risk score, archictecture analysis,
          and review insights instantly.
        </p>

        <div className="analyze-box">
          <input
  type="text"
  placeholder="https://github.com/org/repo/pull/142"
  className="pr-input"
  value={prUrl}
  onChange={(e) => setPrUrl(e.target.value)}
/>

          <button
            className="analyze-btn"
            onClick={async () => {
  try {
    setShowResult(false);
    setLoading(true);

    const response = await fetch(
      "http://localhost:5000/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prUrl,
        }),
      }
    );

    const data = await response.json();

    setResult(data);

    setLoading(false);
    setShowResult(true);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
}}
          >
            {loading ? "Analyzing..." : "Analyze PR"}
          </button>
        </div>

        {loading && (
          <div className="loading-panel thinking">
            <div className="loading-bar"></div>

            <div className="loading-steps">
              <p>Reading pull request diff...</p>
              <p>Analyzing architecture changes...</p>
              <p>Detecting security signals...</p>
              <p>Generating AI summary...</p>
            </div>
          </div>
        )}

        {showResult && (
          <div className="result-panel">
            <div className="intel-grid">
  <div className="intel-card">
    <p className="intel-label">
      FILES CHANGED
    </p>

    <h2>
      {result.changedFiles}
    </h2>
  </div>

  <div className="intel-card">
    <p className="intel-label">
      ADDITIONS
    </p>

    <h2>
      +{result.additions}
    </h2>
  </div>

  <div className="intel-card">
    <p className="intel-label">
      DELETIONS
    </p>

    <h2>
      -{result.deletions}
    </h2>
  </div>
</div>
            <div className="result-top">
              <div>
                <p className="result-label">
                  Risk Score
                </p>

                <h1 className="result-risk">
                  {result?.riskScore}
                </h1>
              </div>

              <div>
                <p className="result-label">
                  Complexity
                </p>

                <h3 className="result-complexity">
                  {result?.complexity}
                </h3>
              </div>
            </div>

            <div className="result-summary">
              <p className="result-label">
                AI SUMMARY
              </p>

              <Typewriter text={result.summary} />
            </div>

            <div className="result-tags">
  {result?.tags?.map((tag) => (
    <span key={tag}>
      {tag}
    </span>
  ))}
</div>
          </div>
        )}
      </div>
    </div>
  );
}