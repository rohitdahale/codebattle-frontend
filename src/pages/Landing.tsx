import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Zap, Trophy, Users, Star, ArrowRight, Play, Target, Brain, Rocket } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Real-time Battles',
      description: 'Compete against developers worldwide in live coding challenges with instant feedback.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Brain,
      title: 'Smart Practice',
      description: 'Level up your skills with curated problems across algorithms, data structures, and more.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Trophy,
      title: 'Global Rankings',
      description: 'Climb the leaderboard and earn achievements as you master new coding concepts.',
      color: 'from-green-400 to-teal-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of developers improving their skills through friendly competition.',
      color: 'from-blue-400 to-cyan-500'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Coders', icon: Users },
    { number: '1M+', label: 'Battles Fought', icon: Zap },
    { number: '500+', label: 'Challenges', icon: Target },
    { number: '99%', label: 'Satisfaction', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CodeBattle
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-8">
              <Rocket className="w-4 h-4 text-cyan-400 mr-2" />
              <span className="text-cyan-300 text-sm font-medium">Join the Ultimate Coding Arena</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Code.
              </span>
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Battle.
              </span>
              <span className="bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Conquer.
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Enter the ultimate arena where developers clash in real-time coding battles. 
              Sharpen your skills, climb the ranks, and prove you're the coding champion.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/signup">
                <Button variant="primary" size="lg" icon={Play} className="text-lg px-8 py-4">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/practice">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                  Try Practice Mode
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Code Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-lg rotate-12">
            <Code className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg -rotate-12">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">CodeBattle</span>?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the most engaging way to improve your coding skills through competitive programming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Prove Your Skills?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers who are already battling their way to the top.
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg" icon={ArrowRight} className="text-lg px-8 py-4">
              Begin Your Coding Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800/80 border-t border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CodeBattle
              </span>
            </div>
            <div className="text-slate-400">
              © 2024 CodeBattle. Elevating developers worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;