import { useState, useRef, useCallback } from "react";
import { uploadChart, UploadError } from "./api";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE_MB = 8;

export default function UploadBox({ onResult }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateAndSet = useCallback((selected) => {
    setError(null);

    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Unsupported file type. Please use PNG, JPEG, or WEBP.");
      return;
    }

    const sizeMb = selected.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      setError(`File is too large (${sizeMb.toFixed(1)}MB). Max is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    onResult(null);
  }, [onResult]);

  function handleInputChange(e) {
    validateAndSet(e.target.files?.[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  }

  function clearFile() {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    onResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await uploadChart(file);
      onResult(data.analysis);
    } catch (err) {
      if (err instanceof UploadError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className={`upload-box ${isDragging ? "is-dragging" : ""} ${error ? "has-error" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span className="upload-corner-label">CHART_INPUT</span>

        {!previewUrl ? (
          <label className="upload-surface">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 16l5-5a2 2 0 0 1 2.8 0L15 15" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 13l1.7-1.7a2 2 0 0 1 2.8 0L21 15" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
            </svg>
            <p className="upload-headline">Drop a chart screenshot, or click to browse</p>
            <p className="upload-hint">PNG · JPEG · WEBP — max {MAX_SIZE_MB}MB</p>
            <input
              ref={inputRef}
              className="upload-input"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={handleInputChange}
            />
          </label>
        ) : (
          <div className="preview-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="preview-image" src={previewUrl} alt="Chart preview" />
            <div className="preview-bar">
              <span className="preview-filename">{file?.name}</span>
              <button className="preview-clear" onClick={clearFile} type="button">
                CLEAR
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <button
        className="analyze-button"
        onClick={handleAnalyze}
        disabled={!file || loading}
        type="button"
      >
        {loading ? "ANALYZING…" : "ANALYZE CHART"}
      </button>

      {loading && (
        <div className="status-row">
          <span className="spinner" />
          <span>Running market structure, liquidity, and zone analysis…</span>
        </div>
      )}
    </div>
  );
}
