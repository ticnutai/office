import { db } from "./db";
import { dashboardItems, progressGroups } from "@shared/schema";

async function seed() {
  console.log("🌱 Adding sample data to database...");

  // Add sample dashboard items
  const sampleItems = [
    {
      site: "אתר חברת ABC",
      status: "active",
      date: "2024-01-15",
      contactName: "יוסי כהן",
      clientName: "חברת ABC בע\"ם"
    },
    {
      site: "פורטל לקוחות XYZ",
      status: "pending",
      date: "2024-01-20",
      contactName: "רחל לוי",
      clientName: "XYZ טכנולוגיות"
    },
    {
      site: "חנות אונליין DEF",
      status: "completed",
      date: "2024-01-10",
      contactName: "מישה דוד",
      clientName: "DEF מסחר דיגיטלי"
    },
    {
      site: "מערכת ניהול GHI",
      status: "pending",
      date: "2024-01-25",
      contactName: "שרה אברהם",
      clientName: "GHI ייעוץ עסקי"
    },
    {
      site: "אפליקציית JKL",
      status: "active",
      date: "2024-01-12",
      contactName: "דני רוזן",
      clientName: "JKL חדשנות דיגיטלית"
    }
  ];

  // Add sample progress groups
  const sampleGroups = [
    {
      name: "פיתוח תכונות חדשות",
      completed: 8,
      total: 12,
      percentage: 67
    },
    {
      name: "בדיקות איכות",
      completed: 15,
      total: 20,
      percentage: 75
    },
    {
      name: "תיעוד מערכת",
      completed: 5,
      total: 8,
      percentage: 63
    },
    {
      name: "אופטימיזציה",
      completed: 3,
      total: 6,
      percentage: 50
    }
  ];

  try {
    // Insert dashboard items
    await db.insert(dashboardItems).values(sampleItems);
    console.log("✅ Dashboard items added successfully");

    // Insert progress groups
    await db.insert(progressGroups).values(sampleGroups);
    console.log("✅ Progress groups added successfully");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seed().catch(console.error);