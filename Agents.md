# AGENTS.md

# UK Tax Day Tracker for Jersey Residents

## Project Overview

This project is a Google Apps Script application written in TypeScript that integrates with Google Calendar to calculate the number of days a Jersey resident spends in the United Kingdom for tax purposes.

The project is developed locally in Visual Studio Code and managed using Git. Deployment is performed using Google's CLASP tooling.

The application must be designed so that the tax calculation logic is completely independent of Google-specific APIs wherever possible.

---

# Primary Objectives

The application shall:

- Read events from one or more Google Calendars.
- Determine which days are spent in:
  - Jersey
  - United Kingdom
  - Other Countries
- Calculate UK presence within configurable date ranges.
- Support UK tax years (6 April – 5 April).
- Produce reports showing:
  - Total UK days
  - Monthly totals
  - Remaining allowance
  - Historical years
- Allow configurable warning thresholds.
- Support future expansion for additional tax residency rules.

---

# Core Design Principles

The project should follow these principles.

## Separation of Concerns

Google API interaction should only occur inside service classes.

Business logic must never directly call CalendarApp, SpreadsheetApp or other Google APIs.

Business logic should be testable without Google.

---

## SOLID Principles

The code should follow SOLID design.

- Single Responsibility
- Open/Closed
- Liskov
- Interface Segregation
- Dependency Injection where appropriate

---

## TypeScript

Always use strict mode.

Avoid use of:

- any
- implicit any
- global variables

Prefer:

- readonly
- interfaces
- enums
- immutable objects

---

# Recommended Folder Structure

```
src/

    app/

    calendar/
        CalendarService.ts
        EventReader.ts

    tax/
        TaxCalculator.ts
        TaxRules.ts
        DateCounter.ts

    reports/
        ReportGenerator.ts
        SheetExporter.ts

    models/
        CalendarEvent.ts
        TaxDay.ts
        Country.ts

    config/
        Settings.ts

    utils/
        DateUtils.ts
        Logger.ts

    ui/
        Menu.ts
        Sidebar.ts

    tests/
```

---

# Project Architecture

```
Google Calendar

        ↓

Calendar Service

        ↓

Domain Model

        ↓

Tax Calculator

        ↓

Report Generator

        ↓

Google Sheets / Sidebar
```

Google APIs should never leak into the calculation layer.

---

# Domain Model

The application should model:

## Calendar Event

Contains:

- title
- location
- start date
- end date
- all-day flag

---

## Tax Day

Represents a single calendar day.

Properties:

- date
- country
- source event
- notes

---

## Country

Initially support:

- Jersey
- United Kingdom
- France
- Other

This should be expandable.

---

# Tax Rules

Initially implement:

- Count UK days.
- Ignore Jersey days.
- Ignore other countries.
- Count every calendar day touched by a UK visit.
- Support configurable tax year boundaries.

Rules must be encapsulated so additional residency rules can be added later without rewriting existing code.

---

# Configuration

Settings should include:

- UK Calendar Name
- Jersey Calendar Name
- Warning Threshold
- Tax Year Start
- Tax Year End
- Spreadsheet ID
- Time Zone

These should eventually be editable through a Settings UI.

---

# Reports

Generate:

## Summary

Example

UK Days Used: 42

Remaining: 48

Status: Safe

---

## Monthly Breakdown

April

May

June

etc.

---

## Historical Years

Store previous calculations.

Allow comparison between years.

---

# Google Calendar Integration

Support:

- Primary Calendar
- Named calendars
- Multiple calendars
- Event locations
- Event descriptions
- All-day events
- Multi-day events

Future enhancement:

Infer country from event location.

---

# Google Sheets Integration

Generate a spreadsheet containing:

Summary

Monthly totals

Historical totals

Settings

Charts (future)

---

# UI

Provide a custom menu.

Example:

UK Tax Tracker

- Calculate Current Year
- Generate Report
- Open Dashboard
- Settings

Future enhancement:

Sidebar dashboard.

---

# Error Handling

The application should:

Handle missing calendars.

Handle empty calendars.

Handle invalid dates.

Handle duplicate events.

Handle overlapping events.

Never crash because of malformed data.

---

# Logging

Provide structured logging.

Avoid excessive Logger.log calls.

Logging should be easy to disable.

---

# Testing

Business logic should be unit testable.

Calendar interaction should be mockable.

Tax calculations should have comprehensive tests.

Date calculations should be heavily tested.

---

# Coding Standards

Prefer:

Small functions.

Pure functions.

Composition over inheritance.

Interfaces instead of concrete implementations.

Meaningful naming.

Self-documenting code.

Avoid:

Magic numbers.

Deep nesting.

Large classes.

Duplicated code.

Global mutable state.

---

# Documentation

Every exported class should include documentation.

Complex calculations should explain the reasoning.

Tax rules should reference the source legislation where appropriate.

---

# Future Features

Potential future enhancements include:

- Automatic location detection using Google Maps
- Flight itinerary parsing
- Gmail travel confirmation scanning
- Holiday detection
- PDF report generation
- Accountant export
- CSV export
- Email reminders
- Mobile dashboard
- Google Workspace Add-on
- Multi-user support
- Cloud backup
- AI-assisted travel classification

---

# Development Workflow

Develop using:

- Visual Studio Code
- TypeScript
- Node.js
- npm
- Git
- GitHub
- CLASP

Deployment process:

npm run build

↓

clasp push

↓

Google Apps Script

---

# Agent Expectations

When modifying this project, the agent should:

- Preserve clean architecture.
- Keep business logic independent of Google APIs.
- Avoid unnecessary dependencies.
- Maintain TypeScript strict mode compatibility.
- Write maintainable, readable code.
- Prefer small incremental commits.
- Update documentation when adding features.
- Add tests for new business logic.
- Avoid breaking public interfaces without good reason.

Before implementing new functionality, consider whether it belongs in:
- Calendar layer
- Domain model
- Tax calculation layer
- Reporting layer
- User interface layer

Maintain clear boundaries between these components.

The long-term goal is to build a professional-quality application that can evolve to support increasingly sophisticated tax residency calculations while remaining easy to maintain.