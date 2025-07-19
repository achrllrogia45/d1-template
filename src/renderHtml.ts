
type Log = {
  id?: number;
  timestamp?: string;
  level?: string;
  message?: string;
  [key: string]: any;
};

export function renderHtml(logs: Log[]): string {
  function formatTimestamp(ts: string | number | undefined): string {
    if (!ts) return '';
    if (typeof ts === 'number' || /^\d+$/.test(ts)) {
      return new Date(Number(ts)).toLocaleString();
    }
    return new Date(ts).toLocaleString();
  }

  // Escape HTML special characters to prevent XSS
  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Logflare Logs UI</title>
        <style>
          body {
            background: #23272e;
            color: #e0e0e0;
            font-family: 'Fira Mono', 'Consolas', monospace;
            margin: 0;
            padding: 0;
          }
          .logs-list {
            width: 95vw;
            max-width: 1200px;
            margin: 2rem auto;
          }
          .log-row {
            background: #181a20;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px #0002;
            overflow: hidden;
            border: 1px solid #333;
          }
          .log-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            background: #23272e;
            font-family: 'Fira Mono', 'Consolas', monospace;
            font-size: 1.05rem;
            border-bottom: 1px solid #333;
          }
          .log-ts {
            background: #1abc9c;
            color: #23272e;
            border-radius: 4px;
            padding: 0.2rem 0.7rem;
            font-size: 0.95rem;
            font-weight: bold;
            margin-right: 0.5rem;
            white-space: nowrap;
          }
          .log-msg {
            flex: 1;
            color: #e0e0e0;
            font-family: inherit;
            font-size: 1.08rem;
            word-break: break-all;
          }
          .accordion-btn {
            background: #23272e;
            color: #ff69b4;
            border: 2px dashed #ff69b4;
            border-radius: 6px;
            padding: 0.2rem 0.8rem;
            font-family: inherit;
            font-size: 0.95rem;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
          }
          .accordion-btn:hover {
            background: #ff69b4;
            color: #23272e;
          }
          .log-body {
            display: none;
            background: #101216;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            color: #e0e0e0;
            border-top: 1px solid #333;
            overflow-x: auto;
          }
          .log-row.open .log-body {
            display: block;
          }
          .log-row.empty {
            text-align: center;
            color: #888;
            padding: 2rem;
            background: #23272e;
          }
        </style>
        <script>
          function toggleAccordion(id) {
            var row = document.getElementById(id).parentElement;
            if (row.classList.contains('open')) {
              row.classList.remove('open');
            } else {
              row.classList.add('open');
            }
          }
        </script>
      </head>
      <body>
        <header>
          <h1>Logflare-style Logs</h1>
        </header>
        <main>
          <div class="logs-list">
            ${logs.length === 0 ? `<div class="log-row empty">No logs found.</div>` :
              logs.map((log, i) => {
                const eventMsg = log.event_message || log.message || '';
                const ts = formatTimestamp(log.timestamp);
                const json = JSON.stringify(log, null, 2);
                return `
                  <div class="log-row">
                    <div class="log-header">
                      <span class="log-ts">${ts}</span>
                      <span class="log-msg">${eventMsg}</span>
                      <button class="accordion-btn" onclick="toggleAccordion('log-${i}')">event body</button>
                    </div>
                    <div class="log-body" id="log-${i}">
                      <pre>${escapeHtml(json)}</pre>
                    </div>
                  </div>
                `;
              }).join('')
            }
          </div>
        </main>
      </body>
    </html>
  `;
}
