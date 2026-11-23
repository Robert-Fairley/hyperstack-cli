---
title: Firewall
kind: interface
longname: module:types.Firewall
description: A firewall with its associated rules.
---

# Firewall

<Signature
  code="interface Firewall {
	id?: string;
	name?: string;
	rules?: FirewallRule[];
	vm_id?: string | number;
}"
/>

<SourceLink href="/hyperstack-cli/source/types-ts/#L151" label="types.ts:151" />

A firewall with its associated rules.

---

## Properties

<MemberHeading id="id" depth="3" name="id" sig="id: string" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L152" sourceLabel="types.ts:152" />

<MemberHeading id="name" depth="3" name="name" sig="name: string" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L153" sourceLabel="types.ts:153" />

<MemberHeading id="rules" depth="3" name="rules" sig="rules: FirewallRule[]" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L155" sourceLabel="types.ts:155" />

<MemberHeading id="vmid" depth="3" name="vm_id" sig="vm_id: string | number" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L154" sourceLabel="types.ts:154" />
