import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const recordGame = mutation({
  args: {
    winner: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
    board: v.array(v.union(v.string(), v.null())),
    winningCombination: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Користувач не авторизований");
    // 1.1. Додаємо партію в таблицю games
    const gameId = await ctx.db.insert("games", {
      winner: args.winner,
      board: args.board,
      winningCombination: args.winningCombination,
      createdAt: Date.now(),
      userId,
    });

    // 1.2. Оновлюємо таблицю stats в тій же транзакції
    const currentStats = await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!currentStats) {
      await ctx.db.insert("stats", {
        totalGames: 1,
        winsX: args.winner === "X" ? 1 : 0,
        winsO: args.winner === "O" ? 1 : 0,
        draws: args.winner === "DRAW" ? 1 : 0,
        updatedAt: Date.now(),
        userId,
      });
    } else {
      await ctx.db.patch(currentStats._id, {
        totalGames: currentStats.totalGames + 1,
        winsX:
          args.winner === "X" ? currentStats.winsX + 1 : currentStats.winsX,
        winsO:
          args.winner === "O" ? currentStats.winsO + 1 : currentStats.winsO,
        draws:
          args.winner === "DRAW" ? currentStats.draws + 1 : currentStats.draws,
        updatedAt: Date.now(),
      });
    }

    return gameId;
  },
});

export const getRecentGames = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    return await ctx.db
      .query("games")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

// 3. Видалення окремого запису гри (Mutation)
export const deleteGame = mutation({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Користувач не авторизований");
    const game = await ctx.db.get(args.id);
    if (!game) throw new ConvexError("Гру не знайдено");
    if (game.userId != userId)
      throw new ConvexError("Нема прав на видалення цього запису");

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 4. Повне очищення історії ігор (Mutation)
export const clearAllGames = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Користувач не авторизований");

    const allGames = await ctx.db
      .query("games")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const game of allGames) {
      await ctx.db.delete(game._id);
    }
    return { deletedCount: allGames.length };
  },
});
