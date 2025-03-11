import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  customTopic: text("custom_topic"),
  name: text("name").default("Anonymous"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const narratives = pgTable("narratives", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  name: text("name"),  // Optional name field
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ideaTopics = [
  { value: "school_lunch", label: "School Lunch Improvements" },
  { value: "classroom_environment", label: "Classroom Environment" },
  { value: "extracurricular_activities", label: "Extracurricular Activities" },
  { value: "technology_in_classroom", label: "Technology in the Classroom" },
  { value: "homework_policy", label: "Homework Policy" },
  { value: "other", label: "Other (specify)" }
];

export const insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
  createdAt: true,
});

export const topicSchema = z.object({
  topic: z.string().min(1, { message: "Please select a topic" }),
  customTopic: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      try {
        // Get the data safely
        const data = ctx.path && ctx.path.length > 0 ? ctx.data as any : null;
        if (data && data.topic === "other" && (!val || val.trim() === "")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify your topic"
          });
        }
      } catch (error) {
        // If there's an error, don't validate
      }
    })
});

export const submitIdeaSchema = z.object({
  topic: z.string().min(1, { message: "Please select a topic" }),
  customTopic: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      try {
        // Get the data safely
        const data = ctx.path && ctx.path.length > 0 ? ctx.data as any : null;
        if (data && data.topic === "other" && (!val || val.trim() === "")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify your topic"
          });
        }
      } catch (error) {
        // If there's an error, don't validate
      }
    }),
  name: z.string().optional(),
  content: z.string().min(1, { message: "Please share your idea or insight" })
});

export const insertNarrativeSchema = createInsertSchema(narratives).omit({
  id: true, 
  createdAt: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type SubmitIdea = z.infer<typeof submitIdeaSchema>;
export type Narrative = typeof narratives.$inferSelect;
export type InsertNarrative = z.infer<typeof insertNarrativeSchema>;
