---
title: Snapshot
kind: interface
longname: module:types.Snapshot
description: A disk snapshot as returned by the API.
---

# Snapshot

<Signature
  code="interface Snapshot {
	created_at?: string;
	id?: string;
	name?: string;
	region?: string | VmRegion;
	size?: number;
	status?: string;
	vm_id?: string | number;
}"
/>

<SourceLink href="/source/types-ts/#L94" label="types.ts:94" />

A disk snapshot as returned by the API.

---

## Properties

<MemberHeading id="createdat" depth="3" name="created_at" sig="created_at: string" />

<MemberMeta sourceHref="/source/types-ts/#L101" sourceLabel="types.ts:101" />

<MemberHeading id="id" depth="3" name="id" sig="id: string" />

<MemberMeta sourceHref="/source/types-ts/#L95" sourceLabel="types.ts:95" />

<MemberHeading id="name" depth="3" name="name" sig="name: string" />

<MemberMeta sourceHref="/source/types-ts/#L96" sourceLabel="types.ts:96" />

<MemberHeading id="region" depth="3" name="region" sig="region: string | VmRegion" />

<MemberMeta sourceHref="/source/types-ts/#L100" sourceLabel="types.ts:100" />

<MemberHeading id="size" depth="3" name="size" sig="size: number" />

<MemberMeta sourceHref="/source/types-ts/#L97" sourceLabel="types.ts:97" />

<MemberHeading id="status" depth="3" name="status" sig="status: string" />

<MemberMeta sourceHref="/source/types-ts/#L98" sourceLabel="types.ts:98" />

<MemberHeading id="vmid" depth="3" name="vm_id" sig="vm_id: string | number" />

<MemberMeta sourceHref="/source/types-ts/#L99" sourceLabel="types.ts:99" />
