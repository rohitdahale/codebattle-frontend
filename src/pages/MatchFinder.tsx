import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ArrowLeft, Zap, Clock, Users, X } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface QueueState {
  isInQueue: boolean;
  message: string;
  queueSize: number;
}

interface MatchFound {
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

const MatchFinder: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  
  const [queueState, setQueueState] = useState<QueueState>({
    isInQueue: false,
    message: '',
    queueSize: 0
  });
  const [matchFound, setMatchFound] = useState<MatchFound | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Queue events
    socket.on('queue_joined', (data) => {
      setQueueState({
        isInQueue: true,
        message: data.message,
        queueSize: data.queueSize
      });
    });

    socket.on('queue_left', (data) => {
      setQueueState({
        isInQueue: false,
        message: data.message,
        queueSize: 0
      });
    });

    // Match found
    socket.on('match_found', (data: MatchFound) => {
      setMatchFound(data);
      setShowMatchModal(true);
      setQueueState(prev => ({ ...prev, isInQueue: false }));
    });

    // Match started
    socket.on('match_started', (data) => {
      setShowMatchModal(false);
      navigate(`/match/${matchFound?.matchId}`, {
        state: { 
          matchData: { 
            ...data, 
            opponent: matchFound?.opponent 
          }, 
          problem: matchFound?.problem 
        }
      });
    });

    // Player ready status
    socket.on('player_ready_status', (data) => {
      console.log('Ready status:', data);
    });

    // Error handling
    socket.on('match_error', (data) => {
      alert(data.message);
      setQueueState(prev => ({ ...prev, isInQueue: false }));
      setShowMatchModal(false);
    });

    return () => {
      socket.off('queue_joined');
      socket.off('queue_left');
      socket.off('match_found');
      socket.off('match_started');
      socket.off('player_ready_status');
      socket.off('match_error');
    };
  }, [socket, navigate, matchFound?.matchId, matchFound?.opponent, matchFound?.problem]);

  const handleJoinQueue = () => {
    if (!socket || !isConnected) {
      alert('Not connected to server. Please refresh the page.');
      return;
    }

    if (queueState.isInQueue) {
      socket.emit('leave_queue');
    } else {
      socket.emit('join_queue');
    }
  };

  const handlePlayerReady = () => {
    if (!socket) return;
    
    setIsReady(true);
    socket.emit('player_ready');
  };

  const handleLeaveMatch = () => {
    if (!socket) return;
    
    socket.emit('leave_queue');
    setShowMatchModal(false);
    setMatchFound(null);
    setIsReady(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              icon={ArrowLeft}
            >
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Match Finder</h1>
              <p className="text-slate-400">Find your coding opponent</p>
            </div>
          </div>
          {!isConnected && (
            <p className="text-red-400 text-sm">⚠️ Connection lost - please refresh</p>
          )}
        </div>

        {/* Queue Status or Join Button */}
        {queueState.isInQueue ? (
          <Card className="mb-8 border-cyan-500/50 bg-cyan-500/10">
            <div className="text-center py-8">
              <div className="animate-spin mb-4 mx-auto">
                <Clock className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">{queueState.message}</h2>
              <p className="text-slate-400 mb-6">Players in queue: {queueState.queueSize}</p>
              <Button variant="ghost" onClick={handleJoinQueue}>
                Cancel Search
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="mb-8">
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Ready for Battle?</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Join the queue to be matched with an opponent of similar skill level. 
                May the best coder win!
              </p>
              <Button 
                variant="primary" 
                onClick={handleJoinQueue}
                disabled={!isConnected}
                className="px-12 py-4 text-lg"
              >
                <Users className="w-6 h-6 mr-2" />
                Find Match
              </Button>
            </div>
          </Card>
        )}

        {/* Match Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-lg w-fit mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-sm text-slate-400">Online Players</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg w-fit mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">~30s</p>
              <p className="text-sm text-slate-400">Avg Wait Time</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg w-fit mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-sm text-slate-400">Matches Today</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Match Found Modal */}
      {showMatchModal && matchFound && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Match Found!</h2>
              <Button variant="ghost" onClick={handleLeaveMatch} icon={X} />
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="text-center">
                <p className="text-lg text-white mb-2">
                  You're matched against <span className="text-cyan-400 font-bold">{matchFound.opponent}</span>
                </p>
                <Badge text={matchFound.problem.difficulty} variant="warning" />
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">{matchFound.problem.title}</h3>
                <p className="text-sm text-slate-300 mb-3">{matchFound.problem.description}</p>
                <p className="text-xs text-slate-400">
                  Time limit: {Math.floor(matchFound.timeLimit / 60000)} minutes
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="primary"
                onClick={handlePlayerReady}
                disabled={isReady}
                className="flex-1"
              >
                {isReady ? 'Ready! Waiting for opponent...' : 'Ready to Battle!'}
              </Button>
              <Button
                variant="ghost"
                onClick={handleLeaveMatch}
                className="flex-1"
              >
                Leave Match
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MatchFinder;