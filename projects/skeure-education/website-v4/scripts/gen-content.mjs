// Build-time content codegen. Reads the markdown collections and writes a single
// bundled JSON (`src/content/_generated.json`) that the app imports. This replaces
// runtime `fs` reads, which return nothing under OpenNext/Cloudflare Workers (the
// content files are not on a readable filesystem in workerd) — bundling the data
// into JS makes it work whether a page renders at build time or in the Worker.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "src", "content");
const COLLECTIONS = ["universities", "faqs", "blog", "testimonials"];

const out = {};
for (const c of COLLECTIONS) {
  const dir = path.join(ROOT, c);
  if (!fs.existsSync(dir)) {
    out[c] = [];
    continue;
  }
  out[c] = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw); // Date frontmatter → ISO strings via JSON
      return { id: file.replace(/\.md$/, ""), data, body: content };
    });
}

const target = path.join(ROOT, "_generated.json");
fs.writeFileSync(target, JSON.stringify(out));
console.log(`gen-content → ${COLLECTIONS.map((c) => `${c}=${out[c].length}`).join(" ")}`);
