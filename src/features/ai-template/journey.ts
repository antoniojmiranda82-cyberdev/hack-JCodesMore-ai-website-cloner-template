export type JourneyState = {
  chapterIndex: number;
  chapterProgress: number;
  cameraZ: number;
  cameraY: number;
  lookY: number;
};

const CHAPTER_COUNT = 5;

export function getJourneyState(progress: number): JourneyState {
  const clamped = Math.min(1, Math.max(0, progress));
  const scaled = clamped * CHAPTER_COUNT;
  const chapterIndex = Math.min(CHAPTER_COUNT - 1, Math.floor(scaled));
  const chapterProgress = clamped === 1 ? 1 : scaled - chapterIndex;

  return {
    chapterIndex,
    chapterProgress,
    cameraZ: 18 - clamped * 40,
    cameraY: 2.4 + Math.sin(clamped * Math.PI * 2) * 0.45 + clamped * 2.2,
    lookY: 2.1 + clamped * 1.35,
  };
}
