import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  ArrowLeft, 
  Plus, 
  Settings, 
  Clock, 
  Target, 
  Users, 
  Loader,
  AlertTriangle,
  CheckCircle,
  Code2
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface RoomSettings {
  timeLimit: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  problemId?: string;
  isPrivate: boolean;
  maxPlayers: number;
}

interface RoomCreatedData {
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

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    socket, 
    isConnected, 
    createRoom, 
    onRoomCreated, 
    onRoomError,
    removeAllListeners 
  } = useSocket();

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<RoomSettings>({
    timeLimit: 300000, // 5 minutes in milliseconds
    difficulty: 'Medium',
    isPrivate: false,
    maxPlayers: 2
  });

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) {
      setError('No socket connection available');
      return;
    }

    const handleRoomCreated = (data: RoomCreatedData) => {
      console.log('Room created successfully:', data);
      setIsCreating(false);
      
      // Navigate to the room with the room code
      navigate(`/room/${data.roomCode}`, {
        state: {
          roomData: data.room,
          isHost: true
        }
      });
    };

    const handleRoomError = (data: RoomErrorData) => {
      console.error('Room creation error:', data);
      setError(data.message || 'Failed to create room');
      setIsCreating(false);
    };

    const handleSocketError = (error: any) => {
      console.error('Socket error during room creation:', error);
      setError('Connection error occurred');
      setIsCreating(false);
    };

    const handleDisconnect = () => {
      setError('Connection lost. Please check your internet connection.');
      setIsCreating(false);
    };

    // Register event listeners
    onRoomCreated(handleRoomCreated);
    onRoomError(handleRoomError);
    socket.on('error', handleSocketError);
    socket.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      socket.off('error', handleSocketError);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, isConnected, navigate, onRoomCreated, onRoomError]);

  const handleCreateRoom = async () => {
    if (!socket || !isConnected) {
      setError('Not connected to server');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Create room with settings
      const roomSettings = {
        timeLimit: settings.timeLimit,
        difficulty: settings.difficulty,
        isPrivate: settings.isPrivate,
        maxPlayers: settings.maxPlayers,
        problemId: settings.problemId,
        createdBy: user.id,
        createdAt: Date.now()
      };

      console.log('Creating room with settings:', roomSettings);
      createRoom(roomSettings);

      // Set a timeout to handle potential hanging requests
      setTimeout(() => {
        if (isCreating) {
          setError('Room creation timeout. Please try again.');
          setIsCreating(false);
        }
      }, 10000);

    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room. Please try again.');
      setIsCreating(false);
    }
  };

  const handleBackToDashboard = () => {
    if (socket) {
      removeAllListeners();
    }
    navigate('/dashboard');
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
              <h1 className="text-3xl font-bold text-white">Create Private Room</h1>
              <p className="text-slate-400 mt-1">Set up a custom coding match with your friends</p>
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
          {/* Room Settings */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Room Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Time Limit
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: '5 min', value: 300000 },
                      { label: '10 min', value: 600000 },
                      { label: '15 min', value: 900000 },
                      { label: '20 min', value: 1200000 }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSettings(prev => ({ ...prev, timeLimit: option.value }))}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          settings.timeLimit === option.value
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                        }`}
                        disabled={isCreating}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Selected: {formatTime(settings.timeLimit)}
                  </p>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    <Target className="w-4 h-4 inline mr-2" />
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' 
                        }))}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          settings.difficulty === difficulty
                            ? difficulty === 'Easy' 
                              ? 'bg-green-500/20 border-green-500/50 text-green-300'
                              : difficulty === 'Medium'
                              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                              : 'bg-red-500/20 border-red-500/50 text-red-300'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                        }`}
                        disabled={isCreating}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room Privacy */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    <Users className="w-4 h-4 inline mr-2" />
                    Room Privacy
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, isPrivate: false }))}
                      className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                        !settings.isPrivate
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                          : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                      }`}
                      disabled={isCreating}
                    >
                      <div className="font-semibold">Public Room</div>
                      <div className="text-xs opacity-80 mt-1">Anyone can join</div>
                    </button>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, isPrivate: true }))}
                      className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                        settings.isPrivate
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                      }`}
                      disabled={isCreating}
                    >
                      <div className="font-semibold">Private Room</div>
                      <div className="text-xs opacity-80 mt-1">Invite only</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Summary & Create Button */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Room Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Time Limit:</span>
                  <span className="text-sm font-medium text-white">
                    {formatTime(settings.timeLimit)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Difficulty:</span>
                  <Badge 
                    text={settings.difficulty || 'Medium'} 
                    variant={
                      settings.difficulty === 'Easy' ? 'success' :
                      settings.difficulty === 'Hard' ? 'danger' : 'warning'
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Privacy:</span>
                  <span className="text-sm font-medium text-white">
                    {settings.isPrivate ? 'Private' : 'Public'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Max Players:</span>
                  <span className="text-sm font-medium text-white">
                    {settings.maxPlayers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Host:</span>
                  <span className="text-sm font-medium text-purple-300">
                    {user?.username || 'You'}
                  </span>
                </div>
              </div>
            </div>

            {/* Create Room Button */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <Button
                onClick={handleCreateRoom}
                disabled={isCreating || !isConnected}
                variant="primary"
                icon={isCreating ? Loader : Plus}
                className={`w-full text-lg py-4 ${
                  isCreating ? 'animate-pulse' : ''
                }`}
              >
                {isCreating ? 'Creating Room...' : 'Create Room'}
              </Button>
              
              {isCreating && (
                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium">
                      Setting up your room...
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-3 text-center">
                You'll receive a room code to share with others
              </p>
            </div>

            {/* Connection Status */}
            <div className="mt-4 p-3 bg-slate-800/40 border border-slate-700/30 rounded-lg">
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

export default CreateRoom;