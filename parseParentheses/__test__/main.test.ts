import { assertEquals } from "../../deps.ts";
import { getNodes, getIdMap, getTree, getPairs, getTree2 } from "../main.ts";

Deno.test({
  name: "test getNode",
  fn: () => {
    assertEquals(getNodes("()"), [
      {
        id: 0,
        parentId: null,
      },
    ]);

    assertEquals(getNodes("(())"), [
      {
        id: 0,
        parentId: null,
      },
      {
        id: 1,
        parentId: 0,
      },
    ]);

    assertEquals(getNodes("((())(()))"), [
      [
        {
          id: 0,
          parentId: null,
        },
        {
          id: 1,
          parentId: 0,
        },
        {
          id: 2,
          parentId: 1,
        },
        {
          id: 5,
          parentId: 0,
        },
        {
          id: 6,
          parentId: 5,
        },
      ],
    ]);
  },
});

Deno.test({
  name: "test Idmap",
  fn: () => {
    assertEquals(getIdMap(getNodes("()")), { 0: 0 });
    assertEquals(getIdMap(getNodes("(())")), { 0: 0, 1: 1 });
    assertEquals(getIdMap(getNodes("(()())")), { 0: 0, 1: 1, 3: 2 });
    assertEquals(getIdMap(getNodes("((())())")), { 0: 0, 1: 1, 2: 2, 5: 3 });
    assertEquals(getIdMap(getNodes("((())(()))")), {
      0: 0,
      1: 1,
      2: 2,
      5: 3,
      6: 4,
    });
  },
});

Deno.test({
  name: "test getTree",
  fn: () => {
    assertEquals(getTree("()"), {
      id: 0,
      parentId: null,
    });

    assertEquals(getTree("(())"), {
      id: 0,
      parentId: null,
      children: [
        {
          id: 1,
          parentId: 0,
        },
      ],
    });

    assertEquals(getTree("((()))"), {
      id: 0,
      parentId: null,
      children: [
        {
          id: 1,
          parentId: 0,
          children: [
            {
              id: 2,
              parentId: 1,
            },
          ],
        },
      ],
    });

    assertEquals(getTree("(()())"), {
      id: 0,
      parentId: null,
      children: [
        {
          id: 1,
          parentId: 0,
        },
        {
          id: 3,
          parentId: 0,
        },
      ],
    });

    assertEquals(getTree("(()(()))"), {
      id: 0,
      parentId: null,
      children: [
        {
          id: 1,
          parentId: 0,
        },
        {
          id: 3,
          parentId: 0,
          children: [
            {
              id: 4,
              parentId: 3,
            },
          ],
        },
      ],
    });

    const tree = getTree("((())(()))");

    console.log("tree", JSON.stringify(tree, null, 2));

    assertEquals(tree, {
      id: 0,
      parentId: null,
      children: [
        {
          id: 1,
          parentId: 0,
          children: [
            {
              id: 2,
              parentId: 1,
            },
          ],
        },
        {
          id: 5,
          parentId: 0,
          children: [
            {
              id: 6,
              parentId: 5,
            },
          ],
        },
      ],
    });
  },
});

Deno.test({
  name: "get tree2",
  // only: true,
  fn: () => {
    assertEquals(getPairs("()"), [[0, 1]]);
    assertEquals(getPairs("(())"), [
      [0, 3],
      [1, 2],
    ]);

    assertEquals(getPairs("(()(()))"), [
      [0, 7],
      [1, 2],
      [3, 6],
      [4, 5],
    ]);
  },
});

Deno.test({
  name: "test",
  fn: () => {
    let res;

    for (let i = 0; i !== 2; i++) {
      res = i;
    }

    assertEquals(res, 2);
  },
});

Deno.test({
  name: "test getTree2",
  only: true,
  fn: () => {
    // let src = "((())((()))())";
    let src = "(((()))()())";

    console.time("time!!!");
    let tree = getTree2(src);
    console.timeEnd("time!!!");

    console.log("~~~~~~~~~~~~~~~~~~");
    console.log("tree", JSON.stringify(tree, null, 4));
    console.log("~~~~~~~~~~~~~~~~~~");

    // assertEquals(tree, {
    //   pair: [0, 3],
    //   children: [
    //     {
    //       pair: [1, 2],
    //     },
    //   ],
    // });
  },
});
