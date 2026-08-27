const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM = `You are a professional French-to-English translator specialised in product management résumés and portfolios.
Translate each string into natural, idiomatic professional English (US).
Rules:
- Keep meaning, tone and concision; do not add or remove information.
- Keep numbers, metrics, currencies, dates and units exactly as they are (€2M stays €2M, +40% stays +40%).
- Keep proper nouns, company names, product names and tool names unchanged.
- Use standard industry vocabulary (discovery, roadmap, onboarding, churn, A/B testing…).
- Preserve punctuation style and any leading/trailing whitespace.
- Never output explanations.`;

/** Translates a batch of strings; returns a source -> translation dictionary. */
export async function translateBatch(strings: string[], apiKey: string): Promise<Record<string, string>> {
  const payload = Object.fromEntries(strings.map((value, index) => [String(index), value]));

  const response = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model: "openai/gpt-5.4",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Translate every value of this JSON object from French to English. Reply with a JSON object using the exact same keys.\n\n${JSON.stringify(payload)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI translation failed [${response.status}]: ${body.slice(0, 400)}`);
  }

  const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty translation response");

  const parsed = JSON.parse(content) as Record<string, unknown>;
  const dictionary: Record<string, string> = {};
  strings.forEach((source, index) => {
    const value = parsed[String(index)];
    if (typeof value === "string" && value.trim()) dictionary[source] = value;
  });
  return dictionary;
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
