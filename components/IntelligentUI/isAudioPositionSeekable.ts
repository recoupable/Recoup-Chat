export function isAudioPositionSeekable(
  ranges: TimeRanges,
  position: number,
): boolean {
  for (let index = 0; index < ranges.length; index++) {
    if (position >= ranges.start(index) && position <= ranges.end(index))
      return true;
  }
  return false;
}
