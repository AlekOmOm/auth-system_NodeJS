
# .env file

FRONTEND_PORT = process.env.FRONTEND_PORT || 3000
BACKEND_PORT = process.env.BACKEND_PORT || 5000




# run-frontend
dev-frontend:
	@echo "Running frontend..."
	@cd frontend && npm run dev

# dev backend
dev-backend:
	@echo "Running backend..."
	@cd backend && npm run dev
	@echo "Backend running on http://localhost:5000"

# run fullstack
dev:
	@echo "Running fullstack..."
	@cd backend && npm run dev & cd frontend && npm run dev
	@echo "Fullstack running on http://localhost:3000"


# help
help:
	@echo "Makefile commands:"
	@echo "------------------------------------------------------------"
	@echo "  dev-frontend: Run frontend"
	@echo "  dev-backend: Run backend"
	@echo "  dev: Run fullstack"
	@echo " - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -"
	@echo "  "
	@echo "  "
	@echo "  "
	@echo "  "
	@echo "  "
	@echo "------------------------------------------------------------"



