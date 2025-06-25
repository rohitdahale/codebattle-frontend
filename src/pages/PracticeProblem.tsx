import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import problemsData from '../data/problems.json';
import { ArrowLeft, Play, CheckCircle, XCircle } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import Button from '../components/Button';
import Badge from '../components/Badge';

const PracticeProblem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  // Find the problem across all categories
  const problem = problemsData.categories
    .flatMap(category => category.problems)
    .find(p => p.id === id);

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Problem Not Found</h1>
          <Button onClick={() => navigate('/practice')}>Back to Practice</Button>
        </div>
      </div>
    );
  }

  React.useEffect(() => {
    setCode(problem.starterCode);
  }, [problem.starterCode]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'default';
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate code execution
    setTimeout(() => {
      setResult(Math.random() > 0.3 ? 'success' : 'error');
      setIsSubmitting(false);
    }, 2000);
  };

  const handleReset = () => {
    setCode(problem.starterCode);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/practice')}
              icon={ArrowLeft}
            >
              Back to Practice
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <Badge
                  text={problem.difficulty}
                  variant={getDifficultyColor(problem.difficulty)}
                />
                <span className="text-sm text-slate-400">{problem.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Problem Description</h2>
              <p className="text-slate-300 leading-relaxed mb-6">{problem.description}</p>

              <h3 className="text-lg font-semibold text-white mb-4">Examples</h3>
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-slate-400">Input:</span>
                        <code className="block bg-slate-800/50 p-2 rounded mt-1 text-green-400 font-mono text-sm">
                          {example.input}
                        </code>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-400">Output:</span>
                        <code className="block bg-slate-800/50 p-2 rounded mt-1 text-cyan-400 font-mono text-sm">
                          {example.output}
                        </code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-sm font-medium text-slate-400">Explanation:</span>
                          <p className="text-sm text-slate-300 mt-1">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Your Solution</h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    icon={isSubmitting ? undefined : Play}
                  >
                    {isSubmitting ? 'Running...' : 'Run Code'}
                  </Button>
                </div>
              </div>

              <CodeEditor
                value={code}
                onChange={setCode}
                height="400px"
              />

              {result && (
                <div className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
                  result === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  {result === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-green-400 font-medium">Success!</p>
                        <p className="text-sm text-green-300">All test cases passed. You earned {problem.xp} XP!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-red-400 font-medium">Test Failed</p>
                        <p className="text-sm text-red-300">Some test cases failed. Keep trying!</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeProblem;