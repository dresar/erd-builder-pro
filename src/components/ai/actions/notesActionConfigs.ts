import { AIAction } from './types';

export const notesActions: AIAction[] = [
  {
    id: 'notes-summarize',
    label: 'Ringkas',
    description: 'Ringkasan poin utama catatan.',
    icon: 'Summary',
    buildPrompt: (ctx) => {
      const content = ctx.content || '';
      const title = ctx.title || 'Untitled';
      return `Summarize this note titled "${title}" concisely (default 3 sentences, adjust length if the user specifies). Capture the main topic, key points, and conclusion. Return ONLY the summary without any preamble:\n\n${content.substring(0, 4000)}`;
    },
  },
  {
    id: 'notes-improve-grammar',
    label: 'Tata Bahasa',
    description: 'Perbaiki ejaan dan tata bahasa.',
    icon: 'Polish',
    buildPrompt: (ctx) => {
      const content = ctx.content || '';
      return `Improve the grammar, spelling, and clarity of this text. Preserve the original meaning and style. Respond with ONLY the corrected text, no preamble:\n\n${content.substring(0, 4000)}`;
    },
  },
  {
    id: 'notes-generate-docs',
    label: 'Dokumentasi',
    description: 'Format dokumentasi teknis rapi.',
    icon: 'Docs',
    buildPrompt: (ctx) => {
      const content = ctx.content || '';
      const title = ctx.title || 'Untitled';
      return `Reformat this note titled "${title}" as a well-structured technical documentation page. Use markdown headings, code blocks, tables, and bullet points where appropriate. Return ONLY the reformatted documentation without any preamble:\n\n${content.substring(0, 4000)}`;
    },
  },
];
