import { GoogleGenerativeAI } from ‘@google/generative-ai’;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**

- Calls the Gemini API with exponential backoff retry mechanism
- @param {string} prompt - The prompt to send to the AI
- @param {number} maxRetries - Maximum number of retry attempts
- @returns {Promise<string>} - The generated response
  */
  export async function callGeminiAPI(prompt, maxRetries = 3) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error(‘Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.’);
  }

const model = genAI.getGenerativeModel({
model: ‘gemini-2.0-flash-exp’,
generationConfig: {
temperature: 0.7,
topP: 0.8,
topK: 40,
maxOutputTokens: 8192,
}
});

for (let attempt = 0; attempt < maxRetries; attempt++) {
try {
const result = await model.generateContent(prompt);
const response = await result.response;
return response.text();
} catch (error) {
console.error(`Gemini API attempt ${attempt + 1} failed:`, error);

```
  // Handle rate limiting with exponential backoff
  if (error.status === 429 && attempt < maxRetries - 1) {
    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
    console.log(`Rate limited. Waiting ${delay}ms before retry...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    continue;
  }

  // Handle quota exceeded
  if (error.status === 429) {
    throw new Error('API quota exceeded. Please try again later or check your billing.');
  }

  // Handle invalid API key
  if (error.status === 401 || error.status === 403) {
    throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY environment variable.');
  }

  // Handle network errors
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    if (attempt < maxRetries - 1) {
      const delay = (attempt + 1) * 1000;
      console.log(`Network error. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }
    throw new Error('Network error. Please check your internet connection.');
  }

  // If it's the last attempt or an unrecoverable error, throw it
  if (attempt === maxRetries - 1) {
    throw new Error(`Failed to get response from Gemini API: ${error.message}`);
  }
}
```

}
}

/**

- Agent-specific prompts for the CrewAI pipeline
  */
  export const AGENT_PROMPTS = {
  ideaGeneration: () => `
  Generate a unique and marketable full-stack application idea that solves a real-world problem.
  The idea should be innovative, technically feasible, and have clear business value.
  
  Format your response exactly as:
  Title: [App Title]
  
  Description: [One detailed paragraph describing the app, its target users, core features, and the problem it solves]
  
  Make sure the idea is:
  - Technically feasible to build
  - Addresses a genuine pain point
  - Has clear monetization potential
  - Uses modern web technologies
    `,

appRequirements: (idea) => `
Based on the app idea “${idea}”, create a comprehensive requirements document.

```
Structure your response with these sections:

# Project Overview
Brief summary of the application

# User Stories
- As a [user type], I want [functionality] so that [benefit]
- (Include 5-7 user stories)

# Functional Requirements
- Core features and functionality
- User authentication and authorization
- Data management requirements
- API requirements

# Non-Functional Requirements
- Performance expectations
- Security requirements
- Scalability considerations
- Browser compatibility

# Technical Stack Recommendations
- Frontend technologies
- Backend technologies
- Database requirements
- Third-party integrations

Use markdown formatting and be specific about requirements.
```

`,

codeGeneration: (idea, requirements) => `
Generate production-ready boilerplate code for the application: “${idea}”

```
Based on these requirements: ${requirements.substring(0, 1000)}...

Provide complete, functional code for:

## Frontend (React Component)
Create a modern React functional component with:
- State management using hooks
- Responsive design with Tailwind CSS
- Form handling and validation
- API integration
- Modern UI/UX patterns

## Backend (Node.js Express Server)
Create a REST API server with:
- Express.js setup
- Route handlers for main functionality
- Input validation and error handling
- Database integration setup
- Authentication middleware

## Database Schema
Provide SQL schema for the main entities

Format each section in clearly labeled markdown code blocks with appropriate language tags.
Make the code production-ready with proper error handling, validation, and best practices.
```

`,

codeReview: (code) => `
Review the following code for a full-stack application. Analyze it for:

```
Code to review:
${code.substring(0, 2000)}...

Provide feedback as a structured review:

## Security Analysis
- Identify potential security vulnerabilities
- Authentication and authorization issues
- Input validation problems
- Data exposure risks

## Performance Issues
- Inefficient algorithms or queries
- Memory leaks or resource management
- Bundle size and loading performance
- Database optimization opportunities

## Code Quality
- Code organization and structure
- Error handling completeness
- Type safety and validation
- Maintainability concerns

## Best Practices
- Framework-specific recommendations
- Modern JavaScript/React patterns
- API design improvements
- Testing considerations

## Recommendations
- Priority fixes (High/Medium/Low)
- Performance optimizations
- Security enhancements
- Code refactoring suggestions

Use markdown formatting and provide specific, actionable feedback.
```

`,

deployment: (idea) => `
Create a comprehensive deployment strategy for the application: “${idea}”

```
Provide detailed deployment instructions for:

# Platform Selection
- Recommended hosting platforms for frontend and backend
- Justification for platform choices
- Cost considerations

# Frontend Deployment (Vercel/Netlify)
- Step-by-step deployment process
- Environment variables configuration
- Build optimization settings
- CDN and performance configuration

# Backend Deployment (Railway/Render)
- Container setup or direct deployment
- Database hosting and connection
- Environment variables and secrets
- Health checks and monitoring

# Database Setup
- Managed database service recommendations
- Connection string configuration
- Migration and seeding strategies
- Backup and recovery procedures

# CI/CD Pipeline
- GitHub Actions workflow
- Automated testing integration
- Deployment automation
- Rollback procedures

# Monitoring & Maintenance
- Application monitoring setup
- Performance tracking
- Error logging and alerting
- Regular maintenance tasks

# Security Configuration
- SSL/TLS setup
- Security headers configuration
- API rate limiting
- Authentication security

Use markdown formatting with clear step-by-step instructions.
```

`,

testing: (idea, code) => `
Generate a comprehensive testing strategy for the application: “${idea}”

```
Based on this code structure: ${code?.substring(0, 1000) || 'Standard React/Express application'}...

Create testing plans for:

# Testing Strategy Overview
- Testing pyramid approach
- Coverage targets
- Testing environments

# Unit Tests (Jest/Vitest)
Provide example unit tests for:
- React component testing
- Utility function testing  
- API endpoint testing
- Database model testing

\`\`\`javascript
// Example unit test
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Component from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
\`\`\`

# Integration Tests
- API integration testing
- Database integration testing
- Third-party service testing
- Authentication flow testing

# End-to-End Tests (Cypress/Playwright)
- User journey testing
- Critical path testing
- Cross-browser testing
- Mobile responsiveness testing

\`\`\`javascript
// Example E2E test
describe('User Registration Flow', () => {
  it('should allow user to register successfully', () => {
    cy.visit('/register');
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('securePassword');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
\`\`\`

# Performance Testing
- Load testing scenarios
- Performance benchmarks
- Memory leak detection
- Bundle size monitoring

# Testing Configuration
- Jest/Vitest configuration
- Cypress setup
- CI/CD integration
- Test database setup

Provide complete, runnable test examples with proper setup and configuration.
```

`
};
