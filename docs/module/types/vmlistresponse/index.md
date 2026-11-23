---
title: VmListResponse
kind: interface
longname: module:types.VmListResponse
description: Wrapper for VM list API responses with various possible shapes.
---

# VmListResponse

<Signature
  code="interface VmListResponse {
	data?: VmInstance[] | VmDataWrapper;
	instances?: VmInstance[];
	virtual_machines?: VmInstance[];
}"
/>

<SourceLink href="/hyperstack-cli/source/types-ts/#L30" label="types.ts:30" />

Wrapper for VM list API responses with various possible shapes.

---

## Properties

<MemberHeading id="data" depth="3" name="data" sig="data: VmInstance[] | VmDataWrapper" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L33" sourceLabel="types.ts:33" />

<MemberHeading id="instances" depth="3" name="instances" sig="instances: VmInstance[]" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L31" sourceLabel="types.ts:31" />

<MemberHeading id="virtualmachines" depth="3" name="virtual_machines" sig="virtual_machines: VmInstance[]" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L32" sourceLabel="types.ts:32" />
