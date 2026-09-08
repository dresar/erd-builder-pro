import { prisma } from "../../lib/prisma.js";
import { safeAiBaseUrl } from "../../lib/ai-security.js";
import { isProtectedAiApiKey, protectAiApiKey, revealAiApiKey } from "../../lib/ai-credentials.js";

/**
 * Resolve AI provider config when no apiKey is provided inline.
 * Returns resolved apiKey, baseUrl, model, and providerCode.
 */
export async function resolveAiConfig(params: {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  userId?: string;
  providerCode?: string;
}): Promise<{
  apiKey: string;
  baseUrl: string;
  model: string;
  providerCode?: string;
}> {
  let { apiKey, baseUrl, model, userId, providerCode } = params;

  if (!apiKey) {
    if (!prisma) {
      throw new Error("Database not configured on server");
    }

    let config: any = null;

    if (userId) {
      const where: any = {
        userId,
        isEnabled: true,
        selectedModelId: { not: null },
      };
      if (providerCode) where.provider = { code: providerCode };

      config = await prisma.userAiConfig.findFirst({
        where,
        include: { provider: true, selectedModel: true },
        orderBy: { updatedAt: "desc" },
      });
    }

    // Fallback: system-wide active config if user has no personal config or is in guest mode
    if (!config) {
      const fallbackWhere: any = {
        isEnabled: true,
        selectedModelId: { not: null },
      };
      if (providerCode) fallbackWhere.provider = { code: providerCode };

      config = await prisma.userAiConfig.findFirst({
        where: fallbackWhere,
        include: { provider: true, selectedModel: true },
        orderBy: { updatedAt: "desc" },
      });
    }

    if (!config) {
      throw new Error("No AI provider configured. Configure AI in Settings.");
    }

    if (!config.provider || config.provider.isActive !== true) {
      throw new Error("Selected AI provider is unavailable");
    }

    if (
      !config.selectedModel ||
      config.selectedModel.isActive !== true ||
      String(config.selectedModel.providerId) !== String(config.providerId)
    ) {
      const fallbackModel = await prisma.aiModel.findFirst({
        where: { providerId: config.providerId, isActive: true },
        orderBy: { id: "asc" },
      });
      if (fallbackModel) {
        config.selectedModel = fallbackModel;
      } else {
        throw new Error("Selected AI model is unavailable for this provider");
      }
    }

    const storedApiKey = config.apiKey;
    if (!storedApiKey) {
      throw new Error("AI API key is required");
    }

    apiKey = revealAiApiKey(storedApiKey);
    if (!isProtectedAiApiKey(storedApiKey)) {
      await prisma.userAiConfig.update({
        where: { id: config.id },
        data: { apiKey: protectAiApiKey(apiKey) },
      });
    }
    providerCode = config.provider.code;
    baseUrl = config.provider?.baseUrl || (providerCode === "gemini"
      ? "https://generativelanguage.googleapis.com/v1beta"
      : "https://9router.serverinka.cloud/v1");

    if (!model && config.selectedModel) {
      model = config.selectedModel.modelIdentifier;
    }
  }

  const cleanBaseUrl = (baseUrl || "").replace(/\/+$/, "");

  return {
    apiKey: apiKey!,
    baseUrl: await safeAiBaseUrl(cleanBaseUrl, providerCode === "gemini"
      ? "https://generativelanguage.googleapis.com/v1beta"
      : "https://9router.serverinka.cloud/v1"),
    model: model || (providerCode === "gemini" ? "gemini-1.5-flash" : "MY-COMBO"),
    providerCode,
  };
}

export function buildProxyUrl(
  baseUrl: string,
  providerCode?: string
): { fetchUrl: string; headers: Record<string, string> } {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  return { fetchUrl: "", headers };
}

export function getProxyFetchUrl(
  resolvedBaseUrl: string,
  isGemini: boolean
): string {
  const cleanBase = resolvedBaseUrl.replace(/\/+$/, "");
  if (isGemini) {
    return `${cleanBase}/openai/chat/completions`;
  }
  return `${cleanBase}/chat/completions`;
}
