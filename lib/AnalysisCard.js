const SECTION_DEFS = [
  { key: "MARKET STRUCTURE", num: "01" },
  { key: "LIQUIDITY ANALYSIS", num: "02" },
  { key: "KEY ZONES", num: "03" },
  { key: "SETUP QUALITY", num: "04" },
  { key: "RISK INSIGHT", num: "05" },
  { key: "EDUCATION INSIGHT", num: "06" },
];

function parseSections(text) {
  const pattern = /(\d+)\.\s*(MARKET STRUCTURE|LIQUIDITY ANALYSIS|KEY ZONES|SETUP QUALITY[^\n]*|RISK INSIGHT|EDUCATION INSIGHT)/gi;
  const matches = [...text.matchAll(pattern)];

  if (matches.length === 0) {
    return null;
  }

  const sections = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const rawTitle = matches[i][2].trim();
    const body = text.slice(start, end).trim().replace(/^[:\-\s]+/, "");
    sections.push({ rawTitle, body });
  }
  return sections;
}

function getBadgeClass(body) {
  const lower = body.toLowerCase();
  if (lower.includes("high")) return "high";
  if (lower.includes("medium")) return "medium";
  if (lower.includes("low")) return "low";
  return null;
}

export default function AnalysisCard({ result }) {
  if (!result) return null;

  const sections = parseSections(result);

  return (
    <div className="analysis">
      <div className="analysis-meta">
        <span>STR_AI_OUTPUT</span>
        <span>EDUCATIONAL ANALYSIS — NOT FINANCIAL ADVICE</span>
      </div>

      {sections ? (
        sections.map((section, i) => {
          const def = SECTION_DEFS[i] || { num: String(i + 1).padStart(2, "0") };
          const isQuality = section.rawTitle.toUpperCase().startsWith("SETUP QUALITY");
          const badgeClass = isQuality ? getBadgeClass(section.body) : null;

          return (
            <div className="panel" key={i}>
              <div className="panel-header">
                <span className="panel-index">{def.num}</span>
                <span className="panel-title">{section.rawTitle.toUpperCase()}</span>
                {badgeClass && <span className={`badge ${badgeClass}`}>{badgeClass}</span>}
              </div>
              <div className="panel-body">{section.body}</div>
            </div>
          );
        })
      ) : (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-index">00</span>
            <span className="panel-title">ANALYSIS</span>
          </div>
          <div className="panel-body">{result}</div>
        </div>
      )}

      <div className="disclaimer">
        <strong>Educational use only.</strong> STR AI Coach explains probability and
        market concepts — it does not predict outcomes or recommend trades. Always
        manage your own risk.
      </div>
    </div>
  );
}
