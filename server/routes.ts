import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateNarrative } from "./lib/openai";
import { submitIdeaSchema, topicSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Submit idea
  app.post("/api/ideas", async (req, res) => {
    try {
      const validatedData = submitIdeaSchema.parse(req.body);
      
      // Determine final topic name
      const topicName = validatedData.topic === "other" && validatedData.customTopic 
        ? validatedData.customTopic 
        : validatedData.topic;
      
      // Set default name to "Anonymous" if not provided
      const name = validatedData.name && validatedData.name.trim() !== "" 
        ? validatedData.name 
        : "Anonymous";
      
      const idea = await storage.createIdea({
        topic: validatedData.topic,
        customTopic: validatedData.customTopic,
        name,
        content: validatedData.content
      });
      
      res.status(201).json(idea);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to create idea" });
      }
    }
  });
  
  // Get ideas for a specific topic
  app.get("/api/ideas", async (req, res) => {
    try {
      const { topic } = req.query;
      
      if (topic) {
        const ideas = await storage.getIdeasByTopic(topic as string);
        res.json(ideas);
      } else {
        const ideas = await storage.getIdeas();
        res.json(ideas);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ideas" });
    }
  });
  
  // Generate narrative based on ideas for a topic
  app.post("/api/narratives/generate", async (req, res) => {
    try {
      const { topic } = topicSchema.parse(req.body);
      
      // Determine final topic display name
      let topicDisplayName = topic;
      if (topic === "other" && req.body.customTopic) {
        topicDisplayName = req.body.customTopic;
      } else {
        // Map topic values to their display names
        const topicMap: Record<string, string> = {
          "school_lunch": "School Lunch Improvements",
          "classroom_environment": "Classroom Environment",
          "extracurricular_activities": "Extracurricular Activities",
          "technology_in_classroom": "Technology in the Classroom",
          "homework_policy": "Homework Policy"
        };
        topicDisplayName = topicMap[topic] || topic;
      }
      
      // Get ideas for this topic
      const ideas = await storage.getIdeasByTopic(topic);
      
      if (ideas.length === 0) {
        // If no ideas yet, return a default response
        return res.status(400).json({ 
          message: "No ideas found for this topic" 
        });
      }
      
      // Format ideas for AI generation
      const formattedIdeas = ideas.map(idea => ({
        name: idea.name,
        content: idea.content
      }));
      
      // Generate the narrative
      const result = await generateNarrative(topicDisplayName, formattedIdeas);
      
      // Save the generated narrative
      const narrative = await storage.createNarrative({
        topic,
        content: result.narrative
      });
      
      res.json({ 
        narrative: result.narrative,
        topicDisplayName
      });
    } catch (error) {
      console.error("Error generating narrative:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to generate narrative" 
        });
      }
    }
  });
  
  // Get a narrative for a specific topic
  app.get("/api/narratives/:topic", async (req, res) => {
    try {
      const { topic } = req.params;
      const narrative = await storage.getNarrativeByTopic(topic);
      
      if (!narrative) {
        return res.status(404).json({ message: "Narrative not found" });
      }
      
      res.json(narrative);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch narrative" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
