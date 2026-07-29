// Merging of persisted chart history (saved to disk by the main process at
// intervals) with the points the collector has gathered this session.

// Merge per name: previous-session points first, this session's after, sorted
// by timestamp, duplicate timestamps dropped (a save can race a collection
// tick), capped to the newest `cap` points.
export function mergeStatsHistory(loaded: any, current: any, cap: number) {
  const merged: any = { ...current };
  if (!loaded || typeof loaded !== "object") return merged;
  for (const name of Object.keys(loaded)) {
    const old = Array.isArray(loaded[name]) ? loaded[name] : [];
    const cur = Array.isArray(merged[name]) ? merged[name] : [];
    const all = [...old, ...cur].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const dedup = all.filter((p, i) => i === 0 || p.date !== all[i - 1].date);
    merged[name] = dedup.length > cap ? dedup.slice(-cap) : dedup;
  }
  return merged;
}
