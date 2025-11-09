import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new post
export const createPost = mutation({
  args: {
    authorId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    text: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newPost = await ctx.db.insert("posts", {
      authorId: args.authorId,
      authorName: args.authorName,
      authorAvatar: args.authorAvatar,
      text: args.text,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
    
    return newPost;
  },
});

// Get all posts sorted by newest first
export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .order("desc")
      .collect();
  },
});

// Get posts for a specific user
export const getUserPosts = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("authorId", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    id: v.id("posts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});