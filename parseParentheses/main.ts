import type { Node, Pair } from "./types.ts";

export function getTree(src: string) {
  src = src.replace(/\s/g, "");

  if (src.length % 2 !== 0) {
    return null;
  }

  const nodes = getNodes(src);
  const idMap = getIdMap(nodes);

  let root: Node = { parentId: null, id: 0 };

  for (let node of nodes) {
    if (node.parentId == null) {
      root = node;

      continue;
    }

    const parentNode = nodes[idMap[node.parentId]];

    parentNode.children = [...(parentNode.children || []), node];
  }

  return root;
}

export function getNodes(src: string): Node[] {
  let leadingParens: number[] = [];
  let nodes: Node[] = [];

  let prevEvenLeadingParenIndex = 0;
  let prevOddLeadingParenIndex = 0;
  let prevLeadingParenIndex = 0;

  let parentId: number | null = null;

  for (let i = 0; i < src.length; i++) {
    const curChar = src.charAt(i);
    const isEven = i % 2 === 0;

    if (curChar === "(") {
      leadingParens.push(i);

      if (prevLeadingParenIndex + 1 === i) {
        parentId = prevLeadingParenIndex;
      } else if (isEven && i !== 0) {
        parentId = prevOddLeadingParenIndex;
      } else if (i !== 0) {
        parentId = prevEvenLeadingParenIndex;
      }

      nodes.push({ id: i, parentId });

      if (isEven) {
        prevEvenLeadingParenIndex = i;
      } else {
        prevOddLeadingParenIndex = i;
      }

      prevLeadingParenIndex = i;
    }
  }

  return nodes;
}

export function getIdMap(nodes: Node[]) {
  let idMap: Record<number, number> = {};

  for (let [i, node] of nodes.entries()) {
    idMap[node.id] = i;
  }

  return idMap;
}

export function getPairs(src: string) {
  let leadingParens: number[] = [];
  let pairs: Pair[] = [];

  for (let i = 0; i < src.length; i++) {
    const curChar = src[i] as string | undefined;

    if (curChar === "(") {
      leadingParens.push(i);
    }

    if (curChar === ")") {
      const lastLeadingParen = leadingParens.pop();

      if (lastLeadingParen != null) {
        const newPair: Pair = [lastLeadingParen, i];

        pairs.push(newPair);
      }
    }
  }

  const sortedPairs = pairs.sort((a, b) => a[0] - b[0]);

  return sortedPairs;
}

interface Node2 {
  pair: Pair;
  children?: Node2[];
}

export function getTree2(src: string) {
  const pairs = getPairs(src);
  const nodes: Node2[] = pairs.map((pair) => ({ pair }));

  let parentNodes: Node2[] = [nodes[0]];

  for (const [i, node] of nodes.entries()) {
    const {
      pair: [leading],
    } = node;

    const prevNode = nodes[i - 1] as Node2 | undefined;
    const nextNode = nodes[i + 1] as Node2 | undefined;
    const parentNode = parentNodes[parentNodes.length - 1];

    const {
      pair: [lpL],
    } = parentNode;

    const isChild = lpL + 1 === leading;
    const isSiblingOfPrev = prevNode ? prevNode.pair[1] + 1 === leading : false;

    if (isNodeEqual(node, nodes[0])) {
      continue;
    }

    // direct first child
    else if (isChild || isSiblingOfPrev) {
      (parentNode.children ??= []).push(node);
    }
    // if not a child or sibling
    // then we have completed this iteration
    else {
      console.log("~~~~~~~~~~~~~~~~~~");
      console.log(
        "PARENT NODE",
        leading,
        parentNodes.map((el) => el.pair)
      );
      console.log("~~~~~~~~~~~~~~~~~~");

      let sliceEndIndex = 0;

      for (
        let i = parentNodes.length - 1;
        leading !== parentNodes[i].pair[1] + 1;
        i--
      ) {
        console.log("IS CHILD", i, parentNodes[i].pair);

        sliceEndIndex = i;
      }

      sliceEndIndex -= 1;

      console.log(
        "SPLICE INDEX",
        parentNodes.map((el) => el.pair),
        sliceEndIndex
      );

      parentNodes = parentNodes.slice(0, sliceEndIndex);

      console.log(
        "ONE LAST TIME",
        parentNodes.map((el) => el.pair)
      );

      const curParentNodes = parentNodes[parentNodes.length - 1];

      (curParentNodes.children ?? []).push(node);
    }

    // check if next node is child of this node
    if (leading + 1 === nextNode?.pair[0]) {
      parentNodes.push(node);
    }
  }

  return nodes[0];

  function isNodeEqual(node: Node2, node2: Node2): boolean {
    return node.pair[0] === node2.pair[0] && node.pair[1] === node2.pair[1];
  }
}

export function isSubset(a: Pair, b: Pair): boolean {
  return a[0] > b[0] && a[1] < b[1];
}
