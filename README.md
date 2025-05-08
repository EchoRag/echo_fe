# Echo Platform

Echo is a modern project management platform designed to streamline collaboration and document management. Built with React, TypeScript, and Vite, it provides an intuitive interface for managing projects, documents, and team communication.

[![Known Vulnerabilities](https://snyk.io/test/github/EchoRag/echo_fe/badge.svg)](https://snyk.io/test/github/EchoRag/echo_fe) 

[![codecov](https://codecov.io/gh/EchoRag/echo_llm/graph/badge.svg?token=CW8863DIWK)](https://codecov.io/gh/EchoRag/echo_llm)
## Features

- **Project Management**: Create and manage multiple projects with customizable details
- **Document Upload**: Easily upload and organize project-related documents
- **Call Management**: Schedule and track project calls and meetings
- **Real-time Updates**: Get instant updates on project activities and changes
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Tech Stack

- React 18
- TypeScript
- Vite
- Jest for Testing
- Tailwind CSS for Styling

## Getting Started

1. Clone the repository
```bash 
git clone https://github.com/yourusername/echo-platform.git
cd echo-platform
```

2. Install dependencies.
```bash
npm install
```

## Testing 
The project uses Jest and React Testing Library for comprehensive testing. The test suite covers:

- Component rendering and functionality
- User interactions
- Navigation flows
- Project data display
- System status monitoring
- Error handling
- Real-time updates

### Test Coverage

The test suite includes comprehensive coverage for:

1. **Status Component**
   - Health check monitoring
   - Server status indicators
   - Error state handling
   - Real-time updates
   - Server start/stop functionality
   - Status color changes
   - Timestamp updates

2. **Project Management**
   - Project creation and updates
   - Document management
   - User interactions
   - Error handling

3. **Navigation**
   - Route changes
   - URL updates
   - State management

To run the tests:
```bash
npm test
```

To run tests with coverage report:
```bash
npm test -- --coverage
```

### Testing Best Practices

- Using React Testing Library's best practices
- Testing from a user's perspective
- Proper async handling
- Comprehensive error scenarios
- Mocking external dependencies
- Testing accessibility 