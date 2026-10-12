// Guard for the Krane list/stats parsers.
//
// The Krane views parse `kubectl` output by walking the string character-by-
// character with unbounded `while (arg[i] !== <delimiter>)` loops. When the
// cluster or Docker is down, kubectl writes an error to stderr (or returns
// nothing), and the main process forwards that text on the same channel the
// parser listens on. Fed non-table text, those loops run off the end of the
// string — `arg[i]` becomes `undefined`, which never equals the delimiter — so
// they push `undefined` forever, growing an array without bound until the
// renderer's heap is exhausted (a JavaScript "heap out of memory" crash).
//
// Calling this at the top of each parser means it only runs on well-formed
// table output (a header row plus at least one data row) and safely no-ops on
// anything else (empty output, "No resources found", connection errors).
export function isParseableKubectlTable(arg: unknown): boolean {
  if (typeof arg !== "string") return false;

  const trimmed = arg.trim();
  if (trimmed === "") return false;

  // Recognizable kubectl / connection failures (may span multiple lines).
  if (
    /^(error\b|unable to connect|the connection to the server|no resources found)/i.test(
      trimmed
    )
  ) {
    return false;
  }

  // A valid table is a header row plus at least one resource row.
  const rows = arg.split("\n").filter((line) => line.trim().length > 0);
  return rows.length >= 2;
}
