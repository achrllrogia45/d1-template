
import { renderHtml } from "./renderHtml";

export default {
  async fetch(_request: Request, env: { DB: any }) {
    // Fetch logs from the logs table (assume fields: id, timestamp, level, message)
    const stmt = env.DB.prepare("SELECT id, timestamp, event_message, message FROM logs ORDER BY timestamp DESC LIMIT 100");
    const { results } = await stmt.all();

    return new Response(renderHtml(results), {
      headers: {
        "content-type": "text/html",
      },
    });
  }
};
