import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  ArrowLeft, 
  LogIn, 
  Users, 
  Loader,
  AlertTriangle,
  CheckCircle,
  Code2,
  Hash,
  Search
} from 'lucide-react';
import Button from '../components/Button';

interface RoomJoinedData {
  roomCode: string;
  room: {
    code: string;
    host: string;
    guest: string | null;
    problem: any;
    settings: any;
    status: string;
  };
}

interface RoomErrorData {
  message: string;
}

const JoinRoom: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    socket, 
    isConnected, 
    joinRoom, 
    onRoomJoined, 
    onRoomError,
    removeAllListeners 
  } = useSocket();

  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) {
      setError('No socket connection available');
      return;
    }

    const handleRoomJoined = (data: RoomJoinedData) => {
      console.log('Room joined successfully:', data);
      setIsJoining(false);
      
      // Navigate to the room with the room code
      navigate(`/room/${data.roomCode}`, {
        state: {
          roomData: data.room,
          isHost: false
        }
      });
    };

    const handleRoomError = (data: RoomErrorData) => {
      console.error('Room join error:', data);
      setError(data.message || 'Failed to join room');
      setIsJoining(false);
    };

    const handleSocketError = (error: any) => {
      console.error('Socket error during room join:', error);
      setError('Connection error occurred');
      setIsJoining(false);
    };

    const handleDisconnect = () => {
      setError('Connection lost. Please check your internet connection.');
      setIsJoining(false);
    };

    // Register event listeners
    onRoomJoined(handleRoomJoined);
    onRoomError(handleRoomError);
    socket.on('error', handleSocketError);
    socket.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      socket.off('error', handleSocketError);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, isConnected, navigate, onRoomJoined, onRoomError]);

  const handleJoin = async () => {
    if (!socket || !isConnected) {
      setError('Not connected to server');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      console.log('Joining room with code:', roomCode.trim().toUpperCase());
      joinRoom(roomCode.trim().toUpperCase());

      // Set a timeout to handle potential hanging requests
      setTimeout(() => {
        if (isJoining) {
          setError('Room join timeout. Please try again.');
          setIsJoining(false);
        }
      }, 10000);

    } catch (error) {
      console.error('Error joining room:', error);
      setError('Failed to join room. Please try again.');
      setIsJoining(false);
    }
  };

  const handleBackToDashboard = () => {
    if (socket) {
      removeAllListeners();
    }
    navigate('/dashboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setRoomCode(value);
      if (error) setError(''); // Clear error when user starts typing
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && roomCode.trim() && !isJoining) {
      handleJoin();
    }
  };

  // Show connection error if not connected
  if (!isConnected || !socket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Connection Error</h1>
          <p className="text-slate-400 mb-6">
            Unable to connect to the server. Please check your internet connection and try again.
          </p>
          <div className="space-x-4">
            <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              icon={ArrowLeft}
              className="text-slate-400 hover:text-white"
            >
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Join Private Room</h1>
              <p className="text-slate-400 mt-1">Enter a room code to join an existing match</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Join Room Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Enter Room Code</h2>
              </div>

              <div className="space-y-6">
                {/* Room Code Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    <Hash className="w-4 h-4 inline mr-2" />
                    Room Code (6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ABC123"
                      value={roomCode}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-slate-700/50 border border-slate-600/50 text-white text-2xl font-mono text-center p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder-slate-500"
                      maxLength={6}
                      disabled={isJoining}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {roomCode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="text-slate-400 text-sm">
                          {roomCode.length}/6
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Enter the 6-character room code shared by the host
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">How to join:</h3>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Ask the room host for the 6-character room code</li>
                    <li>• Enter the code above (letters and numbers only)</li>
                    <li>• Click "Join Room" or press Enter</li>
                    <li>• Wait for the host to start the match</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Join Action & Status */}
          <div className="lg:col-span-1">
            {/* User Info */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Player Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Username:</span>
                  <span className="text-sm font-medium text-purple-300">
                    {user?.username || 'Guest'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Role:</span>
                  <span className="text-sm font-medium text-white">Guest</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status:</span>
                  <span className="text-sm font-medium text-green-400">Ready to join</span>
                </div>
              </div>
            </div>

            {/* Join Room Button */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
              <Button
                onClick={handleJoin}
                disabled={isJoining || !roomCode.trim() || !isConnected}
                variant="primary"
                icon={isJoining ? Loader : LogIn}
                className={`w-full text-lg py-4 ${
                  isJoining ? 'animate-pulse' : ''
                }`}
              >
                {isJoining ? 'Joining Room...' : 'Join Room'}
              </Button>
              
              {isJoining && (
                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium">
                      Connecting to room...
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-3 text-center">
                You'll be taken to the room lobby once joined
              </p>
            </div>

            {/* Alternative Actions */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Other Options</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/create-room')}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  Create Your Own Room
                </Button>
                <Button
                  onClick={() => navigate('/matchmaking')}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  icon={Search}
                >
                  Find Quick Match
                </Button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="p-3 bg-slate-800/40 border border-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Connected to server</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">Connection lost</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;