# CrewAI Fusion - AI-Powered Full-Stack App Generator

![CrewAI Fusion](https://img.shields.io/badge/CrewAI-Fusion-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-06B6D4?style=flat-square&logo=tailwindcss)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=flat-square&logo=google)

Transform your ideas into production-ready applications using our advanced AI agent pipeline. CrewAI Fusion leverages six specialized AI agents working in sequence to generate complete full-stack applications from simple concepts.

## 🚀 Features

- **6-Agent AI Pipeline**: Specialized agents for each development phase
- **Real-time Visual Workflow**: Watch agents work with live status updates
- **Production-Ready Output**: Complete code, deployment strategies, and testing plans
- **Modern Tech Stack**: React, Vite, Tailwind CSS, and Google Gemini AI
- **Interactive UI**: Responsive design with smooth animations and modal outputs
- **Error Handling**: Robust retry mechanisms and comprehensive error management

## 🤖 AI Agent Pipeline

### 1. **Idea Generator** 🔅

- **Role**: Creative Strategist
- **Function**: Generates innovative full-stack application ideas that solve real-world problems
- **Output**: Detailed app concept with market viability

### 2. **Requirements Analyst** 📋

- **Role**: Product Manager
- **Function**: Creates comprehensive requirements documents with user stories and technical specs
- **Output**: Structured requirements with functional and non-functional specifications

### 3. **Code Generator** 💻

- **Role**: Full-Stack Developer
- **Function**: Generates production-ready React frontend and Express backend code
- **Output**: Complete boilerplate code with modern best practices

### 4. **Code Reviewer** 🔍

- **Role**: Senior Engineer
- **Function**: Analyzes code for security, performance, and quality improvements
- **Output**: Detailed code review with actionable recommendations

### 5. **DevOps Engineer** 🚀

- **Role**: Infrastructure Specialist
- **Function**: Creates deployment strategies for modern cloud platforms
- **Output**: Complete deployment guide with CI/CD pipelines

### 6. **QA Engineer** 🧪

- **Role**: Quality Assurance
- **Function**: Develops comprehensive testing strategies and test cases
- **Output**: Full testing plan with unit, integration, and E2E tests

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Quick Start

1. **Clone the repository**
   
   ```bash
   git clone <repository-url>
   cd crewai-fusion-app
   ```
1. **Install dependencies**
   
   ```bash
   npm install
   ```
1. **Configure environment variables**
   
   ```bash
   # Copy the environment template
   cp .env .env.local
   
   # Edit .env.local and add your API key
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
1. **Start the development server**
   
   ```bash
   npm run dev
   ```
1. **Open your browser**
   Navigate to `http://localhost:3000` and start generating apps!

## 📁 Project Structure

```
crewai-fusion-app/
├── public/
│   └── index.html              # HTML shell
├── src/
│   ├── api/
│   │   └── gemini.js          # Gemini API integration
│   ├── components/
│   │   ├── AgentCard.jsx      # Individual agent display
│   │   ├── Header.jsx         # Application header
│   │   ├── OutputModal.jsx    # Output viewing modal
│   │   └── Footer.jsx         # Application footer
│   ├── styles/
│   │   └── index.css          # Global styles and Tailwind
│   ├── App.jsx                # Main application component
│   └── index.jsx              # Entry point
├── .env                       # Environment variables template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── vite.config.js             # Vite configuration
```

## 🎯 Usage Guide

### Basic Usage

1. **Start the Pipeline**: Click “Generate New App” to begin the AI agent workflow
1. **Watch Progress**: Monitor real-time status updates as each agent completes their task
1. **View Outputs**: Click “View Full Output” on completed agents to see detailed results
1. **Reset & Retry**: Use “Reset Pipeline” to start over with a new idea

### Advanced Features

- **Output Modal**: Interactive modal with syntax highlighting and copy/download functionality
- **Error Recovery**: Automatic retry with exponential backoff for API failures
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Efficient state management and minimal re-renders

## 🔧 Configuration

### Environment Variables

```bash
# Required: Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Tailwind CSS Customization

Modify `tailwind.config.js` to customize the design system:

- Colors and gradients
- Animations and transitions
- Typography and spacing
- Component styles

### API Configuration

Adjust Gemini API settings in `src/api/gemini.js`:

- Model selection
- Temperature and creativity settings
- Token limits and timeouts
- Retry logic parameters

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# VITE_GEMINI_API_KEY=your_key_here
```

### Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
# Set VITE_GEMINI_API_KEY in environment variables
```

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy the 'dist' folder to your hosting platform
# Ensure environment variables are configured
```

## 🧪 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
1. Create a feature branch (`git checkout -b feature/amazing-feature`)
1. Commit your changes (`git commit -m 'Add amazing feature'`)
1. Push to the branch (`git push origin feature/amazing-feature`)
1. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the <LICENSE> file for details.

## 🆘 Troubleshooting

### Common Issues

**API Key Not Working**

- Verify your Gemini API key is correctly set in `.env`
- Check that billing is enabled on your Google Cloud account
- Ensure the API key has the necessary permissions

**Build Errors**

- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`
- Check Node.js version compatibility

**Rate Limiting**

- The app includes automatic retry with exponential backoff
- Consider upgrading your Gemini API plan for higher limits
- Monitor your API usage in Google Cloud Console

### Performance Tips

- **API Optimization**: The app uses efficient prompt engineering to minimize token usage
- **State Management**: React state is optimized to prevent unnecessary re-renders
- **Bundle Size**: Code splitting and tree shaking keep the bundle lightweight
- **Caching**: Consider implementing response caching for development

## 🌟 Roadmap

- [ ] Multiple AI model support (Claude, GPT-4, etc.)
- [ ] Project templates and customization
- [ ] Real-time collaboration features
- [ ] Export to GitHub repositories
- [ ] Integration with deployment platforms
- [ ] Custom agent configurations
- [ ] Advanced prompt engineering UI

## 💡 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Community**: Join our Discord server for discussions and support
- **API Support**: Refer to [Google Gemini documentation](https://developers.generativeai.google/)

-----

**Built with ❤️ by AI Developers** | **Powered by Google Gemini** | **Made with React & Vite**
