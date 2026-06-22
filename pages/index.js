import Head from "next/head";
import { useState } from "react";
import UploadBox from "../lib/UploadBox";
import AnalysisCard from "../lib/AnalysisCard";

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <>
      <Head>
        <title>STR AI Coach</title>
        <meta
          name="description"
          content="Upload a trading chart and get a structured, educational breakdown of market structure, liquidity, and key zones."
        />
      </Head>

      <main className="page">
        <div className="shell">
          <header className="header">
            <div className="eyebrow">Live Analysis Engine</div>
            <h1 className="title">STR AI Coach</h1>
            <p className="subtitle">
              Drop in a chart screenshot. Get a structured read on market structure,
              liquidity, and key zones — explained in terms of probability, not
              certainty, so you learn the reasoning behind every call.
            </p>
          </header>

          <UploadBox onResult={setResult} />
          <AnalysisCard result={result} />

          <footer className="footer">STR_AI · EDUCATIONAL TOOL · NOT FINANCIAL ADVICE</footer>
        </div>
      </main>
    </>
  );
}
