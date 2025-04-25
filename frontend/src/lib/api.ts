import { Session, Participant } from "../types";
import { API_URL } from "../config";

export const api = {
  // Session endpoints
  createSession: async (name: string): Promise<Session> => {
    const response = await fetch(`${API_URL}api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to create session");
    return response.json();
  },

  getSession: async (code: string): Promise<Session> => {
    const response = await fetch(`${API_URL}api/sessions/${code}`);
    if (!response.ok) throw new Error("Session not found");
    return response.json();
  },

  endSession: async (code: string): Promise<void> => {
    const response = await fetch(`${API_URL}api/sessions/${code}/end`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to end session");
  },

  // Participant endpoints
  addParticipant: async (
    sessionId: string,
    name: string,
    isAdmin: boolean
  ): Promise<Participant> => {
    const response = await fetch(`${API_URL}api/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, name, isAdmin }),
    });
    if (!response.ok) throw new Error("Failed to add participant");
    return response.json();
  },

  updateParticipantSocket: async (
    participantId: string,
    socketId: string
  ): Promise<void> => {
    const response = await fetch(
      `${API_URL}api/participants/${participantId}/socket`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socketId }),
      }
    );
    if (!response.ok) throw new Error("Failed to update participant socket");
  },

  // Admin endpoints
  getAdminSessions: async (): Promise<string[]> => {
    const response = await fetch(`${API_URL}api/admin/sessions`);
    if (!response.ok) throw new Error("Failed to get admin sessions");
    return response.json();
  },

  recoverAdminSession: async (code: string): Promise<boolean> => {
    const response = await fetch(
      `${API_URL}api/admin/sessions/${code}/recover`,
      {
        method: "POST",
      }
    );
    if (!response.ok) return false;
    return true;
  },
};
