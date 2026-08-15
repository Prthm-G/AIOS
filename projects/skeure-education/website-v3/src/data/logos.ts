// Per-university logo registry.
//
// content.config.ts's schema is frozen, so logo metadata lives here instead of
// in each university's frontmatter, keyed by the university slug (the content
// entry id). Every entry records provenance: the official source the logo was
// taken from, or a note that the tile falls back to a text wordmark.
//
// `src` is a path under /public. Omit it to render the text-wordmark fallback
// in the logo banner (and no image in cards / detail headers / the programs
// view, where the university name is already shown as text).
//
// Logos are trademarks of their respective universities, shown here to identify
// the partner universities we counsel students into. Files sourced from each
// university's official website (or, for LPU, the Wikipedia infobox mirror of
// its official mark) in July 2026.

export interface UniversityLogo {
	/** Path under /public to the official logo file, e.g. "/logos/amity.webp". */
	src?: string;
	/** Official source URL, or "generated placeholder wordmark, not an official mark". */
	provenance: string;
	/** True only when `src` points at a verified official mark. */
	isOfficial: boolean;
	/** True when the mark cannot carry the university's name on its own at banner
	 * size — a seal whose ring text is too small to read (LPU), or a crest whose
	 * wordmark half we had to drop (Amity). Renders the name beneath the mark in
	 * the logo banner. Omit/false for wordmark logos that already read on white. */
	showName?: boolean;
}

export const universityLogos: Record<string, UniversityLogo> = {
	// The full amityonline.com mark draws "AMITY UNIVERSITY ONLINE" in white pixels
	// for a dark header, so it vanished on our light tiles. We ship the crest half of
	// that same file, cropped and otherwise unaltered, and set the name via showName.
	// The uncropped original stays at /logos/amity.webp as the provenance record.
	"amity-university-online": { src: "/logos/amity-crest.webp", provenance: "https://amityonline.com/ (official site logo, cropped to the crest)", isOfficial: true, showName: true },
	"lovely-professional-university": { src: "/logos/lpu.png", provenance: "https://en.wikipedia.org/wiki/Lovely_Professional_University (Wikipedia infobox mirror of the official mark; official CDN blocks hotlinking)", isOfficial: true, showName: true },
	"online-manipal-university": { src: "/logos/manipal.svg", provenance: "https://onlinemanipal.com/ (official site OM_Logo.svg)", isOfficial: true },
	"chandigarh-university-online": { src: "/logos/chandigarh.webp", provenance: "https://www.cuchd.in/ (official site logo)", isOfficial: true },
	"desh-bhagat-university": { src: "/logos/desh-bhagat.png", provenance: "https://deshbhagatuniversity.in/ (official site logo)", isOfficial: true },
	"gla-university-online": { src: "/logos/gla.webp", provenance: "https://www.gla.ac.in/ (official site logo)", isOfficial: true },
	"guru-kashi-university": { src: "/logos/gku.webp", provenance: "https://www.gku.ac.in/ (official site logo)", isOfficial: true },
	"jagat-guru-nanak-dev-psou": { src: "/logos/psou.png", provenance: "https://psou.ac.in/ (official site logo)", isOfficial: true },
	"mangalayatan-university-online": { src: "/logos/mangalayatan.webp", provenance: "https://www.mangalayatan.in/ (official site logo)", isOfficial: true },
	"mmu-university-online": { src: "/logos/mmu.webp", provenance: "https://www.mmumullana.org/ (official site logo)", isOfficial: true },
	"punjabi-university-online-distance": { src: "/logos/punjabi.png", provenance: "https://punjabiuniversity.ac.in/ (official site logo)", isOfficial: true },
};
