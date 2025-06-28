import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Github, Twitter, Mail, Heart, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CodeBattle
              </span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              The ultimate platform for competitive programming battles. Challenge developers worldwide, 
              improve your coding skills, and climb the leaderboards.
            </p>
            <div className="flex items-center space-x-1 text-slate-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by developers, for developers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/practice')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Practice
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/match-history')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Match History
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-slate-400">Real-time Battles</span>
              </li>
              <li>
                <span className="text-slate-400">Multiple Languages</span>
              </li>
              <li>
                <span className="text-slate-400">Custom Rooms</span>
              </li>
              <li>
                <span className="text-slate-400">Global Rankings</span>
              </li>
              <li>
                <span className="text-slate-400">Practice Mode</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © {currentYear} CodeBattle. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@codebattle.com"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-400">10K+</div>
              <div className="text-sm text-slate-400">Active Users</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">50K+</div>
              <div className="text-sm text-slate-400">Battles Fought</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">100+</div>
              <div className="text-sm text-slate-400">Problems</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-slate-400">Uptime</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Ready to code? Start your first battle!</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;