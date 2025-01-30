import { logError } from '@/lib/monitoring';
import { encode } from 'gpt-3-encoder';

interface PromptTemplate {
  id: string;
  template: string;
  maxTokens: number;
  requiredVariables: string[];
}

export class PromptOptimizer {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.registerDefaultTemplates();
  }

  registerTemplate(template: PromptTemplate) {
    this.templates.set(template.id, template);
  }

  async optimizePrompt(templateId: string, variables: Record<string, any>): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Validate required variables
    this.validateVariables(template, variables);

    // Generate prompt from template
    let prompt = template.template;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(`{${key}}`, String(value));
    }

    // Optimize prompt
    prompt = await this.applyOptimizations(prompt, template.maxTokens);

    return prompt;
  }

  private validateVariables(template: PromptTemplate, variables: Record<string, any>) {
    const missingVars = template.requiredVariables.filter(
      var_ => !(var_ in variables)
    );

    if (missingVars.length > 0) {
      throw new Error(`Missing required variables: ${missingVars.join(', ')}`);
    }
  }

  private async applyOptimizations(prompt: string, maxTokens: number): Promise<string> {
    try {
      // Remove unnecessary whitespace
      prompt = prompt.replace(/\s+/g, ' ').trim();

      // Count tokens
      const tokens = encode(prompt);
      
      // Truncate if too long
      if (tokens.length > maxTokens) {
        prompt = this.truncateToTokenLimit(prompt, maxTokens);
      }

      // Add structural elements for better AI understanding
      prompt = this.addStructuralElements(prompt);

      return prompt;
    } catch (error) {
      logError(error as Error, { 
        context: 'Prompt Optimization',
        prompt
      });
      return prompt; // Return original prompt if optimization fails
    }
  }

  private truncateToTokenLimit(prompt: string, maxTokens: number): string {
    const tokens = encode(prompt);
    if (tokens.length <= maxTokens) return prompt;

    // Try to truncate at sentence boundaries
    const sentences = prompt.match(/[^.!?]+[.!?]+/g) || [];
    let result = '';
    let currentTokens = 0;

    for (const sentence of sentences) {
      const sentenceTokens = encode(sentence);
      if (currentTokens + sentenceTokens.length > maxTokens) break;
      result += sentence;
      currentTokens += sentenceTokens.length;
    }

    return result || prompt.slice(0, maxTokens * 4); // Fallback to character-based truncation
  }

  private addStructuralElements(prompt: string): string {
    // Add clear section markers
    if (!prompt.includes('Context:')) {
      prompt = `Context: ${prompt}`;
    }

    // Add explicit instruction marker
    if (!prompt.includes('Task:')) {
      prompt += '\nTask: Analyze the above context and provide insights.';
    }

    // Add format specification if needed
    if (!prompt.includes('Format:')) {
      prompt += '\nFormat: Provide your response in clear, concise paragraphs.';
    }

    return prompt;
  }

  private registerDefaultTemplates() {
    this.registerTemplate({
      id: 'journal-analysis',
      template: `Context: The following is a journal entry written by a user:
{content}

Task: Analyze this entry for:
1. Emotional state and sentiment
2. Key themes and topics
3. Potential areas for personal growth

Format: Provide your analysis in the following structure:
- Emotional Analysis
- Key Themes
- Growth Opportunities`,
      maxTokens: 2048,
      requiredVariables: ['content']
    });

    this.registerTemplate({
      id: 'theme-extraction',
      template: `Context: Analyze the following text for recurring themes:
{text}

Task: Identify and explain the main themes present in the text.

Format: List each theme with a brief explanation of its significance.`,
      maxTokens: 1024,
      requiredVariables: ['text']
    });
  }
}
