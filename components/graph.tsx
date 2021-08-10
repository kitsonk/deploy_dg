/** @jsx h */
/** @jsxFrag Fragment */
import { Component, Fragment, h, tw } from "../deps.ts";
import type {
  Dependency as GraphDependency,
  Module,
  ModuleGraph,
  ResolvedDependency as GraphResolvedDependency,
} from "../deps.ts";
import { assert, humanSize, isEven } from "../util.ts";

import { HoverLabel } from "./hover_label.tsx";

function getDependencies(
  module: Module,
  graph: ModuleGraph,
  seen: Set<string>,
  depth: number,
) {
  const dependencies = Object.entries(module.dependencies);
  const depLength = dependencies.length;
  const children: (Dependency | ResolvedDependency)[] = dependencies.map((
    [, dependency],
    i,
  ) => (
    <Dependency
      graph={graph}
      dependency={dependency}
      last={!module.typesDependency && i == depLength - 1}
      seen={seen}
      depth={depth}
    />
  ));
  if (module.typesDependency) {
    const [, resolved] = module.typesDependency;
    children.push(
      <ResolvedDependency
        graph={graph}
        resolved={resolved}
        last={true}
        seen={seen}
        depth={depth}
      />,
    );
  }
  return children;
}

interface GraphProps {
  graph: ModuleGraph;
}

export class Graph extends Component<GraphProps> {
  render() {
    try {
      const { graph } = this.props;
      const { modules } = graph;
      const modulesLength = modules.length;
      const totalSize = modules.reduce((p, m) => p += m.size, 0);
      const root = graph.get(graph.root);
      assert(root, "root module is missing from graph");
      const seen = new Set<string>();
      seen.add(root.specifier);
      const hasDependencies = !!Object.keys(root.dependencies).length;
      return (
        <div>
          <p>
            <HoverLabel
              tooltip="The media type determined for the root module."
            >
              Media type:
            </HoverLabel>
            {root.mediaType}
          </p>
          <p>
            <HoverLabel
              tooltip="The number of unique dependencies of the root module."
            >
              Dependencies (unique):
            </HoverLabel>
            {modulesLength - 1}
          </p>
          <p>
            <HoverLabel
              tooltip="The total size of the source code for all modules in the graph."
            >
              Total size:
            </HoverLabel>
            {humanSize(totalSize)}
          </p>
          <ul
            class={tw
              `bg-gray-50 rounded border border-gray-200 pl-1 py-0.5 mt-4`}
          >
            <li>
              <div>
                {root.specifier}
                <span>&nbsp;({humanSize(root.size)})</span>
              </div>
              {hasDependencies
                ? (
                  <ul
                    class={tw
                      `ml-4 bg-gray-100 border-l border-t border-gray-200 pl-1`}
                  >
                    {getDependencies(root, graph, seen, 0)}
                  </ul>
                )
                : undefined}
            </li>
          </ul>
        </div>
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return <div>{msg}</div>;
    }
  }
}

interface DependencyProps extends GraphProps {
  dependency: GraphDependency;
  last: boolean;
  seen: Set<string>;
  depth: number;
}

export class Dependency extends Component<DependencyProps> {
  render() {
    const { graph, dependency, last, seen, depth } = this.props;
    const { code, type } = dependency;
    if (code && type) {
      return (
        <>
          <ResolvedDependency
            graph={graph}
            resolved={code}
            last={false}
            seen={seen}
            depth={depth}
          />
          <ResolvedDependency
            graph={graph}
            resolved={type}
            last={last}
            seen={seen}
            depth={depth}
          />
        </>
      );
    } else if (code) {
      return (
        <ResolvedDependency
          graph={graph}
          resolved={code}
          last={last}
          seen={seen}
          depth={depth}
        />
      );
    } else if (type) {
      return (
        <ResolvedDependency
          graph={graph}
          resolved={type}
          last={last}
          seen={seen}
          depth={depth}
        />
      );
    }
  }
}

interface ResolvedDependencyProps extends GraphProps {
  resolved: GraphResolvedDependency;
  last: boolean;
  seen: Set<string>;
  depth: number;
}

export class ResolvedDependency extends Component<ResolvedDependencyProps> {
  render() {
    const { graph, resolved, seen, depth } = this.props;
    if (resolved.error) {
      return <li>${resolved.error}</li>;
    }
    try {
      assert(
        resolved.specifier,
        "resolved dependency didn't have error or specifier",
      );
      const module = graph.get(resolved.specifier);
      assert(module, "a module was unexpectedly missing");
      const alreadySeen = seen.has(module.specifier);
      const hasDependencies = !!Object.keys(module.dependencies).length;
      seen.add(module.specifier);
      return (
        <li>
          <p
            class={alreadySeen
              ? tw`text-gray-500 font-light`
              : tw`text-current`}
          >
            {alreadySeen
              ? module.specifier
              : (
                <a href={`/graph?url=${encodeURIComponent(module.specifier)}`}>
                  {module.specifier}
                </a>
              )}
            {alreadySeen ? <span>&nbsp;*</span>
            : <span>&nbsp;({humanSize(module.size)})</span>}
          </p>
          {alreadySeen || !hasDependencies ? null : (
            <ul
              class={isEven(depth)
                ? tw`ml-4 bg-gray-50 border-l border-t border-gray-200 pl-1`
                : tw`ml-4 bg-gray-100 border-l border-t border-gray-200 pl-1`}
            >
              {getDependencies(module, graph, seen, depth + 1)}
            </ul>
          )}
        </li>
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return <li>{msg}</li>;
    }
  }
}
