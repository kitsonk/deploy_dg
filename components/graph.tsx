/** @jsx h */
/** @jsxFrag Fragment */
import { Component, Fragment, h, tw } from "../deps.ts";
import type {
  Dependency as GraphDependency,
  Module,
  ModuleGraph,
  ResolvedDependency as GraphResolvedDependency,
} from "../deps.ts";
import { assert } from "../util.ts";

function getDependencies(
  module: Module,
  graph: ModuleGraph,
  seen: Set<string>,
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
      const root = graph.get(graph.root);
      assert(root, "root module is missing from graph");
      const seen = new Set<string>();
      seen.add(root.specifier);
      return (
        <div>
          <p>{root.specifier}</p>
          <ul class={tw`ml-4`}>{...getDependencies(root, graph, seen)}</ul>
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
}

export class Dependency extends Component<DependencyProps> {
  render() {
    const { graph, dependency, last, seen } = this.props;
    const { code, type } = dependency;
    if (code && type) {
      return (
        <>
          <ResolvedDependency
            graph={graph}
            resolved={code}
            last={false}
            seen={seen}
          />
          <ResolvedDependency
            graph={graph}
            resolved={type}
            last={last}
            seen={seen}
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
        />
      );
    } else if (type) {
      return (
        <ResolvedDependency
          graph={graph}
          resolved={type}
          last={last}
          seen={seen}
        />
      );
    }
  }
}

interface ResolvedDependencyProps extends GraphProps {
  resolved: GraphResolvedDependency;
  last: boolean;
  seen: Set<string>;
}

export class ResolvedDependency extends Component<ResolvedDependencyProps> {
  render() {
    const { graph, resolved, seen } = this.props;
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
      seen.add(module.specifier);
      return (
        <li>
          <p>
            {module.specifier}
            {alreadySeen ? <span>*</span> : <span>{module.size}</span>}
          </p>
          {alreadySeen ? null : (
            <ul class={tw`ml-4`}>
              {...getDependencies(module, graph, seen)}
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
