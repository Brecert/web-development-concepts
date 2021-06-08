export type Routes = [RegExp, (match: RegExpMatchArray) => unknown][];

export function checkRoute(path: string, routes: Routes) {
  for (let [regex, fn] of routes) {
    const match = path.match(regex);
    if (match != null) {
      return fn(match);
    }
  }
}