import { getAuthUserId } from "@convex-dev/auth/server";
import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const resetStats = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Користувач не авторизований");
    const userStats = await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (userStats) {
      await ctx.db.patch(userStats._id, {
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0,
        updatedAt: Date.now(),
      });
    }

    return {
      success: true,
    };
  },
});
