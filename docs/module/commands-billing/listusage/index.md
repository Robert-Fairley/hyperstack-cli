---
title: listUsage
kind: function
longname: module:commands/billing.listUsage
description: List usage history with optional date range. Displays date, resource type/ID, amount, and description for each billing record.
---

# listUsage

<Signature code="listUsage(opts?: { days?: number }): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/billing-ts/#L63" label="billing.ts:63" />

**Modifiers:** `async`

List usage history with optional date range. Displays date, resource type/ID, amount, and description for each billing record.

**Parameters**

- `opts` ({ days?: number }, optional) — — Optional filters.

**Properties**

- `days` (number, optional) — — Number of days to look back (not enforced by API).

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/billing/#get-billing-records — GET /billing/billing](<https://docs.hyperstack.cloud/docs/api-reference/billing/#get-billing-records — GET /billing/billing>)
