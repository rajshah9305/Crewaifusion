import React from ‘react’;
import { Heart, Code, Zap } from ‘lucide-react’;

const Footer = () => {
return (
<footer className="bg-gray-800/30 border-t border-gray-700/50 mt-16">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* About Section */}
<div className="space-y-4">
<div className="flex items-center space-x-2">
<Zap className="w-5 h-5 text-blue-500" />
<h3 className="font-semibold text-white">CrewAI Fusion</h3>
</div>
<p className="text-gray-400 text-sm leading-relaxed">
Revolutionizing app development with AI-powered agent collaboration.
From idea to deployment in minutes, not months.
</p>
</div>

```
      {/* Features */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Features</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            <span>6-Agent AI Pipeline</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
            <span>Full-Stack Code Generation</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <span>Production-Ready Output</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
            <span>Automated Testing & Deployment</span>
          </li>
        </ul>
      </div>

      {/* Tech Stack */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Built With</h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'Vite', 'Tailwind CSS', 'Google Gemini', 'Lucide Icons'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-700/50 mt-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 animate-pulse" />
          <span>and</span>
          <Code className="w-4 h-4 text-blue-500" />
          <span>by AI Developers</span>
        </div>
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} CrewAI Fusion. Powered by Google Gemini.
        </div>
      </div>
    </div>
  </div>
</footer>
```

);
};

export default Footer;
