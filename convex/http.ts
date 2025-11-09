import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";

// Webhook handler for Clerk events
const clerkWebhook = httpAction(async (ctx, request) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  const payload = await request.text();
  const headers = Object.fromEntries(request.headers.entries());
  const svix = new Webhook(webhookSecret);

  let evt: any;
  try {
    evt = svix.verify(payload, headers);
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Unauthorized", { status: 401 });
  }

  const { id, ...user } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    await ctx.runMutation("users", "upsertUser", {
      clerkId: id,
      name: user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.username || user.email_addresses[0].email_address,
      email: user.email_addresses[0].email_address,
      avatar: user.image_url,
    });
  } else if (eventType === "user.deleted") {
    // Optionally delete user from your database
    // This depends on your app's requirements
  }

  return new Response(null, { status: 200 });
});

const http = httpRouter();
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
});

export default http;