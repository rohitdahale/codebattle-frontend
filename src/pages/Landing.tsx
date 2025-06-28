import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Zap, Trophy, Users, Star, ArrowRight, Play, Target, Brain, Rocket, Clock, Globe, Gamepad2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-xl focus:ring-cyan-500',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 focus:ring-slate-500'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon className="ml-2 w-4 h-4" />}
    </button>
  );
};

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const Landing = () => {
  const features = [
    {
      icon: Zap,
      title: 'Quick Match',
      description: 'Jump into instant battles with developers worldwide. Get matched by skill level for fair competition.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Users,
      title: 'Private Rooms',
      description: 'Create custom rooms with friends or colleagues. Set your own rules and practice together.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Public Lobbies',
      description: 'Join open rooms and meet new coding enthusiasts. Share strategies and learn from others.',
      color: 'from-green-400 to-teal-500'
    },
    {
      icon: Trophy,
      title: 'Global Leaderboards',
      description: 'Compete for the top spots across different categories. Track your progress and achievements.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'Practice Mode',
      description: 'Sharpen your skills with curated challenges. Learn algorithms and data structures at your pace.',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Gamepad2,
      title: 'Real-time Battles',
      description: 'Experience live coding duels with instant feedback. See your opponent\'s progress in real-time.',
      color: 'from-red-400 to-pink-500'
    }
  ];

  const stats = [
    { number: '200+', label: 'Coding Challenges', icon: Target },
    { number: '15+', label: 'Languages Supported', icon: Code },
    { number: '24/7', label: 'Platform Uptime', icon: Clock },
    { number: 'Beta', label: 'Join Early Access', icon: Star }
  ];

  const gameFeatures = [
    {
      title: 'Multiple Game Modes',
      items: ['Quick Match - Find opponents instantly', 'Private Rooms - Battle with friends', 'Public Lobbies - Join ongoing battles', 'Practice Mode - Solo skill building']
    },
    {
      title: 'Competitive Features',
      items: ['Real-time coding battles', 'Global leaderboards', 'Skill-based matchmaking', 'Achievement system']
    },
    {
      title: 'Learning Platform',
      items: ['Algorithm challenges', 'Data structure problems', 'Multiple programming languages', 'Detailed performance analytics']
    }
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
                  Join CodeBattle
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
              <span className="text-cyan-300 text-sm font-medium">Beta Launch - Be Among the First!</span>
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
              The ultimate multiplayer coding arena where developers clash in real-time battles. 
              Quick match globally, create private rooms, join public lobbies, and climb the leaderboards.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/signup">
                <Button variant="primary" size="lg" icon={Play} className="text-lg px-8 py-4">
                  Join Beta Now
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
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">Platform Ready</h3>
            <p className="text-slate-300">Built with cutting-edge technology for the ultimate coding experience</p>
          </div>
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

      {/* Game Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">CodeBattle</span> Works
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Multiple ways to challenge yourself and compete with developers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {gameFeatures.map((section, index) => (
              <Card key={index} className="text-center">
                <h3 className="text-xl font-bold text-white mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-slate-300 flex items-start">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Game Features
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need for competitive programming and skill development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join our beta program and be among the first to experience the future of competitive programming.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup">
              <Button variant="primary" size="lg" icon={ArrowRight} className="text-lg px-8 py-4">
                Join Beta Access
              </Button>
            </Link>
            <div className="text-slate-400 text-sm">
              ⚡ Instant access • 🚀 No waiting list
            </div>
          </div>
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
            <div className="text-slate-400 text-center md:text-right">
              <div>© 2024 CodeBattle. The future of competitive programming.</div>
              <div className="text-sm text-slate-500 mt-1">Currently in Beta - Join the revolution!</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;