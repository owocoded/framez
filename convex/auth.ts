import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Create a simple email/password authentication system
// In a real app, you'd want to hash passwords and implement proper security

// User registration
export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists");
    }

    // In a real app, you'd hash the password here
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: args.password, // Should be hashed in a real app
      name: args.name,
      avatar: undefined, // Add avatar field to match schema
    });

    // Return a simple user object (without password)
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Failed to create user");
    }
    
    return { 
      id: user._id, 
      email: user.email, 
      name: user.name 
    };
  },
});

// User login
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (!user || user.password !== args.password) { // In real app: verify hashed password
      throw new Error("Invalid email or password");
    }

    // Return user data (without password)
    return { 
      id: user._id, 
      email: user.email, 
      name: user.name 
    };
  },
});

// Get current user based on token verification
// This is a simplified approach - in a real app you'd validate the token from headers
export const getCurrentUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // In a real app, you would verify a token and return the associated user
    // For now, we'll return the user if the ID matches one in the DB
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }
    
    // Return user data without the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});