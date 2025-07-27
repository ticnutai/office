import { type User, type InsertUser, type DashboardItem, type InsertDashboardItem, type ProgressGroup, type InsertProgressGroup } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getDashboardItems(): Promise<DashboardItem[]>;
  createDashboardItem(item: InsertDashboardItem): Promise<DashboardItem>;
  updateDashboardItem(id: string, item: Partial<InsertDashboardItem>): Promise<DashboardItem | undefined>;
  deleteDashboardItem(id: string): Promise<boolean>;
  getProgressGroups(): Promise<ProgressGroup[]>;
  createProgressGroup(group: InsertProgressGroup): Promise<ProgressGroup>;
  updateProgressGroup(id: string, group: Partial<InsertProgressGroup>): Promise<ProgressGroup | undefined>;
}

import { users, dashboardItems, progressGroups } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getDashboardItems(): Promise<DashboardItem[]> {
    return await db.select().from(dashboardItems);
  }

  async createDashboardItem(data: InsertDashboardItem): Promise<DashboardItem> {
    const [item] = await db
      .insert(dashboardItems)
      .values(data)
      .returning();
    return item;
  }

  async updateDashboardItem(id: string, data: Partial<InsertDashboardItem>): Promise<DashboardItem | undefined> {
    const [item] = await db
      .update(dashboardItems)
      .set(data)
      .where(eq(dashboardItems.id, id))
      .returning();
    return item || undefined;
  }

  async deleteDashboardItem(id: string): Promise<boolean> {
    const result = await db
      .delete(dashboardItems)
      .where(eq(dashboardItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getProgressGroups(): Promise<ProgressGroup[]> {
    return await db.select().from(progressGroups);
  }

  async createProgressGroup(data: InsertProgressGroup): Promise<ProgressGroup> {
    const [group] = await db
      .insert(progressGroups)
      .values(data)
      .returning();
    return group;
  }

  async updateProgressGroup(id: string, data: Partial<InsertProgressGroup>): Promise<ProgressGroup | undefined> {
    const [group] = await db
      .update(progressGroups)
      .set(data)
      .where(eq(progressGroups.id, id))
      .returning();
    return group || undefined;
  }
}

// Keep MemStorage for backup/development
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private dashboardItems: Map<string, DashboardItem>;
  private progressGroups: Map<string, ProgressGroup>;

  constructor() {
    this.users = new Map();
    this.dashboardItems = new Map();
    this.progressGroups = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample Hebrew dashboard data
    const sampleItems: DashboardItem[] = [
      {
        id: randomUUID(),
        site: "אתר לכיוס אנט חד",
        status: "בטיפול",
        date: "25.12.2024",
        contactName: "פתוחה אמר אינטנט",
        clientName: "חברת מלודיה א",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        site: "לכיוס רקים אמ חד",
        status: "בטיפול",
        date: "25.12.2024",
        contactName: "פתוח אמ י גילי",
        clientName: "קבוצת ואמפיון ב גלי",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        site: "מקרקע רגיל",
        status: "הושלם",
        date: "24.12.2024",
        contactName: "חברת חילקי ק תל",
        clientName: "רמת גילי",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        site: "תקופתיים ארק",
        status: "נדרש טיפול",
        date: "23.12.2024",
        contactName: "רמק ישג בע\"מ",
        clientName: "רמק ישב רליך",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        site: "עליכת רגיל",
        status: "בביקורת",
        date: "22.12.2024",
        contactName: "רמק עלכות",
        clientName: "רמק עלכות",
        createdAt: new Date(),
      },
    ];

    sampleItems.forEach(item => {
      this.dashboardItems.set(item.id, item);
    });

    // Initialize progress groups
    const progressGroups: ProgressGroup[] = [
      {
        id: randomUUID(),
        name: "קבוצת פנייה א",
        completed: 0,
        total: 10,
        percentage: 0,
      },
      {
        id: randomUUID(),
        name: "קבוצת פנייה ב",
        completed: 5,
        total: 5,
        percentage: 100,
      },
    ];

    progressGroups.forEach(group => {
      this.progressGroups.set(group.id, group);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDashboardItems(): Promise<DashboardItem[]> {
    return Array.from(this.dashboardItems.values());
  }

  async createDashboardItem(insertItem: InsertDashboardItem): Promise<DashboardItem> {
    const id = randomUUID();
    const item: DashboardItem = { 
      ...insertItem, 
      id, 
      createdAt: new Date() 
    };
    this.dashboardItems.set(id, item);
    return item;
  }

  async updateDashboardItem(id: string, updateItem: Partial<InsertDashboardItem>): Promise<DashboardItem | undefined> {
    const existing = this.dashboardItems.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateItem };
    this.dashboardItems.set(id, updated);
    return updated;
  }

  async deleteDashboardItem(id: string): Promise<boolean> {
    return this.dashboardItems.delete(id);
  }

  async getProgressGroups(): Promise<ProgressGroup[]> {
    return Array.from(this.progressGroups.values());
  }

  async createProgressGroup(insertGroup: InsertProgressGroup): Promise<ProgressGroup> {
    const id = randomUUID();
    const group: ProgressGroup = { 
      id,
      name: insertGroup.name,
      completed: insertGroup.completed || 0,
      total: insertGroup.total || 0,
      percentage: insertGroup.percentage || 0
    };
    this.progressGroups.set(id, group);
    return group;
  }

  async updateProgressGroup(id: string, updateGroup: Partial<InsertProgressGroup>): Promise<ProgressGroup | undefined> {
    const existing = this.progressGroups.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateGroup };
    this.progressGroups.set(id, updated);
    return updated;
  }
}

export const storage = new DatabaseStorage();
