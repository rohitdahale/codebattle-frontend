// Create a new file: src/services/roomApi.ts

import axios from 'axios';

const API_BASE_URL = 'https://codebattle-backend-1.onrender.com/api';

interface RoomSettings {
  maxPlayers?: number;
  timeLimit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  isPrivate?: boolean;
}

interface Room {
  id: string;
  hostId: string;
  hostUsername: string;
  players: Array<{
    id: string;
    username: string;
    isReady: boolean;
    isHost: boolean;
  }>;
  settings: {
    maxPlayers: number;
    timeLimit: number;
    difficulty: string;
    isPrivate: boolean;
  };
  status: string;
  createdAt: string;
}

const getAuthHeaders = () => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      return {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
    }
    
    // Return empty headers if no token available
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  };

export const roomApi = {
  // Create a new room
  createRoom: async (settings: RoomSettings = {}): Promise<Room> => {
    const response = await axios.post(
      `${API_BASE_URL}/room/create`,
      { settings },
      getAuthHeaders()
    );
    return response.data.room;
  },

  // Join a room
  joinRoom: async (roomId: string): Promise<Room> => {
    const response = await axios.post(
      `${API_BASE_URL}/room/join/${roomId}`,
      {},
      getAuthHeaders()
    );
    return response.data.room;
  },

  // Leave current room
  leaveRoom: async (): Promise<void> => {
    await axios.post(
      `${API_BASE_URL}/room/leave`,
      {},
      getAuthHeaders()
    );
  },

  // Get current room
  getCurrentRoom: async (): Promise<Room | null> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/room/current`,
        getAuthHeaders()
      );
      return response.data.room;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get public rooms
  getPublicRooms: async (): Promise<Array<{
    id: string;
    hostUsername: string;
    playerCount: number;
    maxPlayers: number;
    difficulty: string;
    timeLimit: number;
    createdAt: string;
  }>> => {
    const response = await axios.get(
      `${API_BASE_URL}/room/public`,
      getAuthHeaders()
    );
    return response.data.rooms;
  },

  // Get room details
  getRoomDetails: async (roomId: string): Promise<Room> => {
    const response = await axios.get(
      `${API_BASE_URL}/room/${roomId}`,
      getAuthHeaders()
    );
    return response.data.room;
  }
};