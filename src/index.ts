
import { renderHtml } from "./renderHtml";

  async fetch(request, env) {
    // Fetch logs from the logs table (assume fields: id, timestamp, level, message)
    const stmt = env.DB.prepare("SELECT id, timestamp, level, message FROM logs ORDER BY timestamp DESC LIMIT 100");
    const { results } = await stmt.all();

    return new Response(renderHtml(results), {
      headers: {
        "content-type": "text/html",
      },
    });
  },
} satisfies ExportedHandler<Env>;
