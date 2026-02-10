# Edge Software Solution Analysis & Recommendation
## For OrPaynter (Supabase + MCP Integration)

### Executive Summary
To enable offline-first capabilities, local data processing, and seamless synchronization for the OrPaynter platform, we evaluated three leading edge software solutions. **PowerSync** is the recommended solution due to its native compatibility with Supabase, robust offline SQL support, and ability to be self-hosted on Microsoft Azure (MCP), meeting all compliance and performance requirements.

---

### 1. Candidate Evaluation

#### Option A: PowerSync (Recommended)
PowerSync is a sync engine specifically designed to layer between Postgres (Supabase) and client-side SQLite databases.

*   **Supabase Compatibility:** Native. Uses Supabase's logical replication stream to sync data instantly.
*   **Offline Data Sync:** Excellent. Provides a local SQLite database that syncs automatically when online.
*   **Local Processing:** High. Runs full SQL queries on the device (Edge).
*   **MCP Integration:** The PowerSync Service (Docker container) can be hosted on **Azure Container Apps** or **Azure Kubernetes Service (AKS)**, keeping data governance within the user's Azure tenant.
*   **Cost:** Free tier available; Enterprise self-hosting fits MCP billing models.

#### Option B: Azure IoT Edge
Microsoft's heavy-duty edge runtime for Linux/Windows gateways.

*   **Supabase Compatibility:** Low. Requires custom modules to talk to Supabase via REST/Realtime.
*   **Offline Data Sync:** Good (via Message Hub), but complex to wire into a React web frontend.
*   **Local Processing:** Excellent (runs Docker containers on edge).
*   **MCP Integration:** Native.
*   **Verdict:** Overkill for a web/mobile app. Best suited for industrial hardware (drones, factory sensors), not contractor iPads.

#### Option C: WatermelonDB / RxDB
Client-side databases with sync adapters.

*   **Supabase Compatibility:** Moderate. Requires writing custom "Pull/Push" replication endpoints.
*   **Offline Data Sync:** Good, but conflict resolution is often manual.
*   **Local Processing:** Good (NoSQL based).
*   **MCP Integration:** Agnostic. No server component required (serverless), but scaling sync logic on Azure Functions can be tricky.
*   **Verdict:** Good for simple apps, but lacks the relational integrity and "set it and forget it" sync of PowerSync.

---

### 2. Recommendation: PowerSync
**Justification:**
1.  **Architecture Fit:** OrPaynter uses Supabase (Postgres). PowerSync brings SQLite to the client, allowing the same relational data model to exist on the edge device.
2.  **Dev Experience:** It eliminates the need to write complex sync logic. You just write SQL.
3.  **Enterprise Ready:** The ability to self-host the sync service on Azure satisfies the MCP requirement for control and security.

---

### 3. Integration Plan

#### Phase 1: Azure (MCP) Deployment
1.  **Provision Azure Container App:** Deploy the `powersync-service` Docker image.
2.  **Network Security:** Configure Azure VNET to allow the PowerSync Service to connect to Supabase (Port 5432) and the Client (Port 80/443).
3.  **Connect to Supabase:** Provide the Supabase Connection String to the Azure Container.

#### Phase 2: Client Side (React)
1.  **Install SDKs:** `@powersync/web`, `@powersync/react`.
2.  **WASM Setup:** Configure Vite to serve the `worker` and `sqlite` WASM files.
3.  **Schema Definition:** Define the local SQLite schema (must match Supabase tables).
4.  **Auth Integration:** Pass the Supabase JWT to PowerSync for row-level security enforcement.

#### Phase 3: Data Flow
1.  **Read:** React Component -> `useQuery` (PowerSync) -> Local SQLite (Instant).
2.  **Write:** React Component -> `mutate` (PowerSync) -> Local SQLite -> Queue -> Background Sync -> Supabase.

---

### 4. Proof of Concept (PoC) Implementation Plan

**Objective:** Enable offline creation of "Damage Assessments" and sync when online.

**Steps:**
1.  **Dependencies:** Install PowerSync SDKs.
2.  **Configuration:** Create `src/lib/powersync.ts` to initialize the database.
3.  **Context:** Create `PowerSyncProvider` to wrap the app.
4.  **Schema:** Define a simple `assessments` table in local schema.
5.  **UI:** Update `DamageAssessment.tsx` to read/write from PowerSync instead of direct Supabase calls.
