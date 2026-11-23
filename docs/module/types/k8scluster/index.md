---
title: K8sCluster
kind: interface
longname: module:types.K8sCluster
description: A managed Kubernetes cluster as returned by the API.
---

# K8sCluster

<Signature
  code="interface K8sCluster {
	created_at?: string;
	id?: string;
	kubernetes_version?: string;
	name?: string;
	node_count?: number;
	region?: string | VmRegion;
	status?: string;
}"
/>

<SourceLink href="/hyperstack-cli/source/types-ts/#L200" label="types.ts:200" />

A managed Kubernetes cluster as returned by the API.

---

## Properties

<MemberHeading id="createdat" depth="3" name="created_at" sig="created_at: string" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L207" sourceLabel="types.ts:207" />

<MemberHeading id="id" depth="3" name="id" sig="id: string" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L201" sourceLabel="types.ts:201" />

<MemberHeading id="kubernetesversion" depth="3" name="kubernetes_version" sig="kubernetes_version: string" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L205" sourceLabel="types.ts:205" />

<MemberHeading id="name" depth="3" name="name" sig="name: string" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L202" sourceLabel="types.ts:202" />

<MemberHeading id="nodecount" depth="3" name="node_count" sig="node_count: number" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L206" sourceLabel="types.ts:206" />

<MemberHeading id="region" depth="3" name="region" sig="region: string | VmRegion" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L204" sourceLabel="types.ts:204" />

<MemberHeading id="status" depth="3" name="status" sig="status: string" />

<MemberMeta sourceHref="/hyperstack-cli/source/types-ts/#L203" sourceLabel="types.ts:203" />
