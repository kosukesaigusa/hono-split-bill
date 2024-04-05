export const parseQueryParameterToInt = (param: string): number | undefined => {
  if (param === undefined) {
    return undefined
  }
  const parsed = parseInt(param, 10)
  return isNaN(parsed) || parsed < 0 ? undefined : parsed
}
