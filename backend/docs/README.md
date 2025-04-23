# Authentication System Documentation

This directory contains comprehensive documentation for the authentication system.

## Core Documentation

| Document | Description |
|----------|-------------|
| [System Architecture](./system_architecture.md) | Comprehensive overview of the system components, design patterns, and data flow |
| [Authentication Flow](./authentication_flow.md) | Detailed explanation of authentication processes with visual diagrams |
| [Request Data Best Practices](./req-data_best-practice.md) | Guidelines for handling request data in middleware chains |
| [Authentication](./authentication.md) | Core concepts of authentication in this application |
| [Authorization](./authorization.md) | Core concepts of authorization and access control |
| [Auth Routes](./auth.routes.md) | Notes on authentication routes and middleware chain |

## Implementation Checklists

| Checklist | Description |
|-----------|-------------|
| [Authentication Checklist](./checklists/authentication.checklist.md) | Implementation status of authentication features |
| [Security Checklist](./checklists/security_checklist.md) | Security assessment and implementation status |

## Visual Diagrams

| Diagram | Description |
|---------|-------------|
| [Registration Flow](./diagrams/registration-flow.svg) | Visual sequence diagram of the registration process |
| [Login Flow](./diagrams/login-flow.svg) | Visual sequence diagram of the login process |
| [Logout Flow](./diagrams/logout-flow.svg) | Visual sequence diagram of the logout process |

## Directory Structure

```
docs/
├── checklists/                  # Implementation checklists
│   ├── authentication.checklist.md
│   └── security_checklist.md
├── diagrams/                    # Visual diagrams
│   ├── login-flow.mmd           # Mermaid source files
│   ├── login-flow.svg           # Generated SVG files
│   ├── logout-flow.mmd
│   ├── logout-flow.svg
│   ├── registration-flow.mmd
│   └── registration-flow.svg
├── learnings/                   # In-depth learning resources
├── auth.routes.md               # Auth routes documentation
├── authentication.md            # Authentication concepts
├── authentication_flow.md       # Authentication flow details
├── authorization.md             # Authorization concepts
├── req-data_best-practice.md    # Request data handling best practices
├── system_architecture.md       # System architecture overview
└── README.md                    # This file
```

## How to Use This Documentation

1. Start with the [System Architecture](./system_architecture.md) document to understand the overall system design.
2. Review the [Authentication Flow](./authentication_flow.md) document to understand the specific authentication processes.
3. Consult the relevant checklist to understand implementation status and planned features.
4. Refer to specific documents for details on individual components or concepts.

## Updating Documentation

When making changes to the system:

1. Update relevant documentation to reflect changes.
2. Update checklists to mark completed items.
3. Create or update diagrams to visualize new or changed processes.
4. Add implementation notes to the relevant documents.

## Generating Diagrams

The visual diagrams are created using Mermaid. To update or create new diagrams:

1. Edit the `.mmd` file with the desired changes.
2. Run the following command to generate an SVG:

```bash
mmdc -i input.mmd -o output.svg
```

For example:

```bash
mmdc -i ./diagrams/login-flow.mmd -o ./diagrams/login-flow.svg
``` 