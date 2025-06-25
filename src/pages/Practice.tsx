import React from 'react';
import { useNavigate } from 'react-router-dom';
import problemsData from '../data/problems.json';
import { DivideIcon as LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';

const Practice: React.FC = () => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'default';
    }
  };

  const getIconComponent = (iconName: string): LucideIcon => {
    const IconComponent = (Icons as any)[iconName.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join('')];
    return IconComponent || Icons.Code;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Practice Arena</h1>
          <p className="text-slate-400">Sharpen your coding skills with our curated problem sets</p>
        </div>

        <div className="space-y-8">
          {problemsData.categories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            
            return (
              <div key={category.id}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`bg-gradient-to-r ${category.color} p-3 rounded-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                    <p className="text-slate-400">{category.problems.length} problems available</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.problems.map((problem) => (
                    <Card
                      key={problem.id}
                      hover
                      onClick={() => navigate(`/practice/${problem.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
                          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{problem.description}</p>
                        </div>
                        <Badge
                          text={problem.difficulty}
                          variant={getDifficultyColor(problem.difficulty)}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icons.Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-slate-400">{problem.xp} XP</span>
                        </div>
                        <div className="flex items-center space-x-2 text-cyan-400 font-medium">
                          <span className="text-sm">Solve</span>
                          <Icons.ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Practice;