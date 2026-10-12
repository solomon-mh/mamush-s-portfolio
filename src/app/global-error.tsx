"use client";

import Link from "next/link";

/** Last-resort boundary if the root layout itself fails. Keeps styling inline. */
export default function GlobalError() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f7f5f0", color: "#191919", padding: "4rem 1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 400 }}>The site couldn&apos;t be loaded</h1>
        <p style={{ color: "#686868", maxWidth: "36rem" }}>Please refresh the page in a moment.</p>
        <Link href="/" style={{ color: "#191919" }}>
          Go to the homepage
        </Link>
      </body>
    </html>
  );
}
