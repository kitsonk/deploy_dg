/** @jsx h */
import { Body } from "../components/body.tsx";
import { Graph } from "../components/graph.tsx";
import {
  createGraph,
  getStyleTag,
  h,
  load,
  renderSSR,
  Status,
} from "../deps.ts";
import type { RouterContext, RouterMiddleware } from "../deps.ts";
import { sheet } from "../shared.ts";
import { getBody } from "../util.ts";

export const graphGetPost: RouterMiddleware = async (ctx: RouterContext) => {
  sheet.reset();
  ctx.assert(ctx.request.method === "GET" || ctx.request.method === "POST");
  let root: string;
  if (ctx.request.hasBody) {
    const body = ctx.request.body();
    ctx.assert(
      body.type === "form" || body.type === "form-data",
      Status.BadRequest,
      "Only form or form-data bodies supported.",
    );
    switch (body.type) {
      case "form": {
        const bodyValue = await body.value;
        const url = bodyValue.get("url");
        ctx.assert(url, Status.BadRequest, `Missing "url" property in form.`);
        root = url;
        break;
      }
      case "form-data": {
        const bodyValue = await body.value.read();
        const url = bodyValue.fields["url"];
        ctx.assert(
          url,
          Status.BadRequest,
          `Missing "url" property in form-data.`,
        );
        root = url;
      }
    }
  } else {
    const url = ctx.request.url.searchParams.get("url");
    ctx.assert(url, Status.BadRequest, `Missing "url" query.`);
    root = url;
  }

  console.log("root:", root);
  const graph = await createGraph(root, { load });
  console.log("graph.root:", graph.root);
  ctx.response.body = getBody(
    renderSSR(
      <Body title="deno_graph" subtitle={root}>
        <Graph graph={graph} />
      </Body>,
    ),
    getStyleTag(sheet),
  );
  ctx.response.type = "html";
};
