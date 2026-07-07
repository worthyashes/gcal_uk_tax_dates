# GitHub Copilot Instructions

This repository contains a Google Apps Script application written in TypeScript.

## Primary Goal

Calculate UK tax residency days for Jersey residents using Google Calendar.

## Always

* Use TypeScript.
* Preserve strict typing.
* Keep Google API usage isolated.
* Prefer interfaces over concrete implementations.
* Write readable code.
* Write unit-testable business logic.
* Keep functions small.
* Document exported classes.

## Never

* Use `any`.
* Put business logic inside UI classes.
* Mix Calendar API code with tax calculation logic.
* Duplicate date calculations.
* Hardcode tax year values.

## Folder Responsibilities

calendar/

* Google Calendar integration only.

tax/

* Tax calculations.

reports/

* Report generation.

ui/

* Google Apps Script menus and UI.

config/

* Configuration.

models/

* Domain models.

utils/

* Shared utilities.

## Architecture

Google APIs → Services → Domain Models → Tax Calculator → Reports → UI

Business logic must not directly reference Google Apps Script services.

## Preferred Style

* Pure functions
* Immutable objects
* Dependency injection
* SOLID
* Composition over inheritance

Always consider future extensibility before implementing new features.
