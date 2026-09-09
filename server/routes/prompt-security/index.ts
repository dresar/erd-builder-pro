import { Router, Request, Response } from "express";
import { logger } from "../../lib/logger.js";

const router = Router();

interface SecurityFinding {
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  location: string;
  reason: string;
  recommendation: string;
}

const INJECTION_PATTERNS = [
  { pattern: /ignore (previous|all|your) (instruction|system|prompt)/i, type: "prompt_injection", severity: "critical" as const, reason: "Instruction override attempt detected" },
  { pattern: /forget (everything|your instructions|the above)/i, type: "prompt_injection", severity: "critical" as const, reason: "Memory wipe instruction detected" },
  { pattern: /you are now|pretend (you are|to be)|act as (an? )?unrestricted/i, type: "prompt_injection", severity: "high" as const, reason: "Role override / jailbreak pattern" },
  { pattern: /disregard (safety|your training|guidelines|rules)/i, type: "instruction_conflict", severity: "high" as const, reason: "Safety bypass instruction" },
  { pattern: /\bDAN\b|do anything now/i, type: "prompt_injection", severity: "critical" as const, reason: "DAN jailbreak pattern" },
];

const SECRET_PATTERNS = [
  { pattern: /sk-[a-zA-Z0-9]{20,}/g, type: "secret_exposure", severity: "critical" as const, reason: "OpenAI API key detected" },
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, type: "secret_exposure", severity: "critical" as const, reason: "GitHub personal access token detected" },
  { pattern: /AKIA[0-9A-Z]{16}/g, type: "secret_exposure", severity: "critical" as const, reason: "AWS access key detected" },
  { pattern: /AIza[0-9A-Za-z-_]{35}/g, type: "secret_exposure", severity: "critical" as const, reason: "Google API key detected" },
  { pattern: /[a-z0-9]{32}:[a-z0-9]{32}/i, type: "credential_leakage", severity: "high" as const, reason: "Possible credential pair (token:secret)" },
  { pattern: /password\s*[=:]\s*[^\s\n]{8,}/i, type: "credential_leakage", severity: "high" as const, reason: "Hardcoded password detected" },
  { pattern: /private[_-]?key|secret[_-]?key/i, type: "secret_exposure", severity: "medium" as const, reason: "Private/secret key reference" },
];

const UNSAFE_PATTERNS = [
  { pattern: /exec\s*\(|shell\s*\(|system\s*\(|spawn\s*\(/i, type: "unsafe_tool_instruction", severity: "high" as const, reason: "Shell execution instruction" },
  { pattern: /rm\s+-rf|del\s+\/[sf]/i, type: "unsafe_tool_instruction", severity: "critical" as const, reason: "Destructive filesystem command" },
  { pattern: /curl\s+.*\|\s*bash|wget\s+.*\|\s*sh/i, type: "unsafe_tool_instruction", severity: "critical" as const, reason: "Remote code execution via pipe" },
  { pattern: /sudo\s|chmod\s+777|chown\s+root/i, type: "privilege_escalation", severity: "high" as const, reason: "Privilege escalation command" },
];

function scanText(text: string, context: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const lines = text.split("\n");

  for (const { pattern, type, severity, reason } of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      const lineNum = lines.findIndex(l => pattern.test(l));
      findings.push({ severity, type, location: context + (lineNum >= 0 ? ":L" + (lineNum + 1) : ""), reason, recommendation: "Remove or rephrase this instruction. Use guardrails instead of instruction overrides." });
    }
  }

  for (const { pattern, type, severity, reason } of SECRET_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({ severity, type, location: context, reason, recommendation: "Remove the secret from prompt text. Use environment variables or secure vaults." });
    }
  }

  for (const { pattern, type, severity, reason } of UNSAFE_PATTERNS) {
    if (pattern.test(text)) {
      findings.push({ severity, type, location: context, reason, recommendation: "Remove unsafe command instructions. Use sandboxed tool definitions instead." });
    }
  }

  return findings;
}

router.post("/scan", (req: Request, res: Response): void => {
  const { promptText, systemPrompt } = req.body;
  if (!promptText && !systemPrompt) {
    res.status(400).json({ error: "promptText or systemPrompt is required" });
    return;
  }

  try {
    const findings: SecurityFinding[] = [];
    if (promptText) findings.push(...scanText(promptText, "user_prompt"));
    if (systemPrompt) findings.push(...scanText(systemPrompt, "system_prompt"));

    const byBySeverity = {
      critical: findings.filter(f => f.severity === "critical"),
      high: findings.filter(f => f.severity === "high"),
      medium: findings.filter(f => f.severity === "medium"),
      low: findings.filter(f => f.severity === "low"),
    };

    const riskLevel = byBySeverity.critical.length > 0 ? "critical"
      : byBySeverity.high.length > 0 ? "high"
      : byBySeverity.medium.length > 0 ? "medium"
      : findings.length > 0 ? "low" : "safe";

    res.json({
      riskLevel,
      totalFindings: findings.length,
      findings,
      summary: {
        critical: byBySeverity.critical.length,
        high: byBySeverity.high.length,
        medium: byBySeverity.medium.length,
        low: byBySeverity.low.length,
      },
    });
  } catch (err: any) {
    logger.error({ err }, "Security scan error");
    res.status(500).json({ error: "Scan failed" });
  }
});

export default router;