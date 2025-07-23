import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, Trophy, Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import axios from 'axios';

interface Match {
  id: string;
  opponent: string;
  problem: string;
  result: 'win' | 'loss' | 'draw';
  time: string;
  date: string;
  duration: number;
  xpGained: number;
  difficulty: string;
  language: string;
}

const MatchHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const matchesPerPage = 10;

  useEffect(() => {
    fetchMatchHistory();
  }, [currentPage, filterResult, filterDifficulty, searchTerm]);

  const fetchMatchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/match/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: currentPage,
          limit: matchesPerPage,
          search: searchTerm,
          result: filterResult !== 'all' ? filterResult : undefined,
          difficulty: filterDifficulty !== 'all' ? filterDifficulty : undefined
        }
      });

      if (response.data.success) {
        setMatches(response.data.matches || []);
        setTotalPages(Math.ceil((response.data.total || 0) / matchesPerPage));
      }
    } catch (error) {
      console.error('Error fetching match history:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMatchHistory();
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'text-green-400';
      case 'loss': return 'text-red-400';
      case 'draw': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Match History</h1>
            <p className="text-slate-400">View all your coding battles and performance</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by opponent or problem..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </form>
            </div>

            {/* Filters */}
            <div className="flex space-x-4">
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Results</option>
                <option value="win">Wins</option>
                <option value="loss">Losses</option>
                <option value="draw">Draws</option>
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Match History Table */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-lg">Loading match history...</div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No matches found</h3>
              <p className="text-slate-400 mb-4">
                {searchTerm || filterResult !== 'all' || filterDifficulty !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start your first coding battle to see your match history!'}
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/match-finder')}
              >
                Find Match
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Match</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Opponent</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Problem</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Result</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Difficulty</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Duration</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">XP</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((match, index) => (
                        <tr key={match.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
                                <Target className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white font-medium">#{(currentPage - 1) * matchesPerPage + index + 1}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-white font-medium">{match.opponent}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-slate-300">{match.problem}</span>
                            <br />
                            <span className="text-xs text-slate-400">{match.language}</span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              text={match.result.toUpperCase()}
                              variant={match.result === 'win' ? 'success' : match.result === 'loss' ? 'danger' : 'warning'}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-medium ${getDifficultyColor(match.difficulty)}`}>
                              {match.difficulty}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1 text-slate-300">
                              <Clock className="w-4 h-4" />
                              <span>{Math.floor(match.duration / 60)}m {match.duration % 60}s</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-medium ${match.xpGained > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {match.xpGained > 0 ? '+' : ''}{match.xpGained}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-slate-400 text-sm">{match.date}</span>
                            <br />
                            <span className="text-slate-500 text-xs">{match.time}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {matches.map((match, index) => (
                  <div key={match.id} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">Match #{(currentPage - 1) * matchesPerPage + index + 1}</span>
                      </div>
                      <Badge
                        text={match.result.toUpperCase()}
                        variant={match.result === 'win' ? 'success' : match.result === 'loss' ? 'danger' : 'warning'}
                        size="sm"
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Opponent:</span>
                        <span className="text-white font-medium">{match.opponent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Problem:</span>
                        <span className="text-slate-300">{match.problem}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Difficulty:</span>
                        <span className={getDifficultyColor(match.difficulty)}>{match.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-slate-300">{Math.floor(match.duration / 60)}m {match.duration % 60}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">XP:</span>
                        <span className={match.xpGained > 0 ? 'text-green-400' : 'text-red-400'}>
                          {match.xpGained > 0 ? '+' : ''}{match.xpGained}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date:</span>
                        <span className="text-slate-300">{match.date} {match.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
                  <div className="text-sm text-slate-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MatchHistory;