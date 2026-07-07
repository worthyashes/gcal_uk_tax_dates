# UK Tax Day Tracker

## Overview

UK Tax Day Tracker is a Google Apps Script application written in TypeScript that helps Jersey residents monitor the number of days they spend in the United Kingdom for tax residency purposes.

The application integrates with Google Calendar to analyse travel events and produce reports showing UK day counts by tax year.

The project is developed locally using Visual Studio Code and deployed using Google's CLASP tooling.

---

## Features

Current planned functionality:

* Read Google Calendar events
* Calculate UK days
* Support UK tax years (6 April – 5 April)
* Monthly summaries
* Historical reporting
* Configurable warning thresholds
* Google Sheets reporting
* Google Workspace UI

Future enhancements include automatic location detection, Gmail itinerary parsing, AI-assisted travel classification, and PDF reporting.

---

## Technology Stack

* TypeScript
* Node.js
* Google Apps Script
* Google Calendar API (Apps Script service)
* Google Sheets
* CLASP
* Git
* GitHub

---

## Project Structure

```
src/
    calendar/
    config/
    models/
    reports/
    tax/
    ui/
    utils/

tests/

docs/
```

---

## Installation

Clone the repository.

Install dependencies.

```
npm install
```

Login to Google.

```
clasp login
```

Clone or create the Apps Script project.

```
clasp clone <SCRIPT_ID>
```

Build the project.

```
npm run build
```

Deploy.

```
clasp push
```

---

## Development

Recommended editor:

Visual Studio Code

Enable:

* ESLint
* Prettier
* TypeScript strict mode

---

## Testing

Business logic should remain independent of Google APIs.

All tax calculations should be unit tested.

Google services should be mocked during tests.

---

## Deployment

Deployment is performed with:

```
clasp push
```

No manual editing should occur within the Google Apps Script editor except for debugging.

---

## License

MIT License
