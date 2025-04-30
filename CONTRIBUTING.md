# Contributing to Edviron

Thank you for your interest in contributing to Edviron! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

If you find a bug in the project, please create an issue on GitHub with the following information:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Any relevant screenshots or logs
6. Your environment details (OS, browser, etc.)

### Suggesting Enhancements

We welcome suggestions for enhancements! Please create an issue with:

1. A clear, descriptive title
2. A detailed description of the enhancement
3. The motivation for the enhancement
4. Any examples or mockups if applicable

### Pull Requests

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them with descriptive commit messages
4. Push to your fork: `git push origin feature/your-feature-name`
5. Create a pull request to the `develop` branch of the main repository

### Pull Request Guidelines

- Follow the coding style of the project
- Add or update tests as needed
- Update documentation as needed
- Keep pull requests focused on a single feature or bug fix
- Reference any relevant issues in your PR description

## Development Setup

### Frontend

```bash
cd fe
npm install
npm run dev
```

### Backend

```bash
cd backend
bun install
bunx prisma generate
bun dev
```

## Coding Standards

### JavaScript/TypeScript

- Use modern ES6+ features
- Use TypeScript for type safety
- Follow our ESLint and Prettier configurations

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design principles

### Commit Messages

- Use conventional commit format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation updates
  - `style:` for code style changes
  - `refactor:` for code refactoring
  - `test:` for tests
  - `chore:` for maintenance tasks

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). 