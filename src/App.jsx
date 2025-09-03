import React, { useState, useCallback } from 'react';
import {
  Lightbulb,
  FileText,
  Code as CodeIcon,
  Search,
  Rocket,
  TestTube,
  Play,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import AgentCard from './components/AgentCard';
import OutputModal from './components/OutputModal';
import SettingsModal from './components/SettingsModal';
import { SettingsProvider } from './context/SettingsContext';
import { callGeminiAPI, AGENT_PROMPTS } from './api/gemini';

const AGENTS = [
  {
    id: 'idea-generation',
    name: 'Idea Generator',
    role: 'Creative Strategist',
    description:
      'Generates innovative full-stack application ideas that solve real-world problems with clear business value.',
    icon: Lightbulb,
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'app-requirements',
    name: 'Requirements Analyst',
    role: 'Product Manager',
    description:
      'Creates comprehensive requirements documents with user stories, functional specs, and technical recommendations.',
    icon: FileText,
    bgColor: 'bg-blue-500'
  },
  {
    id: 'code-generation',
    name: 'Code Generator',
    role: 'Full-Stack Developer',
    description:
      'Generates production-ready boilerplate code for both frontend React components and backend Express servers.',
    icon: CodeIcon,
    bgColor: 'bg-green-500'
  },
  {
    id: 'code-review',
    name: 'Code Reviewer',
    role: 'Senior Engineer',
    description:
      'Analyzes generated code for security vulnerabilities, performance issues, and suggests best practice improvements.',
    icon: Search,
    bgColor: 'bg-purple-500'
  },
  {
    id: 'deployment',
    name: 'DevOps Engineer',
    role: 'Infrastructure Specialist',
    description:
      'Creates detailed deployment strategies for modern cloud platforms with CI/CD pipelines and monitoring.',
    icon: Rocket,
    bgColor: 'bg-orange-500'
  },
  {
    id: 'testing',
    name: 'QA Engineer',
    role: 'Quality Assurance',
    description:
      'Develops comprehensive testing strategies including unit tests, integration tests, and E2E test scenarios.',
    icon: TestTube,
    bgColor: 'bg-pink-500'
  }
];

function App() {
  const [pipelineStatus, setPipelineStatus] = useState('idle');
  const [agentStatuses, setAgentStatuses] = useState(
    AGENTS.reduce((acc, agent) => {
      acc[agent.id] = 'idle';
      return acc;
    }, {})
  );
  const [agentOutputs, setAgentOutputs] = useState({});
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [initialIdea, setInitialIdea] = useState('');
  const [ideaHistory, setIdeaHistory] = useState([]);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAgent, setModalAgent] = useState(null);
  const [modalOutput, setModalOutput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const resetPipeline = useCallback(() => {
    setPipelineStatus("idle");
    setAgentStatuses(
      AGENTS.reduce((acc, agent) => {
        acc[agent.id] = "idle";
        return acc;
      }, {})
    );
    setAgentOutputs({});
    setCurrentAgentIndex(-1);
    setIdeaHistory([]);
    setError(null);
    setModalOpen(false);
  }, []);

  const updateAgentStatus = useCallback((agentId, status) => {
    setAgentStatuses((prev) => ({
      ...prev,
      [agentId]: status,
    }));
  }, []);

  const updateAgentOutput = useCallback((agentId, output) => {
    setAgentOutputs((prev) => ({
      ...prev,
      [agentId]: output,
    }));
  }, []);

  const executeAgent = useCallback(
    async (agent, index, context = {}) => {
      try {
        setCurrentAgentIndex(index);
        updateAgentStatus(agent.id, "working");

        let prompt = "";

        switch (agent.id) {
          case "idea-generation":
            prompt = initialIdea ? `Title: ${initialIdea}\nDescription: ${initialIdea}` : AGENT_PROMPTS.ideaGeneration(ideaHistory);
            break;
          case 'app-requirements':
            prompt = AGENT_PROMPTS.appRequirements(context.idea || '');
            break;
          case 'code-generation':
            prompt = AGENT_PROMPTS.codeGeneration(
              context.idea || '',
              context.requirements || ''
            );
            break;
          case 'code-review':
            prompt = AGENT_PROMPTS.codeReview(context.code || '');
            break;
          case 'deployment':
            prompt = AGENT_PROMPTS.deployment(context.idea || '');
            break;
          case 'testing':
            prompt = AGENT_PROMPTS.testing(context.idea || '', context.code || '');
            break;
          default:
            throw new Error(`Unknown agent: ${agent.id}`);
        }

        const output = await callGeminiAPI(prompt);

        updateAgentOutput(agent.id, output);
        updateAgentStatus(agent.id, 'completed');

        return output;
      } catch (err) {
        console.error(`Agent ${agent.id} failed:`, err);
        updateAgentStatus(agent.id, 'error');
        throw err;
      }
    },
    [updateAgentStatus, updateAgentOutput]
  );

  const executePipeline = useCallback(async () => {
    try {
      setPipelineStatus('running');
      setError(null);

      let context = {};

      const total = AGENTS.length;
      for (let i = 0; i < AGENTS.length; i++) {
        const agent = AGENTS[i];
        const output = await executeAgent(agent, i, context);

        switch (agent.id) {
          case 'idea-generation':
            context.idea = output;
            setIdeaHistory((prev) => [...prev, output.split("\n")[0].replace("Title: ", "")]);
            break;
          case 'app-requirements':
            context.requirements = output;
            break;
          case 'code-generation':
            context.code = output;
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setPipelineStatus('completed');
      setCurrentAgentIndex(-1);
    } catch (err) {
      console.error('Pipeline execution failed:', err);
      setError(err.message);
      setPipelineStatus('error');
      setCurrentAgentIndex(-1);
    }
  }, [executeAgent]);

  const handleViewOutput = useCallback((agent, output) => {
    setModalAgent(agent);
    setModalOutput(output);
    setModalOpen(true);
  }, []);

  const isApiKeyConfigured =
    import.meta.env.VITE_GEMINI_API_KEY &&
    import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here';

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">CrewAI Fusion</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into production-ready applications using our advanced AI agent pipeline. From concept to deployment in minutes.
          </p>

          {!isApiKeyConfigured && (
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-yellow-300">API Key Required</p>
                  <p className="text-sm text-yellow-400">
                    Please set your Google Gemini API key in the .env file to use this application. Get your free API key at{' '}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-yellow-300"
                    >
                      Google MakerSuite
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Enter your app idea (optional)"
              value={initialIdea}
              onChange={(e) => setInitialIdea(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={executePipeline}
              disabled={!isApiKeyConfigured || pipelineStatus === 'running'}
              className={`
                flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200
                ${!isApiKeyConfigured || pipelineStatus === 'running'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'}
              `}
            >
              <Play className="w-6 h-6" />
              <span>{pipelineStatus === 'running' ? 'Agents are Working...' : 'Generate New App'}</span>
            </button>

            {(pipelineStatus === 'completed' || pipelineStatus === 'error') && (
              <button
                onClick={resetPipeline}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset Pipeline</span>
              </button>
            )}
          </div>

          {pipelineStatus !== 'idle' && (
            <div className="mt-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
                <div
                  className={`w-2 h-2 rounded-full ${
                    pipelineStatus === 'running'
                      ? 'bg-blue-400 animate-pulse'
                      : pipelineStatus === 'completed'
                      ? 'bg-green-400'
                      : pipelineStatus === 'error'
                      ? 'bg-red-400'
                      : 'bg-gray-400'
                  }`}
                />
                <span className="text-sm font-medium">
                  Pipeline Status: <span className="capitalize">{pipelineStatus}</span>
                  {currentAgentIndex >= 0 && pipelineStatus === 'running' && (
                    <span className="text-gray-400"> - Step {currentAgentIndex + 1} of {AGENTS.length}</span>
                  )}
                </span>
              </div>
              {pipelineStatus !== 'idle' && (
                <div className="mt-3 h-2 w-full max-w-xl mx-auto bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${currentAgentIndex < 0 ? 0 : Math.round(((currentAgentIndex + (pipelineStatus === 'completed' ? 1 : 0)) / AGENTS.length) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-900/20 border border-red-700/50 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-red-300">Pipeline Error</p>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <section id="agents" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI Agent <span className="gradient-text">Pipeline</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Six specialized AI agents working together in perfect harmony to bring your ideas to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {AGENTS.map((agent, index) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                status={agentStatuses[agent.id]}
                output={agentOutputs[agent.id]}
                isActive={currentAgentIndex === index}
                onViewOutput={handleViewOutput}
                index={index}
                totalAgents={AGENTS.length}
              />
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our AI agents collaborate in sequence, each building upon the previous agent's output
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Idea Generation',
                description:
                  'AI analyzes market trends and generates innovative app ideas with real business potential.',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                step: '2',
                title: 'Requirements Analysis',
                description:
                  'Converts ideas into detailed specifications with user stories and technical requirements.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '3',
                title: 'Code Generation',
                description:
                  'Creates production-ready React frontend and Express backend code architecture.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                step: '4',
                title: 'Code Review',
                description:
                  'Analyzes code for security, performance, and best practices with improvement suggestions.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '5',
                title: 'Deployment Strategy',
                description:
                  'Plans cloud deployment with CI/CD pipelines, monitoring, and scalability considerations.',
                color: 'from-orange-500 to-red-500'
              },
              {
                step: '6',
                title: 'Testing Plan',
                description:
                  'Develops comprehensive testing strategies with unit, integration, and E2E test examples.',
                color: 'from-pink-500 to-rose-500'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

        <Footer />

        <OutputModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          agent={modalAgent}
          output={modalOutput}
        />
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </SettingsProvider>
  );
}

export default App;
