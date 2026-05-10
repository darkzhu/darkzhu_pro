import { beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown>;

const state = {
  postLikes: new Map<string, number>(),
  postComments: [] as Row[],
  guestbook: [] as Row[],
  holes: [] as Row[]
};

vi.mock("@/lib/auth", () => ({
  getSessionUser: vi.fn(async () => ({ username: "admin", nickname: "Admin", provider: "account" }))
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: vi.fn(async (sql: string, params: unknown[] = []) => {
      if (sql.includes("FROM post_likes")) {
        const slug = String(params[0]);
        const likes = state.postLikes.get(slug);
        return [likes === undefined ? [] : [{ likes }]];
      }

      if (sql.includes("FROM post_comments")) {
        const slug = String(params[0]);
        return [state.postComments.filter((row) => row.post_slug === slug)];
      }

      if (sql.includes("FROM guestbook_messages")) {
        if (sql.includes("WHERE id = ?")) {
          return [state.guestbook.filter((row) => row.id === params[0])];
        }

        return [[...state.guestbook].reverse()];
      }

      if (sql.includes("FROM hole_messages") && sql.includes("COUNT")) {
        return [[{ count: state.holes.length }]];
      }

      if (sql.includes("FROM hole_messages")) {
        return [state.holes];
      }

      return [[]];
    }),
    execute: vi.fn(async (sql: string, params: unknown[] = []) => {
      if (sql.includes("INSERT INTO post_likes")) {
        const slug = String(params[0]);
        state.postLikes.set(slug, (state.postLikes.get(slug) ?? 0) + 1);
        return [{ affectedRows: 1 }];
      }

      if (sql.includes("INSERT INTO post_comments")) {
        state.postComments.push({
          id: params[0],
          post_slug: params[1],
          name: params[2],
          text: params[3],
          likes: params[4],
          created_at: params[5]
        });
        return [{ affectedRows: 1 }];
      }

      if (sql.includes("INSERT INTO guestbook_messages")) {
        state.guestbook.push({
          id: params[0],
          name: params[1],
          text: params[2],
          likes: params[3],
          created_at: params[4]
        });
        return [{ affectedRows: 1 }];
      }

      if (sql.includes("UPDATE guestbook_messages")) {
        const target = state.guestbook.find((row) => row.id === params[0]);

        if (!target) {
          return [{ affectedRows: 0 }];
        }

        target.likes = Number(target.likes) + 1;
        return [{ affectedRows: 1 }];
      }

      if (sql.includes("INSERT INTO hole_messages")) {
        state.holes.push({
          id: params[0],
          text: params[1],
          top: params[2],
          duration: params[3],
          created_at: params[4]
        });
        return [{ affectedRows: 1 }];
      }

      if (sql.includes("DELETE FROM hole_messages")) {
        state.holes = state.holes.slice(-80);
        return [{ affectedRows: 0 }];
      }

      return [{ affectedRows: 0 }];
    })
  }
}));

describe("interactions", () => {
  beforeEach(() => {
    state.postLikes.clear();
    state.postComments = [];
    state.guestbook = [];
    state.holes = [];
  });

  it("increments and reads post likes", async () => {
    const { getPostInteractions, likePost } = await import("@/lib/interactions");

    await expect(likePost("welcome")).resolves.toBe(1);
    await expect(likePost("welcome")).resolves.toBe(2);
    await expect(getPostInteractions("welcome")).resolves.toMatchObject({ likes: 2, comments: [] });
  });

  it("stores post comments with the session nickname", async () => {
    const { addPostComment, getPostInteractions } = await import("@/lib/interactions");

    const comment = await addPostComment("welcome", " hello ");
    const interactions = await getPostInteractions("welcome");

    expect(comment).toMatchObject({ name: "Admin", text: "hello", likes: 0 });
    expect(interactions.comments).toHaveLength(1);
  });

  it("stores and likes guestbook messages", async () => {
    const { addGuestbookMessage, likeGuestbookMessage } = await import("@/lib/interactions");

    const message = await addGuestbookMessage("", "first");
    const liked = await likeGuestbookMessage(message.id);

    expect(message.name).toBe("访客");
    expect(liked?.likes).toBe(1);
  });

  it("keeps hole messages capped at 80", async () => {
    const { addHoleMessage, getHoleMessages } = await import("@/lib/interactions");

    for (let index = 0; index < 82; index += 1) {
      await addHoleMessage(`message ${index}`);
    }

    await expect(getHoleMessages()).resolves.toHaveLength(80);
  });
});
