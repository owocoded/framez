import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
  }).index("clerkId", ["clerkId"]),
  posts: defineTable({
    authorId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    text: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("authorId", ["authorId"]),
  files: defineTable({
    postId: v.string(),
    storageId: v.string(),
    originalFilename: v.string(),
    uploadedAt: v.number(),
  }),
});