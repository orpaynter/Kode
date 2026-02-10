# Research Rubric: AI Overlay Orchestration System

This rubric defines the criteria and questions necessary to gather high-quality, actionable data for developing the "Modern Orchestrator of Orchestrators" platform.

## 1. Target Audience Analysis
*   **Primary Persona:** The MLOps Engineer / Platform Architect.
    *   *Key Question:* What is their biggest pain point in managing multi-model deployments? (e.g., Version hell, resource contention, lack of visibility?)
*   **Secondary Persona:** The Enterprise Product Manager.
    *   *Key Question:* How do they measure the ROI of an AI feature? (e.g., User engagement, time saved, error reduction?)
*   **Tertiary Persona:** The Data Scientist.
    *   *Key Question:* What friction prevents them from deploying models to production independently?

## 2. Competitor & Landscape Analysis
*   **Direct Competitors (Orchestration):**
    *   *Kubeflow / KServe:* Strengths in K8s native scaling. Weaknesses in UX complexity.
    *   *Seldon Core:* Advanced serving features. Complexity in setup.
    *   *BentoML:* Developer-friendly. Scaling challenges?
*   **Indirect Competitors (Overlays):**
    *   *Digital Adoption Platforms (WalkMe, Pendo):* How do they inject UI overlays? Can we borrow their "DOM Injection" techniques?
    *   *Browser Extensions:* How do they manage permissions and security?

## 3. Technical Requirements & Architecture
*   **Core Functionality:**
    *   *Versioning:* How to handle immutable model versions vs. live traffic?
    *   *A/B Testing:* What is the mechanism for traffic splitting? (Header-based? Cookie-based? Random?)
    *   *Resource Allocation:* How to enable "Fractional GPU" usage to reduce costs?
*   **The "Overlay" Mechanism:**
    *   *Architecture A (Proxy):* API Gateway intercepts requests and augments responses.
    *   *Architecture B (Agentic):* Client-side script injects UI elements into the host app.
    *   *Requirement:* Which approach minimizes latency and maximizes security?

## 4. User Experience (UX) for the "WOW" Factor
*   **Visualizing the Invisible:**
    *   How do we visualize the "Overlay" relationship between the AI model and the Host App?
    *   *Idea:* A topology map showing data flow and injection points.
*   **Simplicity:**
    *   Can a deployment be done in < 3 clicks?
    *   *Rubric:* Compare the "Time to First Hello World" across competitors.

## 5. Security & Governance
*   **Data Privacy:**
    *   How to ensure PII (Personally Identifiable Information) from the Host App is redacted before hitting the AI Model?
*   **Access Control:**
    *   RBAC (Role-Based Access Control) requirements for Enterprise clients.

## 6. Monetization Strategy
*   **Models:**
    *   *Consumption-based:* Charge per inference / token.
    *   *Seat-based:* Charge per developer / admin.
    *   *Overlay-based:* Charge per "Active Host Application".
