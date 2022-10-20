export function parseQueryArray(q: undefined | string | string[]): number[] {
  switch (typeof q) {
    case "string":
      return [parseInt(q)];
    case "object": // array
      return q.map((e) => parseInt(e));
    case "undefined":
      return [];
  }
}

export function parseQuery(q: undefined | string | string[]): number {
  switch (typeof q) {
    case "string":
      return parseInt(q);
    case "object": // array
      console.warn("unexpected array in query parameter", q);
      return q.map((e) => parseInt(e))[0];
    case "undefined":
      return 0;
  }
}
