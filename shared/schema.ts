import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const dashboardItems = pgTable("dashboard_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  site: text("site").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
  contactName: text("contact_name").notNull(),
  clientName: text("client_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const progressGroups = pgTable("progress_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  completed: integer("completed").notNull().default(0),
  total: integer("total").notNull().default(0),
  percentage: integer("percentage").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDashboardItemSchema = createInsertSchema(dashboardItems).omit({
  id: true,
  createdAt: true,
});

export const insertProgressGroupSchema = createInsertSchema(progressGroups).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DashboardItem = typeof dashboardItems.$inferSelect;
export type InsertDashboardItem = z.infer<typeof insertDashboardItemSchema>;
export type ProgressGroup = typeof progressGroups.$inferSelect;
export type InsertProgressGroup = z.infer<typeof insertProgressGroupSchema>;
