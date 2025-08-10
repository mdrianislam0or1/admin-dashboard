# Mock Credentials

# login: rian@gmail.com

# pass: 123456

# Admin Dashboard for Content Management

A responsive admin dashboard for managing and analyzing blog content with filtering, sorting, and data visualization capabilities.

## Features

### Core Features

- **Article Management**

  - Display articles in table/grid view
  - Filter by author, date range, and status
  - Sort by views, likes, comments, or publish date
  - Pagination support
  - Case-insensitive title search

- **Performance Visualization**

  - Interactive charts showing views over time
  - Toggle between daily/monthly views
  - Dynamic updates based on filters

- **Article Editing**
  - Modal-based editing interface
  - Form validation for required fields
  - Status toggling (Published/Draft)
  - Success feedback on save

### Bonus Features

- Debounced filter inputs
- Mock authentication system
- Role-based UI (Admin/Editor views)
- Responsive design

## Tech Stack

- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit
- **Data Visualization**: Recharts
- **UI Components**: Material-UI (MUI)
- **Routing**: React Router
- **API**: Mock Service Worker (MSW)
- **Testing**: Jest + React Testing Library

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/content-admin-dashboard.git
   ```
