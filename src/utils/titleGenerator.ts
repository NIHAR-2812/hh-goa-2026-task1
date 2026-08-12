const prefixes = ['Pixel', 'API', 'Code', 'Vibe', 'Logic', 'Neon', 'Quantum', 'Cyber', 'Palm', 'Coconut'];
const midfixes = ['Wave', 'Cloud', 'Data', 'Interface', 'Stack', 'Beach', 'Sun', 'Ocean', 'Systems'];
const suffixes = ['Architect', 'Rider', 'Hacker', 'Surfer', 'Alchemist', 'Builder', 'Comber', 'Ninja', 'Explorer'];

const roleSpecific: Record<string, string[]> = {
  'frontend': ['Pixel Wave Architect', 'Interface Surfer', 'UI/UX Beachcomber'],
  'backend': ['API Wave Rider', 'Database Diver', 'Logic Alchemist'],
  'full stack': ['Full Stack Wave Surfer', 'End-to-End Explorer'],
  'ai': ['Machine Learning Beachcomber', 'Neural Net Surfer', 'AI Alchemist'],
  'designer': ['Visual Vibe Architect', 'Pixel Palm Hacker'],
};

export function generateTitle(role: string, _stack: string): string {
  const roleLower = role.toLowerCase();
  
  // Try to match role specifically
  for (const key of Object.keys(roleSpecific)) {
    if (roleLower.includes(key)) {
      const options = roleSpecific[key];
      return options[Math.floor(Math.random() * options.length)];
    }
  }

  // Fallback generic random title
  const pre = prefixes[Math.floor(Math.random() * prefixes.length)];
  const mid = midfixes[Math.floor(Math.random() * midfixes.length)];
  const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${pre} ${mid} ${suf}`;
}
