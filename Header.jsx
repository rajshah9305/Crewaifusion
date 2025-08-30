import React from ‘react’;
import { Zap, Github, ExternalLink } from ‘lucide-react’;

const Header = () => {
return (
<header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between h-16">
{/* Logo and Title */}
<div className="flex items-center space-x-3">
<div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
<Zap className="w-6 h-6 text-white" />
</div>
<div>
<h1 className="text-xl font-bold gradient-text">
CrewAI Fusion
</h1>
<p className="text-xs text-gray-400">
AI-Powered App Generator
</p>
</div>
</div>

```
      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-6">
        <a
          href="#how-it-works"
          className="text-gray-300 hover:text-white transition-colors duration-200"
        >
          How it Works
        </a>
        <a
          href="#agents"
          className="text-gray-300 hover:text-white transition-colors duration-200"
        >
          Agents
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>
</header>
```

);
};

export default Header;
