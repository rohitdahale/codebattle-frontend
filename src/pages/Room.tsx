// CreateRoom.tsx - Minimal UI for creating rooms
// Room.tsx - Minimal room lobby/waiting area
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const Room: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    socket, 
    getRoomInfo, 
    leaveRoom, 
    changeProblem,
    onRoomInfo, 
    onRoomUpdated, 
    onRoomError,
    onProblemChanged,
    onRoomMessage
  } = useSocket();
  
  const [room, setRoom] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomCode || !socket) return;

    getRoomInfo(roomCode);

    onRoomInfo((data) => {
      setRoom(data.room);
      setIsHost(data.room.host === user?.username);
    });

    onRoomUpdated((data) => {
      setRoom(data.room);
      if (data.room.status === 'active') {
        // Match started, navigate to match page
        navigate(`/match/${roomCode}`, {
          state: {
            matchData: {
              matchId: roomCode,
              opponent: data.room.host === user?.username ? data.room.guest : data.room.host,
              problem: data.room.problem,
              timeLimit: data.room.settings?.timeLimit || 300000,
              isRoomMatch: true
            }
          }
        });
      }
    });

    onRoomError((data) => {
      setError(data.message);
    });

    onProblemChanged((data) => {
      setRoom(prev => prev ? { ...prev, problem: data.problem } : null);
    });

    onRoomMessage((data) => {
      if (data.type === 'match_started') {
        // Handle match start message
        console.log('Match starting...');
      }
    });

    return () => {
      // Cleanup listeners when component unmounts
    };
  }, [roomCode, socket, user]);

  const handleLeave = () => {
    leaveRoom();
    navigate('/dashboard');
  };

  const handleStartMatch = () => {
    if (!socket || !isHost) return;
    // Use the correct event name that matches backend
    socket.emit('start_room_match');
  };
  

  const handleChangeProblem = () => {
    if (!socket || !isHost) return;
    changeProblem(); // Random problem
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="text-white mb-4">Loading room...</div>
          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-slate-700 text-white p-3 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Room: {roomCode}</h1>
          <button
            onClick={handleLeave}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Leave Room
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Room Status */}
        <div className="bg-slate-800 p-6 rounded mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Players</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Host:</span>
              <span className="text-white">{room.host}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Guest:</span>
              <span className="text-white">{room.guest || 'Waiting...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-white">{room.status}</span>
            </div>
          </div>
        </div>

        {/* Problem Info */}
        {room.problem && (
          <div className="bg-slate-800 p-6 rounded mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Problem</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Title:</span>
                <span className="text-white">{room.problem.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Difficulty:</span>
                <span className="text-white">{room.problem.difficulty}</span>
              </div>
            </div>
          </div>
        )}

        {/* Host Controls */}
        {isHost && (
          <div className="bg-slate-800 p-6 rounded mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Host Controls</h2>
            <div className="space-y-3">
              <button
                onClick={handleChangeProblem}
                className="w-full bg-blue-600 text-white p-3 rounded"
              >
                Change Problem
              </button>
              <button
  onClick={handleStartMatch}
  disabled={!room.guest || room.status !== 'ready' || !isHost}
  className="w-full bg-green-600 text-white p-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
>
  {room.status === 'active' ? 'Match In Progress...' : 'Start Match'}
</button>
            </div>
          </div>
        )}

        {/* Waiting Message */}
        {room.status === 'waiting' && (
  <div className="bg-blue-500/20 text-blue-400 p-4 rounded text-center">
    {!room.guest 
      ? 'Waiting for another player to join...' 
      : 'Both players present. Host can start the match!'
    }
  </div>
        )}
        {room.status === 'ready' && !isHost && (
  <div className="bg-yellow-500/20 text-yellow-400 p-4 rounded text-center">
    Waiting for host to start the match...
  </div>
)}
      </div>
    </div>
  );
};

export default Room ;