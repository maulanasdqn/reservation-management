import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  text,
  uuid,
  bigint,
  boolean,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "@auth/core/adapters";
import { STATUS, CHECK_IN_STATUS } from "@/constants/status";

export enum ROLES {
  ADMIN = "Admin",
  MEMBER = "Member",
  OWNER = "Owner",
}

export enum PERMISSIONS {
  DASHBOARD = "Dashboard",
  GUEST_READ = "Read Guest",
  USER_READ = "Read User",
  IS_ADMIN = "Is Admin",
}

export const roles = pgTable("app_roles", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  permissions: text("permissions").notNull().array(),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const users = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }),
  fullname: text("name"),
  image: text("image"),
  email: text("email").notNull().unique(),
  emailVerifiedAt: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const guests = pgTable("app_guests", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const work_units = pgTable("app_work_units", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const reservations = pgTable("app_reservations", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  guestId: uuid("guest_id").references(() => guests.id, { onDelete: "cascade" }),
  workUnitId: uuid("work_unit_id")
    .notNull()
    .references(() => work_units.id, { onDelete: "cascade" }),
  status: text("status").default(STATUS.WAITING),
  checkInStatus: text("check_in_status").default(CHECK_IN_STATUS.NO),
  guestStatus: text("guest_status").notNull(),
  guestTotal: text("guest_total").notNull(),
  code: text("code"),
  purpose: text("purpose").notNull(),
  companyName: text("company_name"),
  hour: text("hour").notNull(),
  date: date("date", { mode: "date" }).notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  objective: text("objective").notNull(),
  checkIn: date("check_in", { mode: "date" }),
  checkOut: date("check_out", { mode: "date" }),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
