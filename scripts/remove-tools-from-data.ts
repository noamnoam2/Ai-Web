import * as fs from 'fs';
import * as path from 'path';

const toolsToRemove = [
  'deepbrain-ai',
  'greenscreen-ai',
  'lumeflow',
  'cutlabs',
  'peech',
  'vlognow-ai',
  'autocut',
  'autoreframe',
  'filmforge',
  'dreamstudio',
  'pixelcut',
  'imgupscaler',
  'lensa',
  'sketch2code',
  'paintschainer',
  'glyphr-ai',
  'storyboard-ai',
  'animegan',
  'waifu-diffusion',
  'human-generator-ai',
  'outfit-ai',
  'growthbar',
  'writesparkle',
  'quicklines',
  'mailmaestro',
  'thread-creator-ai',
  'reels-script-ai',
  'tiktok-script-ai',
  'story-generator-ai',
  'roleplay-ai',
  'openvoice',
  'plot-generator-ai',
  'tuneflow',
  'ai-singer',
  'openassistant',
  'voiceover-ai',
  'mutable-ai',
  'voice-cloning-ai',
  'narration-ai',
  'hr-ai',
  'swapface',
  'invokeai',
  'wonder-studio',
  'magic-eraser-ai',
  'playvoice',
  'voicecraft',
  'echolabs',
  'musiclm',
  'aiscout',
  'ailist',
  'zebra-medical-vision',
  'ai-hunter',
  'fireworks-ai',
  'power-bi-ai',
  'rephrase-ai'
];

const filePath = path.join(__dirname, 'all-tools-data.ts');
let content = fs.readFileSync(filePath, 'utf-8');

let removedCount = 0;

// Remove each tool by finding its object definition
for (const slug of toolsToRemove) {
  // Match the entire tool object: from { to }, including nested objects
  const regex = new RegExp(
    `\\s*\\{[^}]*slug:\\s*['"]${slug}['"][^}]*\\},?\\s*`,
    'gs'
  );
  
  const before = content.length;
  content = content.replace(regex, '');
  const after = content.length;
  
  if (before !== after) {
    removedCount++;
    console.log(`✓ Removed: ${slug}`);
  } else {
    console.log(`⚠️  Not found: ${slug}`);
  }
}

// Clean up any double commas or extra whitespace
content = content.replace(/,\s*,/g, ',');
content = content.replace(/,\s*}/g, '}');
content = content.replace(/,\s*\]/g, ']');

fs.writeFileSync(filePath, content, 'utf-8');

console.log(`\n✅ Removed ${removedCount} tools from all-tools-data.ts`);
