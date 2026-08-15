// Real campus photos for university tile cards, keyed by content-collection
// slug. Mirrors the provenance-tracking pattern in logos.ts: every entry
// records where the image actually came from. Universities with no entry
// here fall back to a logo-only card (see UniversityCard.astro) rather than
// a stand-in photo.
//
// Two kinds of source, distinguished by `isOfficial`:
//
//   - University's own material (brochure/prospectus). isOfficial: true, and
//     the licence fields stay unset.
//   - Wikimedia Commons, under a Creative Commons licence. isOfficial: false,
//     and every licence field is required — attribution is a condition of use.
//     src/pages/credits.astro renders those credits from this file, so an
//     entry added here is credited automatically and the two cannot drift.
//
// Commons files are served resized but never cropped: UniversityCard frames
// them with aspect-[4/3] + object-cover, so the browser does the cropping and
// we distribute an unmodified copy. That keeps CC BY-SA to its attribution
// obligation without making our asset a derivative work.
export interface CampusImage {
	src: string;
	alt: string;
	provenance: string;
	isOfficial: boolean;
	retrievedAt: string; // YYYY-MM-DD
	/** Licence short name, e.g. "CC BY-SA 4.0". Commons entries only. */
	license?: string;
	/** Canonical licence deed URL. Commons entries only. */
	licenseUrl?: string;
	/** Author to credit, exactly as named on the file page. Commons entries only. */
	author?: string;
	/** Commons file page, so the credit links back to the source. */
	sourceUrl?: string;
}

export const campusImages: Record<string, CampusImage> = {
	"amity-university-online": {
		src: "/campus/amity.jpg",
		alt: "Amity University's Noida campus building, seen from the approach road",
		provenance: "Wikimedia Commons, File:Amity Campus Noida Delhi.jpg",
		isOfficial: false,
		retrievedAt: "2026-07-25",
		license: "CC BY 4.0",
		licenseUrl: "https://creativecommons.org/licenses/by/4.0",
		author: "Hghulam49",
		sourceUrl: "https://commons.wikimedia.org/wiki/File:Amity_Campus_Noida_Delhi.jpg",
	},
	"lovely-professional-university": {
		src: "/campus/lpu.jpg",
		alt: "Lovely Professional University's admission block and open-air amphitheatre",
		// Uploaded to Commons as the photographer's own work; we rely on that
		// licence in good faith and credit it in full on /credits/.
		provenance: "Wikimedia Commons, File:Admission-block-copy.jpg (uploader's own work)",
		isOfficial: false,
		retrievedAt: "2026-07-25",
		license: "CC BY-SA 4.0",
		licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
		author: "Tanya2016",
		sourceUrl: "https://commons.wikimedia.org/wiki/File:Admission-block-copy.jpg",
	},
	"chandigarh-university-online": {
		src: "/campus/chandigarh.jpg",
		alt: "Academic blocks on Chandigarh University's south campus",
		provenance: "Wikimedia Commons, File:South Campus Chandigarh University.jpg",
		isOfficial: false,
		retrievedAt: "2026-07-25",
		license: "CC BY-SA 4.0",
		licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
		author: "Navyison",
		sourceUrl: "https://commons.wikimedia.org/wiki/File:South_Campus_Chandigarh_University.jpg",
	},
	"desh-bhagat-university": {
		src: "/campus/desh-bhagat.jpg",
		alt: "Desh Bhagat University campus entrance and main building",
		provenance:
			"Extracted from Desh Bhagat University's own official brochure, database/unprocessed/DBU-Online-Brochure-2025-26.pdf (page 27)",
		isOfficial: true,
		retrievedAt: "2026-07-25",
	},
	"punjabi-university-online-distance": {
		src: "/campus/punjabi.jpg",
		alt: "The main gate and approach road at Punjabi University, Patiala",
		provenance: "Wikimedia Commons, File:PUP Gate.jpg",
		isOfficial: false,
		retrievedAt: "2026-07-25",
		license: "CC BY-SA 3.0",
		licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
		author: "Markande at English Wikipedia",
		sourceUrl: "https://commons.wikimedia.org/wiki/File:PUP_Gate.jpg",
	},
};
