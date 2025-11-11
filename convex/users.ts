import { query } from "./_generated/server";
import { v } from "convex/values";

// Get user by ID
export const getUserById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});