import { getControlPlaneGovernanceSection } from './controlPlaneGovernance';
import { getControlPlaneArchitectureSection } from './controlPlaneArchitecture';

export function getAiEngineeringControlPlaneSection(projectName: string, domain: string, techStack: string): string {
  const proj = projectName.trim() || 'Sistem Enterprise';
  const dom = domain.trim() || 'SaaS Multi-Tenant';

  return `=======================================================================
[SECTION: AI ENGINEERING CONTROL PLANE (20 CORE GOVERNANCE PROTOCOLS)]
=======================================================================
Every AI Agent (Claude Code CLI, ChatGPT, Cursor, Windsurf, Antigravity) executing this project
is governed by the following authoritative 20-protocol AI Engineering Control Plane:

${getControlPlaneGovernanceSection(proj, dom)}

${getControlPlaneArchitectureSection(proj, dom)}
`;
}
