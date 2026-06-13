const GRAPH_API = "https://graph.facebook.com/v22.0";

export async function sendInstagramMessage(recipientId: string, text: string): Promise<void> {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) throw new Error("META_PAGE_ACCESS_TOKEN is not set");

  const res = await fetch(`${GRAPH_API}/me/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`);
  }
}
