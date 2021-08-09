export function assert(cond: unknown, msg = "Assertion failed"): asserts cond {
  if (!cond) {
    throw new Error(msg);
  }
}

export function getBody(body: string, styles: string): string {
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>deno_graph</title>
      ${styles}
      <script src="https://kit.fontawesome.com/c2b13ee81b.js" crossorigin="anonymous"></script>
    </head>
    ${body}
  </html>`;
}
