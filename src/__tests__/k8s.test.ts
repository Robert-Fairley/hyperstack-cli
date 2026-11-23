import { describe, it, expect, vi, beforeEach } from "vitest";
import * as k8sCommands from "../commands/k8s.js";
import * as apiModule from "../api.js";

describe("Kubernetes commands", () => {
  const originalEnv = process.env.HYPERSTACK_API_KEY;

  beforeEach(() => {
    delete process.env.HYPERSTACK_API_KEY;
    process.env.HYPERSTACK_API_KEY = "test-key";
    vi.restoreAllMocks();
  });

  afterAll(() => {
    if (originalEnv !== undefined) {
      process.env.HYPERSTACK_API_KEY = originalEnv;
    } else {
      delete process.env.HYPERSTACK_API_KEY;
    }
  });

  describe("listClusters", () => {
    it("displays clusters from API response", async () => {
      const mockData = [
        { id: "k8s-1", name: "ml-cluster", status: "running", region: "us-1", kubernetes_version: "1.30", node_count: 3 },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await k8sCommands.listClusters();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("createCluster", () => {
    it("calls API with correct body", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "k8s-new" });
      await k8sCommands.createCluster({ name: "new-cluster", nodeCount: 5, region: "ca-1" });

      expect(apiSpy).toHaveBeenCalledWith(
        "/core/clusters",
        "POST",
        expect.objectContaining({ name: "new-cluster", node_count: 5, region: "ca-1" })
      );
    });
  });

  describe("deleteCluster", () => {
    it("calls API with DELETE method", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({});
      await k8sCommands.deleteCluster("k8s-123");

      expect(apiSpy).toHaveBeenCalledWith("/core/clusters/k8s-123", "DELETE");
    });
  });
});
