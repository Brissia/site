import { contentTitle, getAllContent, getConnections, getTags, tagsOf } from "@/lib/content";
import type { Collection } from "@/types/content";
import { tagSlug } from "@/utils/format";

export interface GraphNode {
  id: string;
  label: string;
  url: string;
  kind: Collection | "tag";
  /** Number of threads that reach this node. */
  degree: number;
  x: number;
  y: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: { from: GraphNode; to: GraphNode; strong: boolean }[];
  size: number;
}

const SIZE = 1000;

/**
 * The knowledge graph: every piece, every topic used more than once, and the threads between them.
 * Positions are worked out when the site is built, with a small force layout that always starts
 * from the same arrangement, so the drawing is plain SVG: no script, no library, same picture every time.
 */
export function buildGraph(): Graph {
  const items = getAllContent();
  const tags = getTags().filter((t) => t.count > 1);
  const tagIds = new Set(tags.map((t) => t.slug));

  const nodes: GraphNode[] = [
    ...tags.map((t) => ({ id: `tag/${t.slug}`, label: t.label, url: `/tags/${t.slug}`, kind: "tag" as const })),
    ...items.map((i) => ({ id: `${i.collection}/${i.slug}`, label: contentTitle(i), url: i.url, kind: i.collection })),
  ].map((n, i, all) => {
    const angle = (i / all.length) * Math.PI * 2;
    const radius = n.kind === "tag" ? 180 : 380;
    return { ...n, degree: 0, x: SIZE / 2 + Math.cos(angle) * radius, y: SIZE / 2 + Math.sin(angle) * radius };
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const seen = new Set<string>();
  const edges: Graph["edges"] = [];
  const connect = (a: string, b: string, strong: boolean) => {
    const from = byId.get(a);
    const to = byId.get(b);
    const key = [a, b].sort().join("|");
    if (!from || !to || from === to || seen.has(key)) return;
    seen.add(key);
    from.degree += 1;
    to.degree += 1;
    edges.push({ from, to, strong });
  };
  for (const item of items) {
    const id = `${item.collection}/${item.slug}`;
    for (const other of getConnections(item)) connect(id, `${other.collection}/${other.slug}`, true);
    for (const tag of tagsOf(item)) if (tagIds.has(tagSlug(tag))) connect(id, `tag/${tagSlug(tag)}`, false);
  }

  // Force layout: everything pushes apart, threads pull together, the center holds it in frame.
  for (let step = 0; step < 320; step++) {
    const heat = 1 - step / 320;
    const move = nodes.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x || 0.01 * (i - j);
        const dy = nodes[i].y - nodes[j].y || 0.01;
        const d2 = Math.max(dx * dx + dy * dy, 64);
        const push = 2600 / d2;
        const d = Math.sqrt(d2);
        move[i].x += (dx / d) * push;
        move[i].y += (dy / d) * push;
        move[j].x -= (dx / d) * push;
        move[j].y -= (dy / d) * push;
      }
    }
    for (const { from, to, strong } of edges) {
      const i = nodes.indexOf(from);
      const j = nodes.indexOf(to);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      // Hubs hold their threads loosely so their many neighbors can spread out.
      const pull = ((d - (strong ? 70 : 110)) * (strong ? 0.06 : 0.03)) / Math.sqrt(Math.max(from.degree, to.degree));
      move[i].x += (dx / d) * pull * 4;
      move[i].y += (dy / d) * pull * 4;
      move[j].x -= (dx / d) * pull * 4;
      move[j].y -= (dy / d) * pull * 4;
    }
    nodes.forEach((n, i) => {
      move[i].x += (SIZE / 2 - n.x) * 0.012;
      move[i].y += (SIZE / 2 - n.y) * 0.012;
      const length = Math.sqrt(move[i].x ** 2 + move[i].y ** 2) || 1;
      const limit = Math.min(length, 4 + 26 * heat);
      n.x += (move[i].x / length) * limit;
      n.y += (move[i].y / length) * limit;
    });
  }

  // Fit the drawing to the frame, with room for labels.
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const scale = (SIZE - 120) / Math.max(maxX - minX, maxY - minY, 1);
  for (const n of nodes) {
    n.x = Math.round((60 + (n.x - minX) * scale + ((SIZE - 120) - (maxX - minX) * scale) / 2) * 10) / 10;
    n.y = Math.round((60 + (n.y - minY) * scale + ((SIZE - 120) - (maxY - minY) * scale) / 2) * 10) / 10;
  }

  return { nodes, edges, size: SIZE };
}
