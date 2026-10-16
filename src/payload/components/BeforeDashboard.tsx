/** A short welcome on the admin dashboard, written for the artist. */
export function BeforeDashboard() {
  return (
    <div style={{ marginBottom: "2rem", padding: "1.5rem 1.75rem", border: "1px solid var(--theme-elevation-150)", borderRadius: 6 }}>
      <h2 style={{ margin: 0 }}>Welcome back</h2>
      <p style={{ margin: "0.5rem 0 1rem", maxWidth: "60ch", color: "var(--theme-elevation-700)" }}>
        Changes appear on the site as soon as you press <strong>Publish</strong>. Use <strong>Save draft</strong> and{" "}
        <strong>Preview</strong> to check a page before it goes live.
      </p>
      <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7 }}>
        <li>
          <strong>Artworks</strong> — single pieces. Add an image, a title and a discipline.
        </li>
        <li>
          <strong>Projects</strong> — work with a story: brief, process images, films and credits.
        </li>
        <li>
          <strong>Site settings</strong> — the homepage picks, availability note and contact topics.
        </li>
        <li>
          <strong>Profile</strong> — your biography, portrait, email and social links.
        </li>
      </ul>
      <p style={{ margin: "1rem 0 0" }}>
        <a href="/" target="_blank" rel="noopener noreferrer">
          View the site ↗
        </a>
      </p>
    </div>
  );
}
