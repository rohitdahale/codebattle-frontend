import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Star, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  Mail, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Camera,
  Award,
  Clock,
  Zap
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import axios from 'axios';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  wins: number;
  totalMatches: number;
  winRate: number;
  rank: string | number;
  joinDate: string;
  avatar?: string;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }>;
  recentMatches: Array<{
    id: string;
    opponent: string;
    problem: string;
    result: 'win' | 'loss' | 'draw';
    time: string;
    duration: string;
    xpGained: number;
  }>;
  achievements: {
    firstWin: boolean;
    winStreak: number;
    problemsSolved: number;
    totalXp: number;
  };
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('https://code-executor-ecdd.onrender.com/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.user) {
          const userData = response.data.user;
          setProfile({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            xp: userData.xp || 0,
            level: userData.level || 1,
            wins: userData.wins || 0,
            totalMatches: userData.totalMatches || 0,
            winRate: userData.winRate || 0,
            rank: userData.rank || 'Unranked',
            joinDate: userData.joinDate || new Date().toISOString(),
            avatar: userData.avatar,
            badges: userData.badges || [],
            recentMatches: userData.recentMatches || [],
            achievements: userData.achievements || {
              firstWin: false,
              winStreak: 0,
              problemsSolved: 0,
              totalXp: userData.xp || 0
            }
          });
          
          setEditForm({
            username: userData.username,
            email: userData.email
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://code-executor-ecdd.onrender.com/api/user/profile', editForm, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (profile) {
        setProfile({
          ...profile,
          username: editForm.username,
          email: editForm.email
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const getAvatarUrl = (username: string): string => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
  };

  const getRankColor = (rank: string | number) => {
    if (typeof rank === 'number') {
      if (rank <= 10) return 'from-yellow-400 to-yellow-600';
      if (rank <= 100) return 'from-purple-400 to-purple-600';
      return 'from-blue-400 to-blue-600';
    }
    return 'from-slate-400 to-slate-600';
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
      </div>
    );
  }

  const currentLevel = profile.level;
  const currentXp = profile.xp;
  const xpToNextLevel = currentLevel * 200;
  const previousLevelXp = (currentLevel - 1) * 200;
  const xpInCurrentLevel = currentXp - previousLevelXp;
  const xpNeededForCurrentLevel = xpToNextLevel - previousLevelXp;
  const progressPercentage = Math.max(0, Math.min(100, (xpInCurrentLevel / xpNeededForCurrentLevel) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profile.avatar || getAvatarUrl(profile.username)}
                      alt={profile.username}
                      className="w-24 h-24 rounded-full border-4 border-cyan-400"
                    />
                    <button className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 p-2 rounded-full transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  <div>
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                          className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white"
                          placeholder="Username"
                        />
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white"
                          placeholder="Email"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                          {profile.username}
                        </h1>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2 text-slate-300">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{profile.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-300">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              Joined {new Date(profile.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`bg-gradient-to-r ${getRankColor(profile.rank)} p-3 rounded-lg`}>
                      <Trophy className="w-6 h-6 text-white mx-auto mb-1" />
                      <p className="text-sm font-bold text-white">
                        {typeof profile.rank === 'number' ? `#${profile.rank}` : profile.rank}
                      </p>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button variant="primary" onClick={handleSaveProfile} icon={Save}>
                        Save
                      </Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)} icon={X}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" onClick={() => setIsEditing(true)} icon={Edit3}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Level Progress */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Level {profile.level}</h3>
                      <p className="text-sm text-slate-400">
                        {profile.xp} / {xpToNextLevel} XP
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
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{profile.wins}</p>
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
                <p className="text-2xl font-bold text-white">{profile.totalMatches}</p>
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
                <p className="text-2xl font-bold text-white">{profile.winRate}%</p>
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
                <p className="text-2xl font-bold text-white">{profile.xp}</p>
                <p className="text-sm text-slate-400">Total XP</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements & Badges */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Achievement Cards */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Achievement Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Win Streak</h3>
                    <p className="text-3xl font-bold text-red-400">{profile.achievements.winStreak}</p>
                    <p className="text-sm text-slate-400">Best streak</p>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Problems Solved</h3>
                    <p className="text-3xl font-bold text-green-400">{profile.achievements.problemsSolved}</p>
                    <p className="text-sm text-slate-400">Total completed</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Badges & Achievements</h2>
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.badges.length > 0 ? (
                    profile.badges.map((badge) => (
                      <div key={badge.id} className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-lg">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{badge.name}</p>
                          <p className="text-sm text-slate-400">{badge.description}</p>
                          <p className="text-xs text-slate-500">
                            Earned {new Date(badge.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">No badges yet</p>
                      <p className="text-sm text-slate-500">Complete matches and challenges to earn badges!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Recent Matches</h2>
            <Card>
              <div className="space-y-3">
                {profile.recentMatches.length > 0 ? (
                  profile.recentMatches.map((match) => (
                    <div key={match.id} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-white">vs {match.opponent}</p>
                        <Badge
                          text={match.result}
                          variant={match.result === 'win' ? 'success' : match.result === 'loss' ? 'danger' : 'warning'}
                          size="sm"
                        />
                      </div>
                      <p className="text-sm text-slate-400 mb-1">{match.problem}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{match.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-3 h-3" />
                          <span>+{match.xpGained} XP</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{match.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No recent matches</p>
                    <p className="text-sm text-slate-500">Start battling to see your match history!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;