export default function Footer() {
  return (
    <footer
      style={{ background: "var(--surface)", color: "var(--muted)" }}
      className="py-3"
    >
      <div className="site-container text-center">
        <p>© {new Date().getFullYear()} My Portfolio. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
