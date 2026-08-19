// THE LONG OPEN — the beat map.
//
// The homepage is one continuous shot: a laptop that opens across the whole page.
// It starts shut and it never closes. Every beat below widens the lid a few more
// degrees and lights one more line on the black screen.
//
// This file is the whole choreography. Editing it re-cuts the film — no engine
// changes needed. `open` must increase monotonically down the list; the engine
// asserts that in development, because a lid that goes backwards is the exact
// failure this rebuild exists to fix.
//
// PLACEHOLDER NOTICE — `glass` lines are seeded from src/content/faqs and ordered
// the way the questions tend to arrive. Pratham is supplying the real doubts, in
// the real order, from actual counselling conversations. Swap them here.

export interface FilmBeat {
  /** Stable id, also the DOM id of the section it drives. */
  id: string;
  /** Lid openness at this beat, 0 = shut, 1 = fully open. Must ascend. */
  open: number;
  /**
   * The line that lights on the laptop screen at this beat. Decorative and
   * aria-hidden — the indexable copy is the section itself. Keep these short;
   * they are set in mono at roughly 22 characters to the line.
   */
  glass: string;
}

export const filmBeats: FilmBeat[] = [
  { id: "arrive", open: 0.0, glass: "" },
  { id: "trust", open: 0.16, glass: "recognised degree" },
  { id: "partners", open: 0.34, glass: "real universities" },
  { id: "process", open: 0.52, glass: "a person, not a form" },
  { id: "cost", open: 0.68, glass: "costs in writing" },
  { id: "questions", open: 0.84, glass: "ask us anything" },
  { id: "invite", open: 1.0, glass: "" },
];

/** Mobile ships 8 stills instead of a 61-frame scrub. Beat n uses b-{n}.webp. */
export const mobileBeatSrc = (i: number) => `/render/frames/mobile/b-${i + 1}.webp`;

/** Desktop scrub source. 61 frames, graded to sit on the page field. */
export const FRAME_COUNT = 61;
export const desktopFrameSrc = (i: number) =>
  `/render/frames/desktop/f-${String(i).padStart(3, "0")}.webp`;
