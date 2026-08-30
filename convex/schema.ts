import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  stats: defineTable({
    totalGames: v.number(),
    winsX: v.number(),
    winsO: v.number(),
    draws: v.number(),
    updatedAt: v.number(),
    userId: v.id(`users`),
  }).index("by_user", ["userId"]),
  games: defineTable({
    winner: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
    board: v.array(v.union(v.string(), v.null())),
    winningCombination: v.optional(v.array(v.number())),
    createdAt: v.number(),
    userId: v.id(`users`),
  })
    .index("by_user", ["userId"])
    .index("by_creation", ["createdAt"]),
});
