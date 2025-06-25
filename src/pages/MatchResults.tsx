import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Trophy, Target, XCircle, CheckCircle, Code } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import Button from '../components/Button';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface TestResult {
  passed: boolean;
  output: string;
  expected: string;
  error?: string | null;
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

interface MatchEndData {
  winner: string | null;
  player1: PlayerResult;
  player2: PlayerResult;
  reason: string;
  matchDuration: number;
  finalScores?: {
    player1Score: number;
    player2Score: number;
  };
}

interface LocationState {
  matchEndData: MatchEndData;
  problem: Problem;
}

const MatchResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [matchEndData, setMatchEndData] = useState<MatchEndData | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    
    if (state?.matchEndData && state?.problem) {
      setMatchEndData(state.matchEndData);
      setProblem(state.problem);
    } else {
      // If no data, redirect to dashboard
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  if (!matchEndData || !problem || !user) {
    return null;
  }

  const isWinner = matchEndData.winner === user.id;
  const isDraw = matchEndData.winner === null;
  
  const currentPlayer = matchEndData.player1.id === user.id ? matchEndData.player1 : matchEndData.player2;
  const opponent = matchEndData.player1.id === user.id ? matchEndData.player2 : matchEndData.player1;

  const getResultIcon = () => {
    if (isDraw) return <Target className="w-12 h-12 text-yellow-400" />;
    return isWinner ? <Trophy className="w-12 h-12 text-yellow-400" /> : <XCircle className="w-12 h-12 text-red-400" />;
  };

  const getResultText = () => {
    if (isDraw) return "It's a Draw!";
    return isWinner ? "You Won!" : "You Lost!";
  };

  const getResultColor = () => {
    if (isDraw) return "text-yellow-400";
    return isWinner ? "text-green-400" : "text-red-400";
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleShareResults = () => {
    const results = {
      problem: problem.title,
      winner: isWinner ? 'You' : isDraw ? 'Draw' : opponent.username,
      yourScore: currentPlayer.score,
      opponentScore: opponent.score,
      duration: formatDuration(matchEndData.matchDuration)
    };
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    alert('Results copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              icon={ArrowLeft}
              className="text-slate-400 hover:text-white"
            >
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-4">
              {getResultIcon()}
              <div>
                <h2 className={`text-2xl font-bold ${getResultColor()}`}>
                  {getResultText()}
                </h2>
                <p className="text-slate-400">Match Complete</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Match Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Problem</h3>
              <p className="text-white font-semibold">{problem.title}</p>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Duration</h3>
              <p className="text-white font-semibold">{formatDuration(matchEndData.matchDuration)}</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Reason</h3>
              <p className="text-white font-semibold capitalize">
                {matchEndData.reason.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {/* Player Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your Results */}
            <div className={`bg-slate-800/60 backdrop-blur-sm border-2 rounded-xl p-6 ${
              isWinner ? 'border-green-500/50' : isDraw ? 'border-yellow-500/50' : 'border-slate-600'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Your Performance</h3>
                {isWinner && <Trophy className="w-5 h-5 text-yellow-400" />}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Player:</span>
                  <span className="text-white font-medium">{currentPlayer.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Score:</span>
                  <span className="text-white font-bold">{currentPlayer.score}/100</span>
                </div>
                {currentPlayer.executionTime && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Execution Time:</span>
                    <span className="text-white">{currentPlayer.executionTime}ms</span>
                  </div>
                )}
              </div>

              {/* Test Results */}
              {currentPlayer.testResults && currentPlayer.testResults.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">
                    Test Cases ({currentPlayer.executionResult?.passedTests || 0}/{currentPlayer.executionResult?.totalTests || currentPlayer.testResults.length})
                  </h4>
                  <div className="space-y-2">
                    {currentPlayer.testResults.map((test, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-300">Test {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            {test.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className={`text-sm font-medium ${
                              test.passed ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {test.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </div>
                        {test.error && (
                          <p className="text-xs text-red-300 bg-red-500/10 p-2 rounded mt-2">
                            {test.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Opponent Results */}
            <div className={`bg-slate-800/60 backdrop-blur-sm border-2 rounded-xl p-6 ${
              matchEndData.winner === opponent.id ? 'border-green-500/50' : isDraw ? 'border-yellow-500/50' : 'border-slate-600'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Opponent Performance</h3>
                {matchEndData.winner === opponent.id && <Trophy className="w-5 h-5 text-yellow-400" />}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Player:</span>
                  <span className="text-white font-medium">{opponent.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Score:</span>
                  <span className="text-white font-bold">{opponent.score}/100</span>
                </div>
                {opponent.executionTime && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Execution Time:</span>
                    <span className="text-white">{opponent.executionTime}ms</span>
                  </div>
                )}
              </div>

              {/* Test Results */}
              {opponent.testResults && opponent.testResults.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">
                    Test Cases ({opponent.executionResult?.passedTests || 0}/{opponent.executionResult?.totalTests || opponent.testResults.length})
                  </h4>
                  <div className="space-y-2">
                    {opponent.testResults.map((test, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Test {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            {test.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className={`text-sm font-medium ${
                              test.passed ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {test.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Code Solutions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Your Code */}
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Your Solution</h4>
                <CodeEditor
                  value={currentPlayer.code || '// No code submitted'}
                  onChange={() => {}}
                  height="300px"
                  readOnly={true}
                />
              </div>

              {/* Opponent Code */}
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Opponent's Solution</h4>
                <CodeEditor
                  value={opponent.code || '// No code submitted'}
                  onChange={() => {}}
                  height="300px"
                  readOnly={true}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4 border-t border-slate-700">
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={handleShareResults}
            >
              Share Results
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/match-history')}
            >
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;