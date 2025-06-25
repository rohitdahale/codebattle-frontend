import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users, Crown, Zap } from 'lucide-react';

// Type definitions
interface User {
  _id: string;
  username: string;
  level: number;
  xp: number;
  wins: number;
  totalMatches: number;
  winRate: number;
  rank: number;
}

interface LeaderboardResponse {
  leaderboard: User[];
}

interface UserResponse {
  user: User;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchLeaderboard();
    getCurrentUser();
  }, []);

  const fetchLeaderboard = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://codebattle-backend-1.onrender.com/api/match/leaderboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data: LeaderboardResponse = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://codebattle-backend-1.onrender.com/api/match/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data: UserResponse = await response.json();
          setCurrentUser(data.user);
        } else {
          // Handle HTML error pages (like 404 pages)
          const text = await response.text();
          console.error('Expected JSON but received:', text.substring(0, 100));
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch current user';
      console.error('Failed to fetch current user:', errorMessage);
    }
  };

  const getRankIcon = (rank: number): JSX.Element => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Trophy className="w-6 h-6 text-slate-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return 'from-yellow-400/20 to-orange-500/20 border-yellow-400/50';
      case 2: return 'from-slate-300/20 to-slate-400/20 border-slate-300/50';
      case 3: return 'from-amber-500/20 to-amber-600/20 border-amber-500/50';
      default: return 'from-slate-600/20 to-slate-700/20 border-slate-600/50';
    }
  };

  const getWinRateBadge = (winRate: number): string => {
    if (winRate >= 90) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (winRate >= 80) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (winRate >= 70) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (winRate >= 60) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const generateAvatar = (username: string): string => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500'];
    const colorIndex = username.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={fetchLeaderboard}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Global Leaderboard</h1>
          </div>
          <p className="text-slate-400 text-lg">The best coders in the arena</p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{leaderboard.length} Players</span>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {leaderboard.slice(0, 3).map((user) => {
              const actualRank = user.rank;
              const isCurrentUser = currentUser && currentUser._id === user._id;
              
              return (
                <div
                  key={user._id}
                  className={`relative ${
                    actualRank === 1 ? 'md:order-2 transform md:scale-110' : 
                    actualRank === 2 ? 'md:order-1' : 'md:order-3'
                  }`}
                >
                  <div className={`bg-gradient-to-br ${getRankColor(actualRank)} backdrop-blur-sm border rounded-2xl p-6 text-center relative overflow-hidden`}>
                    {/* Glow effect for rank 1 */}
                    {actualRank === 1 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 animate-pulse"></div>
                    )}
                    
                    {/* Current user indicator */}
                    {isCurrentUser && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full border border-cyan-500/30">
                          You
                        </div>
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        {getRankIcon(actualRank)}
                      </div>
                      
                      {/* Avatar */}
                      <div className={`w-20 h-20 rounded-full ${generateAvatar(user.username)} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 border-4 ${actualRank === 1 ? 'border-yellow-400' : actualRank === 2 ? 'border-slate-300' : 'border-amber-500'}`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{user.username}</h3>
                      
                      {/* Level */}
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 font-semibold">Level {user.level}</span>
                      </div>
                      
                      {/* XP */}
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-lg">{user.xp.toLocaleString()}</span>
                        <span className="text-slate-400 text-sm">XP</span>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Wins</p>
                          <p className="text-white font-semibold">{user.wins}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Win Rate</p>
                          <p className="text-green-400 font-semibold">{user.winRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white">Complete Rankings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/50">
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Rank</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Player</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Level</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">XP</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Matches</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user) => {
                  const isCurrentUser = currentUser && currentUser._id === user._id;
                  
                  return (
                    <tr
                      key={user._id}
                      className={`border-b border-slate-800/50 hover:bg-slate-700/30 transition-all duration-200 ${
                        isCurrentUser ? 'bg-cyan-500/10 border-cyan-500/30' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {user.rank <= 3 ? (
                            getRankIcon(user.rank)
                          ) : (
                            <span className="text-slate-400 font-bold text-lg">#{user.rank}</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full ${generateAvatar(user.username)} flex items-center justify-center text-white font-bold border-2 ${isCurrentUser ? 'border-cyan-400' : 'border-slate-600'}`}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-semibold ${isCurrentUser ? 'text-cyan-400' : 'text-white'}`}>
                              {user.username}
                              {isCurrentUser && (
                                <span className="text-xs text-cyan-300 ml-2 bg-cyan-500/20 px-2 py-1 rounded-full">You</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-semibold">{user.level}</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-semibold">{user.xp.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className="text-slate-300">{user.totalMatches}</span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getWinRateBadge(user.winRate)}`}>
                          {user.winRate}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-slate-500 text-sm">
            Rankings update in real-time based on match performance
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;