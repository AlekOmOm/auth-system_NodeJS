# .env file

FRONTEND_PORT = process.env.FRONTEND_PORT || 3000
BACKEND_PORT = process.env.BACKEND_PORT || 5000

# Development commands
dev-frontend:
	@echo "Running frontend in development mode..."
	cd frontend && npm run start:dev

dev-backend:
	@echo "Running backend in development mode..."
	cd backend && npm run dev
	@echo "Backend running on http://localhost:5000"

# Use start commands that work in both Powershell and Bash
# For fullstack, use separate terminals/processes
dev-fullstack:
	@echo "Running fullstack in development mode..."
	@echo "Please run 'make dev-backend' and 'make dev-frontend' in separate terminals"
	@echo "Or use these commands directly:"
	@echo "  cd backend && npm run dev"
	@echo "  cd frontend && npm run start:dev"

# Production commands
prod-frontend:
	@echo "Building and running frontend in production mode..."
	cd frontend && npm run start

prod-backend:
	@echo "Running backend in production mode..."
	cd backend && npm run run
	@echo "Backend running in production mode"

# For fullstack, use separate terminals/processes
prod-fullstack:
	@echo "Running fullstack in production mode..."
	@echo "Please run 'make prod-backend' and 'make prod-frontend' in separate terminals"
	@echo "Or use these commands directly:"
	@echo "  cd backend && npm run run"
	@echo "  cd frontend && npm run start"

# Build frontend
build-frontend:
	@echo "Building frontend for production..."
	cd frontend && npm run build

# Help
help:
	@echo "Makefile commands:"
	@echo "------------------------------------------------------------"
	@echo "  Development:"
	@echo "    dev-frontend: Run frontend in development mode"
	@echo "    dev-backend: Run backend in development mode"
	@echo "    dev-fullstack: Instructions for running both services"
	@echo ""
	@echo "  Production:"
	@echo "    prod-frontend: Build and run frontend in production mode"
	@echo "    prod-backend: Run backend in production mode"
	@echo "    prod-fullstack: Instructions for running both services in production"
	@echo ""
	@echo "  Build:"
	@echo "    build-frontend: Build frontend for production"
	@echo "------------------------------------------------------------"



