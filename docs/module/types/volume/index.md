---
title: Volume
kind: interface
longname: module:types.Volume
description: A block storage volume as returned by the API.
---

# Volume

<Signature
  code="interface Volume {
	created_at?: string;
	id?: string;
	name?: string;
	region?: string | VmRegion;
	size?: number;
	status?: string;
	vm_id?: string | number;
}"
/>

<SourceLink href="/source/types-ts/#L81" label="types.ts:81" />

A block storage volume as returned by the API.

---

## Properties

<MemberHeading id="createdat" depth="3" name="created_at" sig="created_at: string" />

<MemberMeta sourceHref="/source/types-ts/#L88" sourceLabel="types.ts:88" />

<MemberHeading id="id" depth="3" name="id" sig="id: string" />

<MemberMeta sourceHref="/source/types-ts/#L82" sourceLabel="types.ts:82" />

<MemberHeading id="name" depth="3" name="name" sig="name: string" />

<MemberMeta sourceHref="/source/types-ts/#L83" sourceLabel="types.ts:83" />

<MemberHeading id="region" depth="3" name="region" sig="region: string | VmRegion" />

<MemberMeta sourceHref="/source/types-ts/#L87" sourceLabel="types.ts:87" />

<MemberHeading id="size" depth="3" name="size" sig="size: number" />

<MemberMeta sourceHref="/source/types-ts/#L84" sourceLabel="types.ts:84" />

<MemberHeading id="status" depth="3" name="status" sig="status: string" />

<MemberMeta sourceHref="/source/types-ts/#L85" sourceLabel="types.ts:85" />

<MemberHeading id="vmid" depth="3" name="vm_id" sig="vm_id: string | number" />

<MemberMeta sourceHref="/source/types-ts/#L86" sourceLabel="types.ts:86" />
