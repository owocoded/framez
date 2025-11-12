# Framez - Social Media App

Framez is a mobile social app where users can register, log in, and log out securely. Users can create posts with text and optional image uploads, view a feed of all posts (sorted by newest first), and view their own profile with their posts.

## 🚀 Tech Stack

- **Frontend**: React Native (Expo) with TypeScript
- **Backend**: Convex (for auth, database, storage)
- **Authentication**: Clerk (integrated with Convex Auth)
- **Database**: Convex real-time database
- **State management**: Context API (simple)
- **Navigation**: React Navigation (bottom tabs + auth stack)
- **Storage**: Convex file storage (for image uploads)
- **Deployment target**: Android (Expo EAS build)
- **Hosting for demo**: Appetize.io

## ✨ Features

1. **Authentication**
   - Secure login, signup, and logout using Clerk integrated with Convex
   - Session persists across app restarts
   - Display user info (name, email, and profile image)

2. **Posts**
   - User can create new posts containing text and optional image
   - Posts stored in Convex database with fields: { authorId, authorName, authorAvatar, text, imageUrl, createdAt }
   - Upload images to Convex storage
   - Real-time feed displaying all posts in descending order by createdAt
   - Each post shows: author name, text, image, and timestamp

3. **Feed**
   - Main screen displays all posts (real-time updates using Convex queries)
   - Pull-to-refresh or auto-refresh when new post added

4. **Profile**
   - Displays current user's info (name, email, avatar)
   - Lists only the user's posts from Convex
   - Option to log out

## 📦 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Convex account
- Clerk account

### Installation

1. Clone the repository

```bash
git clone https://github.com/owocoded/framez.git
cd framez
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

```env
EXPO_PUBLIC_CONVEX_URL=your_convex_url
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

4. Configure Convex:

```bash
npm install -g convex
convex init
convex deploy
```

5. Configure Clerk:

- Create an account at https://clerk.dev
- Create a new application
- Get your publishable key and webhook secret

6. Run the app:

```bash
npx expo start
```

### For Android

```bash
npx expo start --android
```

### For iOS

```bash
npx expo start --ios
```

## 🏗️ Project Structure

```
/framez
/src
/components
  PostCard.tsx
  Avatar.tsx
/screens
  AuthScreen.tsx
  FeedScreen.tsx
  CreatePostScreen.tsx
  ProfileScreen.tsx
/context
  AuthContext.tsx
/navigation
  AppNavigator.tsx
  AuthNavigator.tsx
/services
  convexClient.ts
/convex
  schema.ts
  posts.ts
  users.ts
  upload.ts
  auth.ts
App.tsx
README.md
```

## 📁 Convex Backend Implementation

### Database Schema

- Tables: users, posts, files

### Functions

- `/convex/posts.ts`
  - createPost(authorId, text, imageUrl)
  - getAllPosts() — returns all posts sorted by newest
  - getUserPosts(authorId) — returns posts for a single user

- `/convex/auth.ts`
  - Handles storing user data (name, email, avatar) on login

- `/convex/upload.ts`
  - generateUploadUrl() — generates Convex upload URL for image

## 📱 UI/UX Guidelines

- Clean, minimal, Instagram-inspired layout
- Use soft shadows, rounded avatars, and responsive design
- Feed cards show user avatar + name + time, post image, and post text
- Implemented with StyleSheet styles for consistency

## 🔄 Backend Choice: Convex

Convex was chosen as the backend for Me2U because:

- It provides a real-time database with automatic synchronization
- Offers a simple, intuitive API without complex server setup
- Supports file storage for image uploads
- Integrates seamlessly with React and React Native
- Provides excellent performance and scalability
- Offers built-in authentication integration with Clerk

## 📋 Future Enhancements

- Push notifications
- Direct messaging
- Commenting on posts
- Liking posts
- Following other users
- Explore feed with popular posts
- Post sharing
- Dark mode support

  # Project state flow

         ┌───────────────────┐
        │   AuthContext     │
        │------------------│
        │ isAuthenticated  │
        │ user              │
        │ signIn(), signOut()│
        └─────────┬─────────┘
                  │
                  ▼

  ┌────────────────────────────┐
  │ Screens / Components │
  │----------------------------│
  │ SignInScreen │
  │ SignUpScreen │
  │ ProfileScreen │
  │ FeedScreen │
  │ CreatePostScreen │
  └─────────┬─────────┬────────┘
  │ │
  ▼ ▼
  ┌───────────────┐ ┌───────────────┐
  │ Local State │ │ Global State │
  │ (useState) │ │ (Context / │
  │ email, pwd, │ │ Zustand / │
  │ loading, etc) │ │ Redux) │
  └───────────────┘ └───────────────┘
  │ │
  ▼ ▼
  ┌───────────────────────────────────┐
  │ Convex Backend │
  │-----------------------------------│
  │ users table (authentication) │
  │ posts table (feed & user posts) │
  │ Functions / Queries │
  │ - signup() │
  │ - signin() │
  │ - createPost() │
  │ - getUserPosts() │
  │ - getFeedPosts() │
  └───────────────────────────────────┘

## 📝 License

This project is licensed under the MIT License.
