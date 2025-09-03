import React, { useEffect, useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'https://esm.sh/react-syntax-highlighter';
import { vscDarkPlus } from 'https://esm.sh/react-syntax-highlighter/dist/esm/styles/prism';

/**
 * A component that displays text with a typewriter-like effect.
 * It resets the animation whenever the source text changes.
 */
const TypingEffect = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset the displayed text whenever the input text changes
    setDisplayedText('');

    if (!text) return;

    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, speed); // Use the speed prop for typing delay

    // Cleanup function to clear the interval when the component unmounts or text changes
    return () => clearInterval(intervalId);
  }, [text, speed]);

  // Use a <pre> tag to preserve whitespace and formatting
  return <pre className="whitespace-pre-wrap">{displayedText}</pre>;
};

/**
 * A component to display a live preview of an agent's output.
 * It automatically detects and formats code blocks or displays plain text with a typing effect.
 */
const LivePreview = ({ currentAgent, currentOutput }) => {
  // useMemo will re-calculate these values only when currentOutput changes.
  const { isCode, language, codeContent } = useMemo(() => {
    if (!currentOutput) {
      return { isCode: false, language: 'text', codeContent: '' };
    }
    
    // Regular expression to find a fenced code block and capture the language and content
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
    const match = currentOutput.match(codeBlockRegex);

    if (match) {
      // If a code block is found, extract language and content
      const lang = match[1] || 'javascript'; // Default to javascript if no language is specified
      const content = match[2] || '';
      return { isCode: true, language: lang, codeContent: content };
    } else if (currentOutput.includes('import ') || currentOutput.includes('def ') || currentOutput.includes('const ') || currentOutput.includes('let ')) {
       // Basic check for code outside of a block
       return { isCode: true, language: 'javascript', codeContent: currentOutput };
    }
    
    // If no code block is found, treat as plain text
    return { isCode: false, language: 'text', codeContent: currentOutput };
  }, [currentOutput]);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
      {/* Header section */}
      <div className="flex items-center mb-4">
        <Eye className="w-6 h-6 text-blue-400 mr-3 shrink-0" />
        <h2 className="text-xl font-semibold text-white">Live Preview</h2>
      </div>

      {/* Content section */}
      {currentAgent ? (
        <div>
          <p className="text-gray-400 mb-2">
            Currently working on:{' '}
            <span className="font-medium text-blue-300">
              {currentAgent.name}
            </span>
          </p>
          <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-200 max-h-80 overflow-y-auto">
            {currentOutput ? (
              isCode ? (
                <SyntaxHighlighter language={language} style={vscDarkPlus} wrapLines={true} customStyle={{ background: 'transparent', padding: 0 }}>
                  {codeContent}
                </SyntaxHighlighter>
              ) : (
                <TypingEffect text={codeContent} />
              )
            ) : (
              <p className="text-gray-500 animate-pulse">Waiting for output...</p>
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

export default LivePreview;
