import { Strategy } from 'passport';

export interface PassportStrategy {
    name: string;
    strategy: Strategy;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  password?: string;
  githubId?: string;
  role: "user" | "admin";
}

export interface AdminSessionRow {
  sessionId: string;
  userId: number;
}