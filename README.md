# TalentFlow - ATS + CRM Web Application

A modern, full-featured Applicant Tracking System (ATS) and Customer Relationship Management (CRM) web application built with React, TypeScript, and modern web technologies.

## Features

### ATS (Applicant Tracking System)
- **Jobs Management**: Create, edit, and manage job openings
- **Application Pipeline**: Kanban-style board to track applications through hiring stages
- **Candidate Database**: Comprehensive candidate profiles with skills, experience, and history
- **Interview Scheduling**: Track and manage interview processes
- **Offer Management**: Handle job offers and negotiations

### CRM (Customer Relationship Management)
- **Account Management**: Track customer accounts and company information
- **Contact Management**: Manage contacts within accounts
- **Sales Pipeline**: Visual opportunity tracking through sales stages
- **Revenue Tracking**: Monitor pipeline value and conversion rates

### Core Features
- **Activity Timeline**: Unified activity tracking across all entities
- **Reports & Analytics**: Comprehensive reporting with key metrics
- **Role-based Access**: Different views for Admin, Recruiter, and Sales roles
- **Search & Filtering**: Advanced search across all data
- **Command Palette**: Quick navigation and actions (Ctrl+K)
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **UI Components**: Headless UI + Custom Components
- **Icons**: Lucide React
- **Drag & Drop**: dnd-kit
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd talentflow
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Demo Accounts

Use these demo accounts to log in:
- **Admin**: admin@company.com (Full access)
- **Recruiter**: recruiter@company.com (ATS features only)
- **Sales**: sales@company.com (CRM features only)

## Mock API Configuration

The application uses a mock API layer for development and demo purposes.

### Toggle Mock API

In `src/config/index.ts`, you can toggle between mock and real API:
```typescript
export const MOCK_API = true; // Set to false for real API
```

### Reset Mock Database

To reset the mock database to its initial state:
1. Open browser developer tools
2. Go to Application/Storage tab
3. Clear localStorage for the site
4. Refresh the page

Alternatively, use the reset function in Settings page.

### Mock Data

The mock database includes:
- 3 sample jobs
- 50 candidates
- 60 applications across different stages  
- 2 sample accounts
- 20+ contacts
- 12 opportunities
- 40+ activities

Data persists in localStorage between sessions.

## Key Features & Usage

### Keyboard Shortcuts
- **Ctrl/Cmd + K**: Open command palette
- **N**: Create new item (context-dependent)
- **/**: Focus search
- **G + J**: Go to Jobs
- **G + C**: Go to Candidates  
- **G + A**: Go to Accounts
- **G + O**: Go to Opportunities

### Command Palette
Press `Ctrl/Cmd + K` to access the command palette for:
- Quick navigation between pages
- Creating new items (jobs, candidates, accounts, activities)
- Search across the application

### Kanban Boards
- **Applications**: Drag applications between hiring stages
- **Opportunities**: Move sales opportunities through pipeline stages
- WIP limits on certain columns
- Inline quick actions

### Data Tables
- Sortable columns
- Global search
- CSV export
- Column visibility controls
- Responsive design

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── hooks/             # Custom hooks
├── mocks/             # Mock API and database
├── pages/             # Page components
├── test/              # Test files
├── types/             # TypeScript type definitions
└── config/            # Configuration files
```

## Testing

Run the test suite:
```bash
npm test
```

Tests include:
- Component rendering tests
- Mock API functionality
- Database operations
- Form validation

## Building for Production

```bash
npm run build
```

The built application will be in the `dist` folder.

## Environment Variables

For production deployment, set these environment variables:
- `VITE_API_BASE_URL`: Base URL for your API
- `VITE_MOCK_API`: Set to 'false' to use real API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.