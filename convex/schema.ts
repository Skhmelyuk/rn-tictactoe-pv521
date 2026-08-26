import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    stats: defineTable({
        totalGames: v.number(),
        winsX: v.number(),
        winsO: v.number(),
        draws: v.number(),
        updatedAt: v.number(),
    }),
    games: defineTable({
        winner: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
        board: v.array(v.union(v.string(), v.null())),
        winningCombination: v.optional(v.array(v.number())),
        createdAt: v.number(),
    }).index("by_creation", ["createdAt"]),
});
