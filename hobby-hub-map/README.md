# Hobby Hub Map

A modern web application that connects people through shared hobbies and interests in their local communities. Built with React, TypeScript, and .NET Core.

## Features

- **User Authentication**: Secure login and registration system
- **Hobby Discovery**: Browse and search hobbies by category
- **Event Management**: Create, join, and discover local hobby events
- **Interactive Map**: Find nearby places and events on an interactive map
- **Social Features**: Connect with other hobbyists, send messages, and build communities
- **Location-based Services**: Discover people and events near you

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Leaflet** for maps
- **React Hook Form** for form handling
- **Zustand** for state management

### Backend
- **.NET 8** Web API
- **Entity Framework Core** for data access
- **SQL Server** database
- **SignalR** for real-time communication
- **JWT** authentication
- **Swagger** for API documentation

## Project Structure

```
hobby-hub-map/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── Events/         # Event-related components
│   │   ├── Hobbies/        # Hobby-related components
│   │   ├── Map/            # Map components
│   │   └── Places/         # Place-related components
│   ├── context/            # React contexts for state management
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   └── lib/                # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- .NET 8 SDK
- SQL Server (or SQL Server Express)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd hobby-hub-map
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:8080`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ../Same
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Update the connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HobbyHubMap;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. Run database migrations:
   ```bash
   dotnet ef database update
   ```

5. Start the backend server:
   ```bash
   dotnet run
   ```

The backend API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/nearby` - Get nearby users
- `POST /api/user/search` - Search users

### Hobbies
- `GET /api/hobby` - Get all hobbies
- `GET /api/hobby/{id}` - Get hobby by ID
- `POST /api/hobby` - Create new hobby
- `POST /api/hobby/{id}/join` - Join a hobby
- `DELETE /api/hobby/{id}/leave` - Leave a hobby

### Events
- `GET /api/event` - Get upcoming events
- `GET /api/event/{id}` - Get event by ID
- `POST /api/event` - Create new event
- `POST /api/event/{id}/join` - Join an event
- `POST /api/event/{id}/leave` - Leave an event

### Places
- `GET /api/place` - Get all places
- `GET /api/place/{id}` - Get place by ID
- `POST /api/place` - Create new place
- `GET /api/place/search` - Search places

## Development

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks
- Use Tailwind CSS for styling
- Implement proper error handling
- Write clean, readable code

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.