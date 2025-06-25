import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Interface definitions based on your backend
interface QueueJoinedData {
  message: string;
  queueSize: number;
}

interface QueueLeftData {
  message: string;
}

interface MatchFoundData {
  matchId: string;
  opponent: string;
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    examples: Array<{
      input: string;
      output: string;
    }>;
    starterCode?: string;
    keywords?: string[];
    category?: string;
  };
  timeLimit: number;
}

interface MatchStartedData {
  matchId?: string;
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    examples: Array<{
      input: string;
      output: string;
    }>;
    starterCode?: string;
    keywords?: string[];
    category?: string;
  };
  timeLimit: number;
  startTime: number;
}

interface PlayerReadyStatusData {
  player1Ready: boolean;
  player2Ready: boolean;
}

interface MatchErrorData {
  message: string;
}

interface OpponentSubmittedData {
  player1Submitted: boolean;
  player2Submitted: boolean;
}

interface MatchEndedData {
  winner: string | null;
  player1: {
    id: string;
    username: string;
    score: number;
    code: string;
  };
  player2: {
    id: string;
    username: string;
    score: number;
    code: string;
  };
  reason: string;
  matchDuration: number;
}

interface MatchMessageData {
  message: string;
  username: string;
  userId: string;
  timestamp: number;
}

interface OpponentCodeUpdateData {
  code: string;
  userId: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: number;
  // Queue methods
  joinQueue: () => void;
  leaveQueue: () => void;
  // Match methods
  playerReady: () => void;
  submitCode: (code: string) => void;
  sendCodeUpdate: (code: string) => void;
  sendMatchMessage: (message: string) => void;
  // Event listeners
  onQueueJoined: (callback: (data: QueueJoinedData) => void) => void;
  onQueueLeft: (callback: (data: QueueLeftData) => void) => void;
  onMatchFound: (callback: (data: MatchFoundData) => void) => void;
  onMatchStarted: (callback: (data: MatchStartedData) => void) => void;
  onPlayerReadyStatus: (callback: (data: PlayerReadyStatusData) => void) => void;
  onMatchError: (callback: (data: MatchErrorData) => void) => void;
  onOpponentSubmitted: (callback: (data: OpponentSubmittedData) => void) => void;
  onMatchEnded: (callback: (data: MatchEndedData) => void) => void;
  onMatchMessage: (callback: (data: MatchMessageData) => void) => void;
  onOpponentCodeUpdate: (callback: (data: OpponentCodeUpdateData) => void) => void;
  onOpponentDisconnected: (callback: () => void) => void;
  // Cleanup methods
  removeAllListeners: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Initialize socket connection
        const socketInstance = io('https://codebattle-backend-1.onrender.com', {
          auth: {
            token: token
          },
          transports: ['websocket']
        });

        // Connection events
        socketInstance.on('connect', () => {
          console.log('Connected to server');
          setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from server');
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setIsConnected(false);
        });

        // Online users count (you might want to add this to your backend)
        socketInstance.on('online_users_count', (count: number) => {
          setOnlineUsers(count);
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
          setSocket(null);
          setIsConnected(false);
        };
      }
    } else {
      // Clean up socket when user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  // Queue methods
  const joinQueue = () => {
    if (socket && isConnected) {
      socket.emit('join_queue');
    }
  };

  const leaveQueue = () => {
    if (socket && isConnected) {
      socket.emit('leave_queue');
    }
  };

  // Match methods
  const playerReady = () => {
    if (socket && isConnected) {
      socket.emit('player_ready');
    }
  };

  const submitCode = (code: string) => {
    if (socket && isConnected) {
      socket.emit('submit_code', { code });
    }
  };

  const sendCodeUpdate = (code: string) => {
    if (socket && isConnected) {
      socket.emit('code_update', { code });
    }
  };

  const sendMatchMessage = (message: string) => {
    if (socket && isConnected) {
      socket.emit('match_message', { message });
    }
  };

  // Event listener methods
  const onQueueJoined = (callback: (data: QueueJoinedData) => void) => {
    if (socket) {
      socket.on('queue_joined', callback);
    }
  };

  const onQueueLeft = (callback: (data: QueueLeftData) => void) => {
    if (socket) {
      socket.on('queue_left', callback);
    }
  };

  const onMatchFound = (callback: (data: MatchFoundData) => void) => {
    if (socket) {
      socket.on('match_found', callback);
    }
  };

  const onMatchStarted = (callback: (data: MatchStartedData) => void) => {
    if (socket) {
      socket.on('match_started', callback);
    }
  };

  const onPlayerReadyStatus = (callback: (data: PlayerReadyStatusData) => void) => {
    if (socket) {
      socket.on('player_ready_status', callback);
    }
  };

  const onMatchError = (callback: (data: MatchErrorData) => void) => {
    if (socket) {
      socket.on('match_error', callback);
    }
  };

  const onOpponentSubmitted = (callback: (data: OpponentSubmittedData) => void) => {
    if (socket) {
      socket.on('opponent_submitted', callback);
    }
  };

  const onMatchEnded = (callback: (data: MatchEndedData) => void) => {
    if (socket) {
      socket.on('match_ended', callback);
    }
  };

  const onMatchMessage = (callback: (data: MatchMessageData) => void) => {
    if (socket) {
      socket.on('match_message', callback);
    }
  };

  const onOpponentCodeUpdate = (callback: (data: OpponentCodeUpdateData) => void) => {
    if (socket) {
      socket.on('opponent_code_update', callback);
    }
  };

  const onOpponentDisconnected = (callback: () => void) => {
    if (socket) {
      socket.on('opponent_disconnected', callback);
    }
  };

  const removeAllListeners = () => {
    if (socket) {
      socket.removeAllListeners();
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    joinQueue,
    leaveQueue,
    playerReady,
    submitCode,
    sendCodeUpdate,
    sendMatchMessage,
    onQueueJoined,
    onQueueLeft,
    onMatchFound,
    onMatchStarted,
    onPlayerReadyStatus,
    onMatchError,
    onOpponentSubmitted,
    onMatchEnded,
    onMatchMessage,
    onOpponentCodeUpdate,
    onOpponentDisconnected,
    removeAllListeners,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};