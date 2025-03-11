import { 
  users, 
  type User, 
  type InsertUser, 
  ideas, 
  type Idea, 
  type InsertIdea,
  narratives,
  type Narrative,
  type InsertNarrative
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ideas operations
  createIdea(idea: InsertIdea): Promise<Idea>;
  getIdeas(): Promise<Idea[]>;
  getIdeasByTopic(topic: string): Promise<Idea[]>;
  
  // Narratives operations
  createNarrative(narrative: InsertNarrative): Promise<Narrative>;
  getNarrativeByTopic(topic: string): Promise<Narrative | undefined>;
  getNarratives(): Promise<Narrative[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ideasStorage: Map<number, Idea>;
  private narrativesStorage: Map<number, Narrative>;
  currentUserId: number;
  currentIdeaId: number;
  currentNarrativeId: number;

  constructor() {
    this.users = new Map();
    this.ideasStorage = new Map();
    this.narrativesStorage = new Map();
    this.currentUserId = 1;
    this.currentIdeaId = 1;
    this.currentNarrativeId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createIdea(insertIdea: InsertIdea): Promise<Idea> {
    const id = this.currentIdeaId++;
    const now = new Date();
    const idea: Idea = { 
      ...insertIdea, 
      id, 
      createdAt: now 
    };
    this.ideasStorage.set(id, idea);
    return idea;
  }

  async getIdeas(): Promise<Idea[]> {
    return Array.from(this.ideasStorage.values());
  }s
