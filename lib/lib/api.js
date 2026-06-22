const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class UploadError extends Error {}

export async function uploadChart(file) {
  const formData = new FormData();
  formData.append("file", file);

  let res;
  try {
    res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    throw new UploadError(
      "Couldn't reach the analysis server. Is the backend running?"
    );
  }

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new UploadError("The server sent back something unexpected.");
  }

  if (!res.ok) {
    throw new UploadError(data?.detail || "Analysis failed. Please try again.");
  }

  return data;
}
