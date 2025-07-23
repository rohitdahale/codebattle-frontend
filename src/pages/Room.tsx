import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Play, 
  Shuffle, 
  Users, 
  Clock, 
  Target, 
  Crown,
  User,
  Loader,
  AlertTriangle,
  CheckCircle,
  Code2,
  Settings,
  Hash,
  Copy,
  ExternalLink
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

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
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!roomCode || !socket) return;

    setIsLoading(true);
    getRoomInfo(roomCode);

    onRoomInfo((data) => {
      setRoom(data.room);
      setIsHost(data.room.host === user?.username);
      setIsLoading(false);
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
      setIsLoading(false);
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

  const copyRoomCode = async () => {
    if (!roomCode) return;
    
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'hard': return 'danger';
      default: return 'warning';
    }
  };

  // Loading state
  if (isLoading || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            {error ? 'Room Error' : 'Loading Room...'}
          </h1>
          {error ? (
            <>
              <p className="text-red-400 mb-6">{error}</p>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </>
          ) : (
            <p className="text-slate-400">Connecting to room {roomCode}...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleLeave}
              icon={ArrowLeft}
              className="text-slate-400 hover:text-white"
            >
              Leave Room
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-white">Room Lobby</h1>
                <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-1">
                  <Hash className="w-4 h-4 text-slate-400" />
                  <span className="text-lg font-mono text-purple-300">{roomCode}</span>
                  <button
                    onClick={copyRoomCode}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copy room code"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-slate-400 mt-1">
                {room.status === 'waiting' ? 'Waiting for players...' : 
                 room.status === 'ready' ? 'Ready to start!' : 
                 'Match in progress'}
              </p>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Players Section */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Players</h2>
                <Badge 
                  text={`${(room.host ? 1 : 0) + (room.guest ? 1 : 0)}/2`} 
                  variant="primary" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Host Card */}
                <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-300">Host</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{room.host}</div>
                      <div className="text-xs text-slate-400">
                        {isHost ? 'You' : 'Room Creator'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Card */}
                <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">Guest</span>
                  </div>
                  {room.guest ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{room.guest}</div>
                        <div className="text-xs text-slate-400">
                          {!isHost && room.guest === user?.username ? 'You' : 'Player'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                        <Loader className="w-4 h-4 animate-spin text-slate-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-400">Waiting...</div>
                        <div className="text-xs text-slate-500">
                          Share room code to invite
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Problem Information */}
            {room.problem && (
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Challenge</h2>
                  </div>
                  {isHost && (
                    <Button
                      onClick={handleChangeProblem}
                      variant="ghost"
                      icon={Shuffle}
                      className="text-slate-400 hover:text-white"
                      size="sm"
                    >
                      Change
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-white">{room.problem.title}</span>
                    <Badge 
                      text={room.problem.difficulty} 
                      variant={getDifficultyColor(room.problem.difficulty)}
                    />
                  </div>
                  
                  {room.problem.description && (
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {room.problem.description}
                    </p>
                  )}

                  {room.settings?.timeLimit && (
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>Time limit: {formatTime(room.settings.timeLimit)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Room Settings */}
            {room.settings && (
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Match Settings</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatTime(room.settings.timeLimit || 300000)}
                    </div>
                    <div className="text-xs text-slate-400">Time Limit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {room.settings.maxPlayers || 2}
                    </div>
                    <div className="text-xs text-slate-400">Max Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {room.settings.isPrivate ? 'Private' : 'Public'}
                    </div>
                    <div className="text-xs text-slate-400">Visibility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {room.status === 'active' ? 'Live' : 'Ready'}
                    </div>
                    <div className="text-xs text-slate-400">Status</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Host Controls */}
            {isHost && (
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Host Controls</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleChangeProblem}
                    variant="ghost"
                    icon={Shuffle}
                    className="w-full justify-start"
                  >
                    Change Problem
                  </Button>
                  
                  <Button
                    onClick={handleStartMatch}
                    disabled={!room.guest || room.status !== 'ready' || !isHost}
                    variant="primary"
                    icon={room.status === 'active' ? Loader : Play}
                    className={`w-full ${room.status === 'active' ? 'animate-pulse' : ''}`}
                  >
                    {room.status === 'active' ? 'Match Starting...' : 'Start Match'}
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center">
                    {!room.guest 
                      ? 'Waiting for guest to join' 
                      : room.status !== 'ready'
                      ? 'Preparing match...'
                      : 'Ready to start the match'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Room Status */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Room Status</h3>
              
              {room.status === 'waiting' && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Loader className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Waiting</span>
                  </div>
                  <p className="text-xs text-blue-300">
                    {!room.guest 
                      ? 'Waiting for another player to join...' 
                      : 'Both players present. Host can start the match!'
                    }
                  </p>
                </div>
              )}

              {room.status === 'ready' && !isHost && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Ready</span>
                  </div>
                  <p className="text-xs text-yellow-300">
                    Waiting for host to start the match...
                  </p>
                </div>
              )}

              {room.status === 'ready' && isHost && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Ready to Start</span>
                  </div>
                  <p className="text-xs text-green-300">
                    All players are ready. You can start the match!
                  </p>
                </div>
              )}

              {room.status === 'active' && (
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Play className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">Match Active</span>
                  </div>
                  <p className="text-xs text-purple-300">
                    Match is starting... Redirecting to coding arena.
                  </p>
                </div>
              )}
            </div>

            {/* Share Room */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Share Room</h3>
              
              <div className="space-y-3">
                <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Room Code</div>
                      <div className="text-lg font-mono text-purple-300">{roomCode}</div>
                    </div>
                    <button
                      onClick={copyRoomCode}
                      className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-600/30"
                      title="Copy room code"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Share this code with friends to invite them
                </p>

                {copied && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">
                        Room code copied to clipboard!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  Back to Dashboard
                </Button>
                
                <Button
                  onClick={() => navigate('/create-room')}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  icon={ExternalLink}
                >
                  Create New Room
                </Button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="p-3 bg-slate-800/40 border border-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Connected to room</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;