import { boolean, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

/* ################################################################################ */
// PHOTOGRAPHER API DB
/* ################################################################################ */

export const usersTable = pgTable("pd_users", {
  login: text("login").notNull(), // user login - should be only "letters and _"
  password: text("password").notNull(), // user hashed password
  userId: text("user_id").notNull().primaryKey(), // user id
  createdAt: timestamp("created_at").defaultNow().notNull(), // date of creation
  fullName: text("full_name"), // optional full name
  email: text("email"), // optional email
});

export const sessionsTable = pgTable("pd_sessions", {
  sessionId: text("session_id").notNull().primaryKey(), // session id
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.userId),
  refreshToken: text("refresh_token").notNull(),
  expiresIn: timestamp("expires_in").notNull(),
});

export const albumsTable = pgTable("pd_albums", {
  albumId: text("album_id").notNull().primaryKey(), // album id
  name: text("name"), // album name
  location: text("location"), // album location
  createdAt: timestamp("created_at").defaultNow().notNull(), // date of creation
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.userId), // ref to users
});

export const photosTable = pgTable("pd_photos", {
  photoId: text("photo_id").notNull().primaryKey(), // photo id
  unlockedPhotoUrl: text("unlocked_photo_url").notNull(), // url to unlocked photo
  unlockedThumbnailUrl: text("unlocked_thumbnail_url").notNull(), // url to unlocked thumbnail
  lockedPhotoUrl: text("locked_photo_url").notNull(), // url to locked photo with watermark
  lockedThumbnailUrl: text("locked_thumbnail_url").notNull(), // url to locked thumbnail with watermark
  createdAt: timestamp("created_at").defaultNow().notNull(), // date of creation
  albumId: text("album_id")
    .notNull()
    .references(() => albumsTable.albumId), // ref to album
  clients: text("clients"),
});

/* ################################################################################ */
// CLIENT API DB
/* ################################################################################ */

export const clientSelfiesTable = pgTable("pdc_selfies", {
  selfieId: text("selfie_id").notNull().primaryKey(), // selfie id
  selfieUrl: text("selfie_url").notNull(), // selfie url
  selfieThumbnail: text("selfie_thumbnail").notNull(), // selfie thumbnail
  shiftX: real("shift_x"), // selfie shift x
  shiftY: real("shift_y"), // selfie shift y
  zoom: real("zoom"), // selfie zoom
  width: real("width"), // selfie width
  height: real("height"), // selfie height
  createdAt: timestamp("created_at").notNull().defaultNow(), // date of creation
});

export const clientTable = pgTable("pdc_client", {
  clientId: text("client_id").notNull().primaryKey(), // client id
  createdAt: timestamp("created_at").notNull().defaultNow(), // date of creation
  phone: text("phone").notNull(), // client phone
  selfieId: text("selfie_id").references(() => clientSelfiesTable.selfieId), // ref for selfie
  email: text("email"), // optional email
  fullName: text("full_name"), // optional name
});

export const clientSessionsTable = pgTable("pdc_sessions", {
  sessionId: text("session_id").notNull().primaryKey(), // session id
  clientId: text("client_id")
    .notNull()
    .references(() => clientTable.clientId), // ref to client id
  refreshToken: text("refresh_token").notNull(), // token
  expiresIn: timestamp("expires_in").notNull(), // date of expiration
});

export const clientAlbumsTable = pgTable("pdc_albums", {
  albumId: text("album_id").notNull(),
  clientId: text("client_id")
    .notNull()
    .references(() => clientTable.clientId), // ref to client id
  isUnlocked: boolean("is_unlocked").notNull().default(false), // album status
});

// PHOTODROP-PHOTOGRAPHER TYPES
export type PDPUser = InferModel<typeof usersTable>;
export type PDPSession = InferModel<typeof sessionsTable>;
export type PDPAlbum = InferModel<typeof albumsTable>;
export type PDPPhoto = InferModel<typeof photosTable>;
// PHOTODROP-CLIENT TYPES
export type PDCSelfie = InferModel<typeof clientSelfiesTable>;
export type PDCClient = InferModel<typeof clientTable>;
export type PDCSession = InferModel<typeof clientSessionsTable>;
export type PDCAlbum = InferModel<typeof clientAlbumsTable>;
