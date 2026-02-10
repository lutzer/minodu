# Project Guidelines for Claude

This file contains guidelines, practices, and principles that should be considered when working on this codebase.

## Project Context

- **Project Name:** Minodu
- **Target:** Rural/agricultural communities, deployable on Raspberry Pi
- **Languages:** French (fr) and Kinyarwanda (kb) support

---

## Code Style & Practices

### General

- Keep code simple and readable
- Prefer explicit over implicit
- Avoid over-engineering; solve the current problem, not hypothetical future ones
- Delete unused code rather than commenting it out
- the data directory contains all the data that needs to be preserved or shared across containers
- the scripts to start the docker services are located in package.json.
- the tools directory contains tools, to sync the local database to an online one

### TypeScript (Frontend & Backend)

- Use strict TypeScript; avoid `any` types
- Prefer interfaces over type aliases for object shapes
- Use meaningful variable and function names
- dont use values for spacing in the css style. only use the css vars defined in globals.css


### Python (Forum & AI Services)

- Follow PEP 8 conventions
- Use type hints consistently
- Prefer async/await for I/O operations
- Make sure to avoid long await calls that block fast apis main thread.
- use redis and celery for task that last longer
- write unit tests for all newly added functions
- uses python poetry 
- the llm is running localy with ollama

### Svelte (Frontend)

- Keep components small and focused
- Use Svelte 5 runes syntax (`$state`, `$derived`, `$effect`)
- Colocate styles within components
- Run linter after every major edit with `npm run lint` and `npm run format` 

### NestJS (Backend)

- Follow module-based architecture
- Use dependency injection
- Keep controllers thin; business logic goes in services

---

## Architecture Principles

- Maintain separation between microservices
- Each service should be independently deployable
- Use environment variables for configuration
- Design for offline-first capability where possible

---

## Testing

- Write tests for critical business logic
- Use Jest for TypeScript, PyTest for Python
- Integration tests should use Docker containers

---

## Performance Considerations

- Optimize for Raspberry Pi constraints (limited CPU/RAM)
- Use streaming for large responses (AI, audio)
- Implement virtual lists for long data sets
- Cache aggressively where appropriate

---

## Security

- Validate all user inputs
- Use parameterized queries (TypeORM/SQLAlchemy handle this)
- JWT tokens for authentication
- Never commit secrets or credentials

---

## Git & Commits

- Write clear, descriptive commit messages
- Keep commits focused on single changes
- Test before committing
- Dont do a commit when tests are failing

---

## Custom Instructions

<!-- Add your own guidelines below -->

