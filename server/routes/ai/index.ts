import { Router } from "express";
import { validate, aiProxySchema } from "../../lib/validation.js";
import { proxy } from "./controller.js";
import { readUrlToMarkdown } from "./urlReaderService.js";

const router = Router();

// NOTE: No auth middleware here — guest mode sends requests without a session cookie.
// Abuse is mitigated by rate limiting applied in server/index.ts.
router.post("/proxy", validate(aiProxySchema), proxy);

router.post("/read-url", async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "URL wajib diisi" });
    return;
  }

  try {
    const result = await readUrlToMarkdown(url);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || "Gagal membaca URL" });
  }
});

export default router;
