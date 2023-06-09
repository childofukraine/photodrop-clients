"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientAlbumsTable = exports.clientSessionsTable = exports.clientTable = exports.clientSelfiesTable = exports.photosTable = exports.albumsTable = exports.sessionsTable = exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
/* ################################################################################ */
// PHOTOGRAPHER API DB
/* ################################################################################ */
exports.usersTable = (0, pg_core_1.pgTable)("pd_users", {
    login: (0, pg_core_1.text)("login").notNull(),
    password: (0, pg_core_1.text)("password").notNull(),
    userId: (0, pg_core_1.text)("user_id").notNull().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    fullName: (0, pg_core_1.text)("full_name"),
    email: (0, pg_core_1.text)("email"), // optional email
});
exports.sessionsTable = (0, pg_core_1.pgTable)("pd_sessions", {
    sessionId: (0, pg_core_1.text)("session_id").notNull().primaryKey(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.usersTable.userId),
    refreshToken: (0, pg_core_1.text)("refresh_token").notNull(),
    expiresIn: (0, pg_core_1.timestamp)("expires_in").notNull(),
});
exports.albumsTable = (0, pg_core_1.pgTable)("pd_albums", {
    albumId: (0, pg_core_1.text)("album_id").notNull().primaryKey(),
    name: (0, pg_core_1.text)("name"),
    location: (0, pg_core_1.text)("location"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.usersTable.userId), // ref to users
});
exports.photosTable = (0, pg_core_1.pgTable)("pd_photos", {
    photoId: (0, pg_core_1.text)("photo_id").notNull().primaryKey(),
    unlockedPhotoUrl: (0, pg_core_1.text)("unlocked_photo_url").notNull(),
    unlockedThumbnailUrl: (0, pg_core_1.text)("unlocked_thumbnail_url").notNull(),
    lockedPhotoUrl: (0, pg_core_1.text)("locked_photo_url").notNull(),
    lockedThumbnailUrl: (0, pg_core_1.text)("locked_thumbnail_url").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    albumId: (0, pg_core_1.text)("album_id")
        .notNull()
        .references(() => exports.albumsTable.albumId),
    clients: (0, pg_core_1.text)("clients"),
});
/* ################################################################################ */
// CLIENT API DB
/* ################################################################################ */
exports.clientSelfiesTable = (0, pg_core_1.pgTable)("pdc_selfies", {
    selfieId: (0, pg_core_1.text)("selfie_id").notNull().primaryKey(),
    selfieUrl: (0, pg_core_1.text)("selfie_url").notNull(),
    selfieThumbnail: (0, pg_core_1.text)("selfie_thumbnail").notNull(),
    shiftX: (0, pg_core_1.real)("shift_x"),
    shiftY: (0, pg_core_1.real)("shift_y"),
    zoom: (0, pg_core_1.real)("zoom"),
    width: (0, pg_core_1.real)("width"),
    height: (0, pg_core_1.real)("height"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(), // date of creation
});
exports.clientTable = (0, pg_core_1.pgTable)("pdc_client", {
    clientId: (0, pg_core_1.text)("client_id").notNull().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    phone: (0, pg_core_1.text)("phone").notNull(),
    selfieId: (0, pg_core_1.text)("selfie_id").references(() => exports.clientSelfiesTable.selfieId),
    email: (0, pg_core_1.text)("email"),
    fullName: (0, pg_core_1.text)("full_name"), // optional name
});
exports.clientSessionsTable = (0, pg_core_1.pgTable)("pdc_sessions", {
    sessionId: (0, pg_core_1.text)("session_id").notNull().primaryKey(),
    clientId: (0, pg_core_1.text)("client_id")
        .notNull()
        .references(() => exports.clientTable.clientId),
    refreshToken: (0, pg_core_1.text)("refresh_token").notNull(),
    expiresIn: (0, pg_core_1.timestamp)("expires_in").notNull(), // date of expiration
});
exports.clientAlbumsTable = (0, pg_core_1.pgTable)("pdc_albums", {
    albumId: (0, pg_core_1.text)("album_id").notNull(),
    clientId: (0, pg_core_1.text)("client_id")
        .notNull()
        .references(() => exports.clientTable.clientId),
    isUnlocked: (0, pg_core_1.boolean)("is_unlocked").notNull().default(false), // album status
});
