# DevconAgora

A decentralized conference companion app for Devcon events, built with React, TypeScript, and Swarm technology. DevconAgora enables attendees to
engage with conference content through real-time commenting, agenda management, and social features.

## Overview

DevconAgora is a progressive web application designed to enhance the conference experience by providing:

- **Interactive Session Engagement**: Real-time commenting system for talks and presentations
- **Dynamic Agenda Management**: Browse, filter, and create personalized agendas
- **Decentralized Architecture**: Built on Ethereum Swarm for censorship-resistant communication
- **Gamification**: Point-based reward system for active participation
- **Social Features**: Profile creation, note-taking, and community interaction

## Features

### Agenda & Sessions

- Browse conference sessions by day, stage, and category
- Filter talks by topics
- Create personalized "My Agenda" with liked sessions
- Real-time activity indicators showing session engagement

### Real-time Communication

- Decentralized commenting system powered by Swarm
- Live activity tracking for each session
- Message persistence across devices

### Gamification

- Point-based reward system for participation
- Achievement notifications (at given milestones)

### Personal Features

- Create and manage personal notes
- Profile customization with usernames

### Spaces

- Category-based discussion spaces
- Community-driven content areas

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: SCSS with custom design system
- **Blockchain**: Ethereum Swarm for decentralized storage
- **Commenting**: Custom Swarm-based comment system
- **Deployment**: Google Cloud Run with Docker

## Dependencies

### Core Dependencies

- `@ethersphere/bee-js` - Swarm network interaction
- `@solarpunkltd/comment-system` - Decentralized commenting
- `@solarpunkltd/comment-system-ui` - Comment UI components
- `@solarpunkltd/swarm-comment-js` - Comment UI components
- `ethers` - Ethereum utilities
- `react` & `react-dom` - UI framework
- `react-router-dom` - Client-side routing

### Development

- `typescript` - Type safety
- `vite` - Build tool
- `eslint` + `prettier` - Code linting and formatting
- `sass` - CSS preprocessing

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Access to Ethereum Swarm network

### Installation

```bash
# Clone the repository
git clone https://github.com/Solar-Punk-Ltd/DevconAgora.git
cd DevconAgora

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file with required environment variables, see `.env.sample`.

### Development Commands

```bash
# Development server
pnpm run dev

# Build for production
pnpm run build

# Fix linting issues
pnpm run lint:fix
```

## Architecture

### Component Structure

- `pages/` - Route-level components (Agenda, Talk, Profile, etc.)
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks for business logic
- `contexts/` - Global state management
- `utils/` - Helper functions and constants
- `types/` - TypeScript type definitions

### Key Hooks

- `useSessionData` - Manages conference session data
- `usePreloadTalks` - Preloads and caches talk comments
- `useGamification` - Handles point system and rewards
- `useNotes` - Personal note management
- `useBeePing` - Swarm network connectivity

### State Management

Global state managed through React Context API with the following key states:

- Sessions and agenda data
- User profile and authentication
- Comments and activity tracking
- Gamification points and progress

## Data Sources

### Conference Data

The agenda and session data is sourced from a predefined Swarm feed address where conference organizers upload structured data in **Pretalx API
format**. This ensures:

- **Standardized Format**: Conference data follows the established Pretalx schema for sessions, speakers, and scheduling
- **Decentralized Distribution**: Data is stored on Ethereum Swarm, eliminating single points of failure
- **Real-time Updates**: Feed-based architecture allows for dynamic updates to conference schedules
- **Cross-Platform Compatibility**: Pretalx format ensures data can be consumed by multiple conference applications

The application automatically fetches and caches this data, providing users with up-to-date conference information while maintaining the benefits of
decentralized storage.

### Code Standards

- TypeScript strict mode enabled
- ESLint configuration with max-warnings 0
- Prettier for code formatting
- Explicit return types required for functions

## TODO: License

## About Solar Punk Ltd

DevconAgora is developed by [Solar Punk Ltd](https://github.com/Solar-Punk-Ltd), building decentralized solutions for community engagement and
communication.
