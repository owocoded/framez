import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for image upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});