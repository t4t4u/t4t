export function isArray(obj: unknown): obj is readonly unknown[] {
  return Array.isArray(obj)
}
