export const isExpired = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return false
  }

  return value * 1000 < Date.now()
}