export type Route = [
  RegExp,
  (match: RegExpMatchArray) => unknown
]

export function callRoute(path: string, routes: Route[]) {
  for (const [route, fn] of routes) {
    const match = path.match(route);
    if(match) {
      fn(match)
      break
    }
  }
}
