import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chunk, translateBatch } from "./translate.server";

const Input = z.object({ strings: z.array(z.string().min(1)).min(1).max(400) });

export const translateStrings = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("LOVABLE_API_KEY manquante");

    const dictionary: Record<string, string> = {};
    for (const batch of chunk(data.strings, 25)) {
      Object.assign(dictionary, await translateBatch(batch, apiKey));
    }
    return { dictionary };
  });
