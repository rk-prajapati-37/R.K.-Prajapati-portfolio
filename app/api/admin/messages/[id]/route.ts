import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: any) {
  try {
    // `context.params` can be a plain object or a Promise depending on Next version/runtime
    let id: string | undefined;
    if (context && context.params) {
      if (typeof context.params.then === "function") {
        const p = await context.params;
        id = p?.id;
      } else {
        id = context.params.id;
      }
    }

    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Missing id" }), { status: 400 });
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/contact/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    return new NextResponse(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Proxy delete error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
