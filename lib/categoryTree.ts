// Categories form a shallow tree via `parentId` (see convex/schema.ts). This
// file has the pure helpers for working with that tree from a flat list —
// shared by the public site, the admin category screens, and Convex functions
// that need to reject a cyclical parent assignment.

export type CategoryNode = {
  _id: string;
  slug: string;
  name: string;
  sortOrder: number;
  parentId?: string;
};

export function topLevel<T extends CategoryNode>(categories: T[]): T[] {
  return categories.filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function childrenOf<T extends CategoryNode>(categories: T[], parentId: string): T[] {
  return categories.filter((c) => c.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function ancestorsOf<T extends CategoryNode>(categories: T[], id: string): T[] {
  const byId = new Map(categories.map((c) => [c._id, c]));
  const chain: T[] = [];
  let current = byId.get(id);
  while (current?.parentId) {
    const parent = byId.get(current.parentId);
    if (!parent) break;
    chain.unshift(parent);
    current = parent;
  }
  return chain;
}

// All descendant ids (children, grandchildren, …) of `id`, not including `id`
// itself. Used to reject a parent choice that would create a cycle.
export function descendantIdsOf<T extends CategoryNode>(categories: T[], id: string): Set<string> {
  const result = new Set<string>();
  const queue = [id];
  while (queue.length > 0) {
    const current = queue.pop()!;
    for (const c of categories) {
      if (c.parentId === current && !result.has(c._id)) {
        result.add(c._id);
        queue.push(c._id);
      }
    }
  }
  return result;
}
