# Tax Residency Rules

## Purpose

This document records the tax residency assumptions implemented by the application.

It is intended to document business rules separately from the source code.

---

## Current Rules

### UK Tax Year

The UK tax year runs from:

6 April

through

5 April

---

### Day Counting

Current implementation assumes:

* Every calendar day spent in the UK counts.
* Jersey days do not count as UK days.
* Other countries do not count as UK days.
* Multi-day visits count every calendar day touched.

---

## Configurable Rules

Future versions should allow configuration of:

* Warning thresholds
* Tax year start
* Tax year end
* Countries
* Calendar names

---

## Future Rule Support

Potential future additions:

* Statutory Residence Test
* Split-year treatment
* Automatic location inference
* Arrival and departure rules
* Transit day handling
* Exceptional circumstances
* Overseas workday relief

---

## Important Note

This application is intended as a record-keeping and reporting tool.

It is not a substitute for professional tax advice.

Users remain responsible for confirming their tax residency status under applicable law.
