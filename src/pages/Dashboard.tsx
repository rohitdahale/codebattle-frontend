import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Zap, Trophy, Target, BookOpen, Users, Star, Clock, TrendingUp, X } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import axios from 'axios';
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    wins: 0,
    totalMatches: 0,
    winRate: 0,
    rank: 'Unranked',
    badges: [],
    recentMatches: []
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
  
        const response = await axios.get('http://localhost:5000/api/match/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.data.user) {
          setUserStats({
            level: response.data.user.level || 1,
            xp: response.data.user.xp || 0,
            wins: response.data.user.wins || 0,
            totalMatches: response.data.user.totalMatches || 0,
            winRate: response.data.user.winRate || 0,
            rank: response.data.user.rank || 'Unranked',
            badges: response.data.user.badges || [],
            recentMatches: response.data.user.recentMatches || []
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (user) {
      fetchUserProfile();
    }
  }, [user]);
  

  const handleQuickMatch = () => {
    navigate('/match-finder');
  };

  if (!user) return null;

  // Fix XP calculation with proper fallbacks
  const currentLevel = userStats.level;
  const currentXp = userStats.xp;
  const xpToNextLevel = currentLevel * 200; // XP needed for next level
  const previousLevelXp = (currentLevel - 1) * 200; // XP for current level start
  const xpInCurrentLevel = currentXp - previousLevelXp; // Progress within current level
  const xpNeededForCurrentLevel = xpToNextLevel - previousLevelXp; // Total XP needed for current level
  const progressPercentage = Math.max(0, Math.min(100, (xpInCurrentLevel / xpNeededForCurrentLevel) * 100));  

// Add this right after the user check
if (!user) return null;
if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}

  // Provide fallback values for all user stats
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{user.username}</span>!
              </h1>
              <p className="text-slate-400">Ready to battle some code challenges?</p>
              {!isConnected && (
                <p className="text-red-400 text-sm mt-1">⚠️ Connection lost - some features may not work</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Current Rank</p>
                <p className="text-sm text-slate-400"> {userStats.xp} / {xpToNextLevel} XP</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {typeof userStats.rank === 'number' ? `#${userStats.rank}` : userStats.rank}
                </p>
              </div>
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-16 h-16 rounded-full border-4 border-cyan-400"
                />
              )}
            </div>
          </div>

          {/* XP Progress */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Level {userStats.level}</h3>
                  <p className="text-sm text-slate-400">
                    {userStats.xp} / {xpToNextLevel} XP
                  </p>
                </div>
              </div>
              <Badge text={`${Math.round(progressPercentage)}% to next level`} variant="info" />
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Queue Status */}
    

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userStats.wins}</p>
                <p className="text-sm text-slate-400">Wins</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userStats.totalMatches}</p>
                <p className="text-sm text-slate-400">Total Matches</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userStats.winRate}%</p>
                <p className="text-sm text-slate-400">Win Rate</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userStats.xp}</p>
                <p className="text-sm text-slate-400">Total XP</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card hover onClick={handleQuickMatch}>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Quick Match</h3>
                  <p className="text-slate-400 mb-4">Jump into a random coding battle</p>
                  <Button 
                    variant="primary" 
                    className="w-full"
                    disabled={!isConnected}
                  >
                    Find Match
                  </Button>
                </div>
              </Card>

              <Card hover onClick={() => navigate('/match/create')}>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Create Room</h3>
                  <p className="text-slate-400 mb-4">Start a private battle with friends</p>
                  <Button variant="secondary" className="w-full">
                    Create Room
                  </Button>
                </div>
              </Card>

              <Card hover onClick={() => navigate('/practice')}>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Practice</h3>
                  <p className="text-slate-400 mb-4">Sharpen your skills solo</p>
                  <Button variant="success" className="w-full">
                    Start Practice
                  </Button>
                </div>
              </Card>

              <Card hover onClick={() => navigate('/leaderboard')}>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Leaderboard</h3>
                  <p className="text-slate-400 mb-4">See how you rank globally</p>
                  <Button variant="ghost" className="w-full">
                    View Rankings
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Activity & Badges */}
          <div className="space-y-8">
            {/* Badges */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
              <Card>
                <div className="space-y-3">
                  {userStats.badges.length > 0 ? (
                    userStats.badges.map((badge, index) => (
                      <div key={badge.id || index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{badge.name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No achievements yet</p>
                      <p className="text-sm text-slate-500">Complete matches to earn badges!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Recent Matches */}
            <div>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-white">Recent Matches</h2>
    <Button 
      variant="ghost" 
      size="sm"
      onClick={() => navigate('/match-history')}
      className="text-cyan-400 hover:text-cyan-300"
    >
      View All
    </Button>
  </div>
  <Card>
    <div className="space-y-3">
      {userStats.recentMatches.length > 0 ? (
        userStats.recentMatches.slice(0, 3).map((match, index) => (
          <div key={match.id || index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">vs {match.opponent}</p>
              <p className="text-xs text-slate-400">{match.problem}</p>
            </div>
            <div className="text-right">
              <Badge
                text={match.result}
                variant={match.result === 'win' ? 'success' : match.result === 'loss' ? 'danger' : 'warning'}
                size="sm"
              />
              <p className="text-xs text-slate-400 mt-1">{match.time}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No recent matches</p>
          <p className="text-sm text-slate-500">Start your first coding battle!</p>
        </div>
      )}
      {userStats.recentMatches.length > 3 && (
        <div className="pt-3 border-t border-slate-700">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/match-history')}
            className="w-full text-cyan-400 hover:text-cyan-300"
          >
            View {userStats.recentMatches.length - 3} more matches
          </Button>
        </div>
      )}
    </div>
  </Card>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;