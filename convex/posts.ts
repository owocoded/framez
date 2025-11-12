import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new post
export const createPost = mutation({
  args: {
    content: v.string(),
    imageUrl: v.optional(v.string()),
    authorId: v.id("users"), // Pass authorId from client (should be validated)
  },
  handler: async (ctx, args) => {
    // In a real app, we'd validate that the authorId belongs to the authenticated user
    // For now, we'll trust the client to pass the correct authorId

    const newPost = await ctx.db.insert("posts", {
      authorId: args.authorId,
      content: args.content,
      imageUrl: args.imageUrl,
      createdAt: new Date().toISOString(),
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
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_author", q => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    id: v.id("posts"),
    authorId: v.id("users"), // Pass authorId to validate
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Post not found");
    }
    
    // Check if the post belongs to the current user
    if (post.authorId !== args.authorId) {
      throw new Error("Not authorized to delete this post");
    }
    
    return await ctx.db.delete(args.id);
  },
});

// Toggle like on a post
export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const likes = post.likes || [];
    const userLiked = likes.includes(args.userId);
    
    if (userLiked) {
      // Remove user from likes array
      const updatedLikes = likes.filter(id => id !== args.userId);
      return await ctx.db.patch(args.postId, {
        likes: updatedLikes
      });
    } else {
      // Add user to likes array
      const updatedLikes = [...likes, args.userId];
      return await ctx.db.patch(args.postId, {
        likes: updatedLikes
      });
    }
  },
});