import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const JoinRoom: React.FC = () => {
  const navigate = useNavigate();
  const { socket, joinRoom, onRoomJoined, onRoomError } = useSocket();
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    onRoomJoined((data) => {
      console.log('Room joined:', data);
      navigate(`/room/${data.roomCode}`);
    });

    onRoomError((data) => {
      setError(data.message);
      setIsJoining(false);
    });
  }, []);

  const handleJoin = () => {
    if (!socket || !roomCode.trim()) return;
    setIsJoining(true);
    setError('');
    joinRoom(roomCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Join Room</h1>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-full bg-slate-800 text-white p-3 rounded mb-4"
          maxLength={6}
        />

        <button
          onClick={handleJoin}
          disabled={isJoining || !roomCode.trim()}
          className="w-full bg-blue-600 text-white p-3 rounded disabled:opacity-50"
        >
          {isJoining ? 'Joining...' : 'Join Room'}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-4 bg-slate-700 text-white p-3 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;