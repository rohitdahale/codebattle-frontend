import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ArrowLeft, Users, Clock, Send, Trophy, X, CheckCircle, XCircle, Code, Target, AlertTriangle, Loader } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import Timer from '../components/Timer';
import Button from '../components/Button';
import Badge from '../components/Badge';

// Define proper TypeScript interfaces matching backend
interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examples: Array<{
    input: string;
    output: string;
  }>;
  starterCode?: string;
  keywords?: string[];
  category?: string;
  testCases?: TestCase[];
}

interface TestCase {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
}

interface TestResult {
  passed: boolean;
  output: string;
  expected: string;
  error?: string | null;
  inputs?: any[];
  details?: string;
}

interface ExecutionResult {
  success: boolean;
  testResults: TestResult[];
  executionTime: number;
  score: number;
  compilationError?: string;
  totalTests: number;
  passedTests: number;
}

interface PlayerResult {
  id: string;
  username: string;
  score: number;
  code: string;
  testResults?: TestResult[];
  executionTime?: number;
  executionResult?: ExecutionResult;
}

interface MatchData {
  matchId: string;
  opponent: string;
  problem: Problem;
  timeLimit: number;
  startTime?: number;
  status?: 'waiting' | 'active' | 'completed';
}

interface LocationState {
  matchData?: MatchData;
  problem?: Problem;
}

interface OpponentSubmissionData {
  player1Submitted: boolean;
  player2Submitted: boolean;
  playerId?: string;
}

interface MatchEndData {
  winner: string | null;
  player1: PlayerResult;
  player2: PlayerResult;
  reason: string;
  matchDuration: number;
  testCases?: TestCase[];
  finalScores?: {
    player1Score: number;
    player2Score: number;
  };
}

interface MatchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchEndData: MatchEndData | null;
  currentUser: { id: string; username: string } | null;
  problem: Problem;
}

interface SocketError {
  message: string;
  code?: string;
  details?: any;
}

const Match: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [code, setCode] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [opponentSubmitted, setOpponentSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Get match data from navigation state or initialize empty
  useEffect(() => {
    const state = location.state as LocationState;
    
    if (state?.matchData) {
      const data: MatchData = {
        ...state.matchData,
        problem: state.problem || state.matchData.problem,
        opponent: state.matchData.opponent
      };
      
      setMatchData(data);
      
      // Set starter code if available
      if (data.problem?.starterCode) {
        setCode(data.problem.starterCode);
      } else {
        // Default starter code based on problem
        const defaultStarter = getDefaultStarterCode(data.problem?.title || '');
        setCode(defaultStarter);
      }
      
      setIsLoading(false);
    } else {
      console.error('No match data found in navigation state');
      setConnectionError('Match data not found. Please start a new match.');
      setIsLoading(false);
    }
  }, [location.state]);

  // Get default starter code for common problems
  const getDefaultStarterCode = (problemTitle: string): string => {
    const lowerTitle = problemTitle.toLowerCase();
    
    if (lowerTitle.includes('two sum')) {
      return `function twoSum(nums, target) {
    // Your code here
    return [];
}`;
    } else if (lowerTitle.includes('reverse string')) {
      return `function reverseString(s) {
    // Your code here
    // Note: Modify s in-place
}`;
    } else if (lowerTitle.includes('palindrome')) {
      return `function isPalindrome(x) {
    // Your code here
    return false;
}`;
    } else if (lowerTitle.includes('valid parentheses')) {
      return `function isValid(s) {
    // Your code here
    return false;
}`;
    } else if (lowerTitle.includes('merge')) {
      return `function mergeTwoLists(list1, list2) {
    // Your code here
    return null;
}`;
    } else if (lowerTitle.includes('maximum subarray')) {
      return `function maxSubArray(nums) {
    // Your code here
    return 0;
}`;
    } else if (lowerTitle.includes('climbing stairs')) {
      return `function climbStairs(n) {
    // Your code here
    return 0;
}`;
    } else if (lowerTitle.includes('binary search')) {
      return `function search(nums, target) {
    // Your code here
    return -1;
}`;
    } else if (lowerTitle.includes('fizz buzz')) {
      return `function fizzBuzz(n) {
    // Your code here
    return [];
}`;
    } else if (lowerTitle.includes('stock')) {
      return `function maxProfit(prices) {
    // Your code here
    return 0;
}`;
    }
    
    return `function solution() {
    // Your code here
    return null;
}`;
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) {
      setConnectionError('No socket connection available');
      return;
    }

    const handleOpponentSubmitted = (data: OpponentSubmissionData) => {
      console.log('Opponent submission update:', data);
      setOpponentSubmitted(data.player1Submitted || data.player2Submitted);
    };

    const handleMatchEnded = (data: MatchEndData) => {
      console.log('Match ended data:', data);
      setIsSubmitting(false);
      
      // Navigate to results page with data
      navigate('/match-results', {
        state: {
          matchEndData: data,
          problem: matchData?.problem
        }
      });
    };
    

    const handleOpponentDisconnected = () => {
      alert('Opponent disconnected! You win by default.');
      setTimeout(() => navigate('/dashboard'), 2000);
    };

    const handleMatchError = (data: SocketError) => {
      console.error('Match error:', data);
      setConnectionError(data.message);
      setIsSubmitting(false);
      setTimeout(() => navigate('/dashboard'), 3000);
    };

    const handleSocketError = (error: any) => {
      console.error('Socket error:', error);
      setConnectionError('Connection error occurred');
    };

    const handleDisconnect = () => {
      setConnectionError('Connection lost. Please refresh to reconnect.');
    };

    const handleReconnect = () => {
      setConnectionError('');
      console.log('Reconnected to match');
    };

    // Register event listeners
    socket.on('opponent_submitted', handleOpponentSubmitted);
    socket.on('match_ended', handleMatchEnded);
    socket.on('opponent_disconnected', handleOpponentDisconnected);
    socket.on('match_error', handleMatchError);
    socket.on('error', handleSocketError);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);

    // Join match room if we have match data
    if (matchData?.matchId) {
      socket.emit('join_match', { matchId: matchData.matchId });
    }

    return () => {
      socket.off('opponent_submitted', handleOpponentSubmitted);
      socket.off('match_ended', handleMatchEnded);
      socket.off('opponent_disconnected', handleOpponentDisconnected);
      socket.off('match_error', handleMatchError);
      socket.off('error', handleSocketError);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
    };
  }, [socket, user?.id, navigate, matchData?.matchId, matchData?.opponent]);

  const handleSubmit = useCallback(async () => {
    if (!socket || isSubmitted || !code.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    setIsSubmitted(true);
    
    try {
      // Include problem ID for proper test case handling
      const submissionData = {
        code: code.trim(),
        problemId: matchData?.problem?.id,
        language: 'javascript', // Default to JavaScript
        timestamp: Date.now()
      };
      
      console.log('Submitting code:', submissionData);
      socket.emit('submit_code', submissionData);
      
      // Timeout for submission
      setTimeout(() => {
        if (isSubmitting) {
          setConnectionError('Submission timeout. Please try again.');
          setIsSubmitting(false);
          setIsSubmitted(false);
        }
      }, 30000); // 30 second timeout
      
    } catch (error) {
      console.error('Submission error:', error);
      setConnectionError('Failed to submit code. Please try again.');
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  }, [socket, isSubmitted, code, isSubmitting, matchData?.problem?.id]);

  const handleTimeUp = useCallback(() => {
    console.log('Time is up!');
    if (!isSubmitted && !isSubmitting) {
      handleSubmit();
    }
  }, [handleSubmit, isSubmitted, isSubmitting]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    
    // Send code updates to opponent (for live coding features)
    if (socket && !isSubmitted && matchData?.matchId) {
      socket.emit('code_update', { 
        code: newCode,
        matchId: matchData.matchId,
        timestamp: Date.now()
      });
    }
  }, [socket, isSubmitted, matchData?.matchId]);
  
  const handleForceExit = () => {
    if (socket && matchData?.matchId) {
      socket.emit('leave_match', { matchId: matchData.matchId });
    }
    navigate('/dashboard');
  };

  // Show loading if still loading or no match data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Loading Match...</h1>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!matchData || connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            {connectionError || 'Match Not Found'}
          </h1>
          <p className="text-slate-400 mb-6">
            {connectionError || 'The match data could not be loaded. Please try starting a new match.'}
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            {connectionError && (
              <Button variant="ghost" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate initial timer value
  const getInitialTime = (): number => {
    if (matchData.startTime) {
      const elapsed = Date.now() - matchData.startTime;
      const remaining = Math.max(0, matchData.timeLimit - elapsed);
      return Math.floor(remaining / 1000);
    }
    return Math.floor(matchData.timeLimit / 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleForceExit}
                icon={ArrowLeft}
                className="text-slate-400 hover:text-white"
              >
                Exit Match
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">{matchData.problem.title}</h1>
                <Badge 
                  text={matchData.problem.difficulty} 
                  variant={getDifficultyColor(matchData.problem.difficulty)} 
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Timer
                initialTime={getInitialTime()}
                onTimeUp={handleTimeUp}
              />
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400">vs {matchData.opponent || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Connection Error Banner */}
          {connectionError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium">{connectionError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Problem Description */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Problem</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {matchData.problem.description}
                </p>

                {matchData.problem.examples && matchData.problem.examples.length > 0 && (
                  <>
                    <h3 className="text-md font-semibold text-white mb-3">Examples</h3>
                    {matchData.problem.examples.map((example, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-3 mb-3">
                        <div className="text-sm text-slate-400 mb-1">Input:</div>
                        <code className="text-xs text-slate-300 font-mono bg-slate-800/50 p-2 rounded block">
                          {example.input}
                        </code>
                        <div className="text-sm text-slate-400 mb-1 mt-2">Output:</div>
                        <code className="text-xs text-slate-300 font-mono bg-slate-800/50 p-2 rounded block">
                          {example.output}
                        </code>
                      </div>
                    ))}
                  </>
                )}

                {matchData.problem.category && (
                  <div className="mt-4">
                    <span className="text-xs text-slate-400">Category: </span>
                    <span className="text-xs text-purple-400 font-medium">
                      {matchData.problem.category}
                    </span>
                  </div>
                )}

                {matchData.problem.keywords && matchData.problem.keywords.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-slate-400 mb-2">Keywords:</div>
                    <div className="flex flex-wrap gap-1">
                      {matchData.problem.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Match Status */}
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <h3 className="text-md font-semibold text-white mb-3">Match Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Your Status:</span>
                    <div className="flex items-center space-x-2">
                      {isSubmitted ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        isSubmitted ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {isSubmitted ? 'Submitted' : 'Coding'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Opponent:</span>
                    <div className="flex items-center space-x-2">
                      {opponentSubmitted ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        opponentSubmitted ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {opponentSubmitted ? 'Submitted' : 'Coding'}
                      </span>
                    </div>
                  </div>

                  {isSubmitted && opponentSubmitted && (
                    <div className="mt-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-sm text-blue-400 font-medium">
                          Evaluating submissions...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-bold text-white">Code Editor</h2>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isSubmitting && (
                      <div className="flex items-center space-x-2">
                        <Loader className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-sm text-blue-400">Submitting...</span>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitted || !code.trim() || isSubmitting}
                      variant={isSubmitted ? "success" : "primary"}
                      icon={isSubmitted ? CheckCircle : Send}
                      className={`${
                        isSubmitted 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted' : 'Submit Solution'}
                    </Button>
                  </div>
                </div>

                <div className="h-[600px]">
                  <CodeEditor
                    value={code}
                    onChange={handleCodeChange}
                    height="600px"
                    readOnly={isSubmitted}
                    className={isSubmitted ? 'opacity-60' : ''}
                  />
                </div>

                {isSubmitted && (
                  <div className="p-4 bg-green-500/10 border-t border-green-500/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400 font-medium">
                        Code submitted successfully! Waiting for results...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Match;