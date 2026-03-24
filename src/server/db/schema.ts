import { pgTable, text, timestamp, integer, boolean, uuid, pgEnum, unique } from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const repeatModeEnum = pgEnum("repeat_mode", ["none", "one", "all"]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image:         text("image"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  updatedAt:     timestamp("updated_at").notNull().defaultNow(),
});

// ─── Better Auth Required Tables ──────────────────────────────────────────────

export const sessions = pgTable("sessions", {
  id:        text("id").primaryKey(),
  userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token:     text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id:                   text("id").primaryKey(),
  userId:               text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId:            text("account_id").notNull(),
  providerId:           text("provider_id").notNull(),
  accessToken:          text("access_token"),
  refreshToken:         text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  password:             text("password"),
  createdAt:            timestamp("created_at").notNull().defaultNow(),
  updatedAt:            timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").notNull().defaultNow(),
});

// ─── Songs ────────────────────────────────────────────────────────────────────

export const songs = pgTable("songs", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title:     text("title").notNull(),
  artist:    text("artist").notNull(),
  album:     text("album"),
  genre:     text("genre"),
  duration:  integer("duration"),         // seconds
  audioUrl:  text("audio_url").notNull(), // uploadthing url
  coverUrl:  text("cover_url"),           // uploadthing url
  audioKey:  text("audio_key").notNull(), // uploadthing key (for deletion)
  coverKey:  text("cover_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Playlists ────────────────────────────────────────────────────────────────

export const playlists = pgTable("playlists", {
  id:          uuid("id").primaryKey().defaultRandom(),
  userId:      text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name:        text("name").notNull(),
  description: text("description"),
  coverUrl:    text("cover_url"),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
  updatedAt:   timestamp("updated_at").notNull().defaultNow(),
});

// ─── Playlist Songs (join table) ──────────────────────────────────────────────

export const playlistSongs = pgTable("playlist_songs", {
  id:         uuid("id").primaryKey().defaultRandom(),
  playlistId: uuid("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
  songId:     uuid("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
  order:      integer("order").notNull().default(0),
  addedAt:    timestamp("added_at").notNull().defaultNow(),
});

// ─── Likes ────────────────────────────────────────────────────────────────────

export const likes = pgTable("likes", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  songId:    uuid("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.songId),
}));

// ─── Types ────────────────────────────────────────────────────────────────────

export type User         = typeof users.$inferSelect;
export type Song         = typeof songs.$inferSelect;
export type Playlist     = typeof playlists.$inferSelect;
export type PlaylistSong = typeof playlistSongs.$inferSelect;
export type Like         = typeof likes.$inferSelect;

export type NewSong      = typeof songs.$inferInsert;
export type NewPlaylist  = typeof playlists.$inferInsert;