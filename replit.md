# Replit.md

## Overview

This is an IPL (Indian Premier League) auction simulation application built with React frontend and Express backend. The application allows users to create rooms, select IPL teams, and participate in live player auctions with real-time bidding mechanics. Players can create or join auction rooms, select from 10 IPL teams, and bid on cricket players with budget constraints and team composition rules.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite**: Build tool and development server for fast development experience
- **TanStack Query**: Data fetching, caching, and synchronization with the backend
- **Wouter**: Lightweight client-side routing library
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn/ui**: Pre-built component library with Radix UI primitives
- **Component Structure**: Organized into pages, components, and reusable UI components

### Backend Architecture
- **Express.js**: REST API server handling all auction logic and room management
- **In-Memory Storage**: Simple storage implementation using Maps for development
- **Real-time Updates**: Polling-based updates (2-second intervals) for live auction data
- **RESTful API Design**: Clear endpoint structure for rooms, teams, players, and bidding

### Data Storage Solutions
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **PostgreSQL**: Primary database (configured but using in-memory storage currently)
- **Schema Design**: Comprehensive tables for rooms, members, teams, players, bids, and squads
- **Migration Support**: Database schema migrations through Drizzle Kit

### Game Logic and Rules
- **Room States**: Lobby → Team Selection → Live Auction → Ended
- **Team Management**: 10 IPL teams with unique selection, budget of ₹100 Cr per team
- **Player Constraints**: 15-20 players per team, maximum 8 overseas players
- **Bidding System**: Dynamic minimum increments based on current bid amount
- **Turn-based Auction**: Sequential bidding with countdown timers

### Authentication and Authorization
- **Simple User System**: UUID-based user identification stored in localStorage
- **Role-based Access**: Host, team members, and spectators with different permissions
- **Session Management**: Client-side storage of user credentials and room membership

## External Dependencies

- **@neondatabase/serverless**: Neon database connector for PostgreSQL
- **@tanstack/react-query**: Data fetching and state management
- **@radix-ui/***: Headless UI component primitives
- **drizzle-orm**: Database ORM and query builder
- **express**: Node.js web framework
- **wouter**: Client-side routing
- **tailwindcss**: CSS framework
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **zod**: Runtime type validation and schema parsing

The application uses a polling-based real-time update system rather than WebSockets, making it simpler to deploy and maintain while still providing a responsive user experience for the auction mechanics.