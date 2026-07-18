// Automated test runs (Codex, etc.) have left behind product/category rows
// named/slugged like "Codex ..." / "codex-...". These aren't real catalogue
// data, so they're filtered out everywhere instead of being deleted (category
// deletion isn't possible while products reference it via category_id FK,
// and we don't want to rely on hard-deleting test products either).
export const isTestEntry = (value: string | null | undefined): boolean =>
  !!value && value.trim().toLowerCase().startsWith('codex');