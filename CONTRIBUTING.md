# Contributing

Thank you for contributing.

## Development Principles

This project follows:

* SOLID principles
* Clean Architecture
* TypeScript strict mode
* Testable business logic
* Small focused commits

---

## Branch Strategy

* main
* develop
* feature/*
* bugfix/*
* release/*

---

## Commit Messages

Examples:

```
feat: add UK tax year calculator

fix: handle overlapping calendar events

refactor: simplify date counting

docs: update installation guide
```

---

## Pull Requests

Every pull request should:

* Compile successfully
* Pass all tests
* Include documentation updates where appropriate
* Include tests for new business logic
* Avoid unrelated formatting changes

---

## Coding Standards

Prefer:

* Small functions
* Interfaces
* Immutable objects
* Dependency injection
* Composition

Avoid:

* any
* global variables
* duplicated logic
* deeply nested conditionals
* large classes

---

## Testing Expectations

Tax calculations should include:

* Single-day visits
* Multi-day visits
* Leap years
* UK tax year boundaries
* Overlapping events
* Duplicate events
* Empty calendars

---

## Documentation

Update documentation whenever functionality changes.

Keep AGENTS.md current.
