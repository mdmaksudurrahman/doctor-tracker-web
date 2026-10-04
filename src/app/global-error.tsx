"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
    return (
        <html lang="en">
            <body
                style={{
                    fontFamily: "system-ui, sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    minHeight: "100vh",
                    margin: 0,
                }}
            >
                <h1 style={{ fontSize: 20, margin: 0 }}>Something went wrong</h1>
                <p style={{ margin: 0, color: "#666" }}>An unexpected error occurred.</p>
                <button
                    onClick={reset}
                    style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
                >
                    Try again
                </button>
            </body>
        </html>
    );
}