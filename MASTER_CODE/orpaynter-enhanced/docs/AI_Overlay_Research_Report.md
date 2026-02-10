# Research Report: AI Overlay Orchestration System

## 1. Executive Summary
The "Modern Orchestrator of Orchestrators" is positioned to solve the "Day 2" problems of AI adoption: management, scaling, and integration. While many tools handle model training ("Day 0") or initial deployment ("Day 1"), few offer a cohesive platform for orchestrating **intelligent overlays** across an enterprise's existing application landscape.

This report validates the technical feasibility of using **Kubernetes (K8s)** and **Service Mesh (Istio)** to create a universal control plane that injects AI capabilities into legacy systems without requiring code rewrites.

## 2. Competitor Analysis

| Feature | **KServe** | **Seldon Core** | **BentoML** | **AWS SageMaker** | **Our Vision** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Focus** | Serverless Inference | Complex Pipelines | Dev Ease of Use | Managed Service | **Universal Overlay Orchestration** |
| **A/B Testing** | Native (Canary) | Native (Shadow) | Manual Config | Native | **One-Click Visual Splitter** |
| **Legacy Overlay** | No (API Only) | No (API Only) | No (API Only) | No (API Only) | **Native DOM/API Injection** |
| **Scaling** | Knative (0-to-N) | K8s HPA | Yatai Service | Auto-Scaling | **Predictive Auto-Scaling** |
| **UX Complexity** | High (YAML hell) | High | Low | Medium | **"Apple-like" Simplicity** |

**Gap Analysis:**
*   Existing tools are "API-First". They serve an endpoint and expect the developer to wire it into the frontend.
*   **Our Opportunity:** Be "Overlay-First". Provide the SDKs and Injectors that make the AI *appear* in the host app automatically, managed by the central orchestrator.

## 3. Technical Architecture Recommendations

### A. The Control Plane (The "Brain")
*   **Technology:** Kubernetes Operator pattern.
*   **Role:** Manages the desired state of all AI Overlays.
*   **Key Component:** A custom CRD (Custom Resource Definition) called `AIOverlay`.
    ```yaml
    apiVersion: orchestrator.io/v1
    kind: AIOverlay
    metadata:
      name: salesforce-copilot
    spec:
      hostApp: "salesforce.com"
      models:
        - name: "gpt-4-turbo"
          weight: 80
        - name: "llama-3-local"
          weight: 20
      strategy: "Canary"
    ```

### B. The Data Plane (The "Nervous System")
*   **Technology:** Istio Service Mesh + Envoy Proxy.
*   **Role:** Intercepts traffic destined for the Host App (or API) and injects the AI processing.
*   **Traffic Splitting:** Istio `VirtualServices` allow us to route 20% of users to the "Llama-3" model transparently.

### C. The Overlay Injection (The "Face")
*   **Technique:** "Sidecar" pattern for APIs, and "Web Component" injection for UIs.
*   **Implementation:** A lightweight JavaScript SDK (`overlay.js`) running in the browser that communicates with the Control Plane to fetch the active configuration (which model? which UI elements to highlight?).

## 4. Feature Roadmap for "WOW" Factor

### Phase 1: The Foundation
*   **Universal Model Registry:** Upload/Link any model (HuggingFace, OpenAI Adapter).
*   **One-Click Deploy:** Deploy a model to a K8s endpoint with a public URL.

### Phase 2: The Orchestration
*   **Visual Traffic Splitter:** A slider UI to adjust A/B test weights (80/20 -> 50/50).
*   **Drift Detection Dashboard:** Alerts when the "Challenger" model output deviates from the "Champion".

### Phase 3: The Intelligent Overlay
*   **"Context Awareness":** The overlay automatically reads the screen content (DOM) of the host app to prompt the AI model relevantly.
*   **"Action Execution":** The AI Overlay can click buttons or fill forms in the Host App (Agentic behavior).

## 5. Conclusion
To achieve the mission, we must build **on top of K8s/Istio** but **hide it completely**. The user should see "Apps" and "Overlays," not "Pods" and "VirtualServices." This abstraction is the key differentiator.
