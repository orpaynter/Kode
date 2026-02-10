/**
 * OrPaynter AI Overlay SDK
 * Version: 1.0.0
 * 
 * This script is designed to be injected into legacy "Host Apps" (e.g., Salesforce, SAP, Custom CRMs).
 * It connects to the OrPaynter Orchestrator Control Plane to determine which AI model to use
 * and renders a "Context-Aware" overlay on top of the host application.
 */

(function() {
    console.log("🚀 OrPaynter Overlay SDK Initializing...");

    const ORCHESTRATOR_API = 'http://localhost:5000/api/orchestrator';

    class OrPaynterOverlay {
        constructor() {
            this.config = null;
            this.activeModel = null;
            this.hostAppName = document.title; // Simple heuristic for host app detection
            this.container = null;
            this.shadowRoot = null;
        }

        async init() {
            try {
                await this.fetchConfiguration();
                this.determineActiveModel();
                this.injectUI();
                this.startContextScanner();
            } catch (error) {
                console.error("❌ OrPaynter Overlay Error:", error);
            }
        }

        async fetchConfiguration() {
            console.log("📡 Contacting Orchestrator Control Plane...");
            const response = await fetch(`${ORCHESTRATOR_API}/overlays`);
            const data = await response.json();
            
            // Find config for this "Host App" (Simulated matching)
            // In production, this would match domain name or API key
            this.config = data.overlays.find(o => 
                this.hostAppName.includes(o.host_app) || 
                o.host_app === 'Salesforce CRM' // Default fallback for demo
            );

            if (!this.config) {
                throw new Error(`No overlay configuration found for host: ${this.hostAppName}`);
            }

            console.log("✅ Configuration Loaded:", this.config);
        }

        determineActiveModel() {
            // Client-side Traffic Splitting (Phase 2 Feature)
            // Logic: Random number 0-100 vs cumulative weights
            const rand = Math.random() * 100;
            let cumulative = 0;
            
            for (const split of this.config.traffic_split) {
                cumulative += split.weight;
                if (rand <= cumulative) {
                    this.activeModel = split.model;
                    break;
                }
            }

            if (!this.activeModel) {
                // Fallback to first model if math fails
                this.activeModel = this.config.traffic_split[0].model;
            }

            console.log(`⚖️ Traffic Split Decision: User routed to [${this.activeModel.name}]`);
        }

        injectUI() {
            // Create container
            this.container = document.createElement('div');
            this.container.id = 'orpaynter-overlay-root';
            this.container.style.position = 'fixed';
            this.container.style.bottom = '20px';
            this.container.style.right = '20px';
            this.container.style.zIndex = '99999';
            
            // Attach Shadow DOM to isolate styles from Host App
            this.shadowRoot = this.container.attachShadow({ mode: 'open' });
            
            // Render content
            const style = `
                .card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    width: 350px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    overflow: hidden;
                }
                .header {
                    background: #2563eb;
                    color: white;
                    padding: 12px 16px;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .model-badge {
                    background: rgba(255,255,255,0.2);
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                }
                .content {
                    padding: 16px;
                    min-height: 100px;
                    color: #475569;
                    font-size: 14px;
                }
                .context-box {
                    background: #f1f5f9;
                    border-radius: 6px;
                    padding: 8px;
                    margin-top: 10px;
                    font-size: 12px;
                    border-left: 3px solid #2563eb;
                }
                .btn {
                    width: 100%;
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    margin-top: 12px;
                    cursor: pointer;
                    font-weight: 500;
                }
                .btn:hover { background: #1d4ed8; }
            `;

            this.shadowRoot.innerHTML = `
                <style>${style}</style>
                <div class="card">
                    <div class="header">
                        <span>OrPaynter Copilot</span>
                        <span class="model-badge">${this.activeModel.name}</span>
                    </div>
                    <div class="content">
                        <p>Hello! I am your AI assistant for <strong>${this.config.host_app}</strong>.</p>
                        <div id="context-display" class="context-box">
                            Scanning page context...
                        </div>
                        <button class="btn" id="analyze-btn">Analyze This Record</button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.container);

            // Bind Events
            this.shadowRoot.getElementById('analyze-btn').addEventListener('click', () => {
                alert(`Sending context to ${this.activeModel.name} (Latency: ${this.activeModel.latency_ms}ms)`);
            });
        }

        startContextScanner() {
            console.log("👀 Context Awareness: Scanning DOM...");
            
            // Simple Observer: Watch for title changes or specific CRM fields
            // In a real app, this would use MutationObserver on specific #ids
            
            const updateContext = () => {
                // Heuristic: Grab the first H1 or title
                const pageTitle = document.title;
                const mainHeader = document.querySelector('h1')?.innerText || "No Header Found";
                
                // Update Shadow DOM UI
                const display = this.shadowRoot.getElementById('context-display');
                if (display) {
                    display.innerHTML = `
                        <strong>Context Detected:</strong><br>
                        Page: ${pageTitle}<br>
                        Record: ${mainHeader}
                    `;
                }
            };

            // Initial Scan
            updateContext();

            // Watch for DOM changes (Simulating Single Page App navigation)
            const observer = new MutationObserver(() => {
                updateContext();
            });

            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
        }
    }

    // Initialize
    window.OrPaynter = new OrPaynterOverlay();
    window.OrPaynter.init();

})();
