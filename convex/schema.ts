import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    password: v.string(), // Store hashed password
  }),
  posts: defineTable({
    authorId: v.id("users"), // Reference to users table
    content: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.string(), // ISO string for date
    likes: v.optional(v.array(v.id("users"))), // Array of user IDs who liked the post
  }).index("by_author", ["authorId"]).index("by_created_at", ["createdAt"]),
});