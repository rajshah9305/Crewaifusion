import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import {
  Lightbulb,
  FileText,
  Code as CodeIcon,
  Search,
  Rocket,
  TestTube,
  Play,
  RotateCcw,
  AlertTriangle,
  Eye,
  X,
  Settings,
  Clipboard,
  Check
} from 'lucide-react';

// --- START: API MOCK ---
// In a real application, this would be in 'src/api/gemini.js'
const AGENT_PROMPTS = {
  ideaGeneration: (history) => `Generate a new, innovative full-stack application idea. Avoid these previous ideas: ${history.join(', ')}`,
  appRequirements: (idea) => `Create a requirements document for the following app idea: ${idea}`,
  codeGeneration: (idea, requirements) => `Generate boilerplate code for the following app idea: ${idea}. Requirements: ${requirements}`,
  codeReview: (code) => `Review the following code for improvements: ${code}`,
  deployment: (idea) => `Create a deployment strategy for the following app idea: ${idea}`,
  testing: (idea, code) => `Create a testing plan for the following app idea: ${idea}. Code: ${code}`
};

// This is a MOCK function to simulate a streaming API call to Gemini
// It returns an async generator that yields parts of a string over time.
async function* callGeminiAPI(prompt, isStream = false) {
  console.log("Calling Mock Gemini API with prompt:", prompt);
  const mockResponse = `This is a simulated streaming response for the prompt:\n"${prompt.substring(0, 100)}..."\n\n- Step 1: Analyzing request.\n- Step 2: Generating content.\n- Step 3: Finalizing output.\n\n\`\`\`javascript\n// Sample generated code\nfunction helloWorld() {\n  console.log("Hello, CrewAI Fusion!");\n}\nhelloWorld();\n\`\`\`\n\nProcess complete. This mock response simulates the real-time generation of text and code from the AI agent. Each word is yielded individually to create a typing effect in the live preview.`;

  const words = mockResponse.split(' ');
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    yield word + ' ';
  }
}
// --- END: API MOCK ---


// --- START: CONTEXT ---
// In a real application, this would be in 'src/context/SettingsContext.js'
const SettingsContext = createContext();
const SettingsProvider = ({ children }) => {
  // Add any settings state here, e.g., theme, API key
  const value = {};
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
// --- END: CONTEXT ---


// --- START: COMPONENTS ---
// In a real application, these would be in their own files under 'src/components/'

const Header = ({ onOpenSettings }) => (
  <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <Rocket className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold gradient-text">CrewAI Fusion</span>
        </div>
        <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Settings className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} CrewAI Fusion. All rights reserved.</p>
      <p className="mt-2 text-sm">An AI-powered application generation pipeline.</p>
    </div>
  </footer>
);

const TypingEffect = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    if (!text) return;
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length -1) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        setDisplayedText(text);
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 15);

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <pre className="whitespace-pre-wrap break-words">{displayedText}</pre>;
};

const LivePreview = ({ currentAgent, currentOutput }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
      <div className="flex items-center mb-4">
        <Eye className="w-6 h-6 text-blue-400 mr-3" />
        <h2 className="text-xl font-semibold text-white">Live Preview</h2>
      </div>
      {currentAgent ? (
        <div>
          <p className="text-gray-400 mb-2">
            Currently working on:{' '}
            <span className="font-medium text-blue-300">
              {currentAgent.name}
            </span>
          </p>
          <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-200 max-h-60 overflow-y-auto">
            {currentOutput ? (
              <TypingEffect text={currentOutput} />
            ) : (
              <p className="text-gray-500">Waiting for output...</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          Pipeline not running or no agent active.
        </p>
      )}
    </div>
  );
};


const AgentCard = ({ agent, status, output, isActive, onViewOutput, index }) => {
  const Icon = agent.icon;
  const statusClasses = {
    idle: 'border-gray-700',
    working: 'border-blue-500 ring-2 ring-blue-500/50 animate-pulse',
    completed: 'border-green-500',
    error: 'border-red-500',
  };

  return (
    <div className={`bg-gray-800/50 rounded-2xl p-6 border transition-all duration-300 ${statusClasses[status]} ${isActive ? 'transform scale-105 shadow-2xl shadow-blue-500/20' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${agent.bgColor}`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${
            status === 'completed' ? 'bg-green-500/20 text-green-300' :
            status === 'working' ? 'bg-blue-500/20 text-blue-300' :
            status === 'error' ? 'bg-red-500/20 text-red-300' :
            'bg-gray-700/50 text-gray-400'
          }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
      <p className="text-gray-400 text-sm mb-4 h-16">{agent.description}</p>
      <button
        onClick={() => onViewOutput(agent, output)}
        disabled={!output}
        className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500 bg-blue-600/50 text-blue-200 hover:bg-blue-600/80 hover:text-white"
      >
        View Output
      </button>
    </div>
  );
};

const OutputModal = ({ isOpen, onClose, agent, output }) => {
    const [hasCopied, setHasCopied] = useState(false);
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(output).then(() => {
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">{agent?.name} Output</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleCopy} className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                            {hasCopied ? <Check className="w-5 h-5 text-green-400"/> : <Clipboard className="w-5 h-5"/>}
                        </button>
                        <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-700">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto">
                    <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-200">
                        <code className="whitespace-pre-wrap break-words">
                            {output || "No output generated yet."}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-700">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-300">Settings panel is under construction.</p>
                    {/* Add settings controls here */}
                </div>
            </div>
        </div>
    );
};
// --- END: COMPONENTS ---


const AGENTS = [
    { id: 'idea-generation', name: 'Idea Generator', description: 'Generates innovative full-stack application ideas with clear business value.', icon: Lightbulb, bgColor: 'bg-yellow-500' },
    { id: 'app-requirements', name: 'Requirements Analyst', description: 'Creates comprehensive requirements documents with user stories and specs.', icon: FileText, bgColor: 'bg-blue-500' },
    { id: 'code-generation', name: 'Code Generator', description: 'Generates boilerplate code for frontend React and backend Express servers.', icon: CodeIcon, bgColor: 'bg-green-500' },
    { id: 'code-review', name: 'Code Reviewer', description: 'Analyzes generated code for security, performance, and best practices.', icon: Search, bgColor: 'bg-purple-500' },
    { id: 'deployment', name: 'DevOps Engineer', description: 'Creates detailed deployment strategies for modern cloud platforms.', icon: Rocket, bgColor: 'bg-orange-500' },
    { id: 'testing', name: 'QA Engineer', description: 'Develops comprehensive testing strategies including unit and E2E tests.', icon: TestTube, bgColor: 'bg-pink-500' }
];

// IMPORTANT: Replace this with your actual API key, preferably from environment variables
const GEMINI_API_KEY = 'your_gemini_api_key_here';


function App() {
  const [pipelineStatus, setPipelineStatus] = useState('idle');
  const [agentStatuses, setAgentStatuses] = useState(
    AGENTS.reduce((acc, agent) => ({ ...acc, [agent.id]: 'idle' }), {})
  );
  const [agentOutputs, setAgentOutputs] = useState({});
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [initialIdea, setInitialIdea] = useState('');
  const [ideaHistory, setIdeaHistory] = useState([]);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAgent, setModalAgent] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [livePreviewOutput, setLivePreviewOutput] = useState('');

  const resetPipeline = useCallback(() => {
    setPipelineStatus('idle');
    setAgentStatuses(AGENTS.reduce((acc, agent) => ({ ...acc, [agent.id]: 'idle' }), {}));
    setAgentOutputs({});
    setCurrentAgentIndex(-1);
    setIdeaHistory([]);
    setError(null);
    setModalOpen(false);
    setLivePreviewOutput('');
  }, []);

  const updateAgentStatus = useCallback((agentId, status) => {
    setAgentStatuses((prev) => ({ ...prev, [agentId]: status }));
  }, []);

  const updateAgentOutput = useCallback((agentId, output) => {
    setAgentOutputs((prev) => ({ ...prev, [agentId]: output }));
  }, []);

  const executeAgent = useCallback(
    async (agent, index, context = {}) => {
      try {
        setCurrentAgentIndex(index);
        updateAgentStatus(agent.id, 'working');
        setLivePreviewOutput('');

        let prompt = '';
        switch (agent.id) {
          case 'idea-generation':
            prompt = initialIdea ? `Title: ${initialIdea}` : AGENT_PROMPTS.ideaGeneration(ideaHistory);
            break;
          case 'app-requirements':
            prompt = AGENT_PROMPTS.appRequirements(context.idea || '');
            break;
          case 'code-generation':
            prompt = AGENT_PROMPTS.codeGeneration(context.idea || '', context.requirements || '');
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

        const stream = callGeminiAPI(prompt, true);
        let output = '';
        for await (const chunk of stream) {
          output += chunk;
          setLivePreviewOutput(output);
        }

        updateAgentOutput(agent.id, output);
        updateAgentStatus(agent.id, 'completed');
        return output;
      } catch (err) {
        console.error(`Agent ${agent.id} failed:`, err);
        updateAgentStatus(agent.id, 'error');
        throw err;
      }
    },
    [updateAgentStatus, updateAgentOutput, initialIdea, ideaHistory]
  );

  const executePipeline = useCallback(async () => {
    try {
      setPipelineStatus('running');
      setError(null);
      let context = {};

      const ideaOutput = await executeAgent(AGENTS[0], 0, context);
      context.idea = ideaOutput;
      setIdeaHistory((prev) => [...prev, ideaOutput.split('\n')[0].replace('Title: ', '')]);
      
      const [requirementsOutput, codeOutput] = await Promise.all([
        executeAgent(AGENTS[1], 1, context),
        executeAgent(AGENTS[2], 2, context)
      ]);
      context.requirements = requirementsOutput;
      context.code = codeOutput;

      await Promise.all([
        executeAgent(AGENTS[3], 3, context),
        executeAgent(AGENTS[4], 4, context),
        executeAgent(AGENTS[5], 5, context)
      ]);

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
    setModalOpen(true);
  }, []);

  const isApiKeyConfigured = GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Header onOpenSettings={() => setSettingsOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">CrewAI Fusion</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into production-ready applications using our advanced AI agent pipeline.
            </p>

            {!isApiKeyConfigured && (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-yellow-300">API Key Required</p>
                    <p className="text-sm text-yellow-400">
                      Please set your Google Gemini API key in the code to use this application.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {pipelineStatus !== 'idle' && (
              <LivePreview
                currentAgent={currentAgentIndex >= 0 ? AGENTS[currentAgentIndex] : null}
                currentOutput={livePreviewOutput}
              />
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
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
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
            
            {error && (
              <div className="mt-6 bg-red-900/20 border border-red-700/50 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="font-medium text-red-300">Pipeline Error: <span className="text-sm text-red-400">{error}</span></p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AGENTS.map((agent, index) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                status={agentStatuses[agent.id]}
                output={agentOutputs[agent.id]}
                isActive={currentAgentIndex === index && pipelineStatus === 'running'}
                onViewOutput={handleViewOutput}
              />
            ))}
          </div>
        </main>

        <Footer />

        <OutputModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          agent={modalAgent}
          output={agentOutputs[modalAgent?.id]}
        />
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </SettingsProvider>
  );
}

export default App;
