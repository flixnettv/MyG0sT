import { getAvailableSkills } from './skills.js';

export function getMcpToolsDefinition() {
  return getAvailableSkills().map((skill) => ({
    type: 'function',
    function: {
      name: skill.name,
      description: skill.description,
      parameters: {
        type: 'object',
        properties: {
          input: { type: 'string', description: 'Tool input payload' }
        }
      }
    }
  }));
}
