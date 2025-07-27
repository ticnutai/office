import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDashboardItemSchema, insertProgressGroupSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard items routes
  app.get("/api/dashboard-items", async (req, res) => {
    try {
      const items = await storage.getDashboardItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard items" });
    }
  });

  app.post("/api/dashboard-items", async (req, res) => {
    try {
      const validatedData = insertDashboardItemSchema.parse(req.body);
      const item = await storage.createDashboardItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid data provided" });
    }
  });

  app.put("/api/dashboard-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertDashboardItemSchema.partial().parse(req.body);
      const item = await storage.updateDashboardItem(id, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid data provided" });
    }
  });

  app.delete("/api/dashboard-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDashboardItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Progress groups routes
  app.get("/api/progress-groups", async (req, res) => {
    try {
      const groups = await storage.getProgressGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress groups" });
    }
  });

  app.post("/api/progress-groups", async (req, res) => {
    try {
      const validatedData = insertProgressGroupSchema.parse(req.body);
      const group = await storage.createProgressGroup(validatedData);
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ message: "Invalid data provided" });
    }
  });

  app.put("/api/progress-groups/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProgressGroupSchema.partial().parse(req.body);
      const group = await storage.updateProgressGroup(id, validatedData);
      
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      res.json(group);
    } catch (error) {
      res.status(400).json({ message: "Invalid data provided" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
