import { allTools } from './all-tools-data';
import * as fs from 'fs';
import * as path from 'path';

// List of slugs to remove (tools without accessible images)
const slugsToRemove = [
  'deepbrain-ai',
  'rephrase-ai',
  'greenscreen-ai',
  'autocut',
  'lumeflow',
  'peech',
  'vlognow-ai',
  'cutlabs',
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
  'tiktok-script-ai',
  'reels-script-ai',
  'story-generator-ai',
  'roleplay-ai',
  'plot-generator-ai',
  'openvoice',
  'tuneflow',
  'voiceover-ai',
  'ai-singer',
  'voice-cloning-ai',
  'narration-ai',
  'mutable-ai',
  'hr-ai',
  'openassistant',
  'swapface',
  'wonder-studio',
  'invokeai',
  'magic-eraser-ai',
  'playvoice',
  'echolabs',
  'voicecraft',
  'musiclm',
  'fireworks-ai',
  'aiscout',
  'ailist',
  'ai-hunter',
  'power-bi-ai',
  'zebra-medical-vision',
];

// Filter out tools to remove
const filteredTools = allTools.filter(tool => !slugsToRemove.includes(tool.slug));

console.log(`Original tools: ${allTools.length}`);
console.log(`Tools to remove: ${slugsToRemove.length}`);
console.log(`Filtered tools: ${filteredTools.length}`);

// Read the file
const filePath = path.join(__dirname, 'all-tools-data.ts');
let fileContent = fs.readFileSync(filePath, 'utf-8');

// Remove each tool entry
for (const slug of slugsToRemove) {
  // Find the tool entry - it's between { and }, and may span multiple lines
  // We'll use a regex to match the entire tool object
  const toolRegex = new RegExp(
    `\\s*\\{[^}]*slug:\\s*['"]${slug}['"][^}]*\\},?\\s*`,
    'gs'
  );
  
  fileContent = fileContent.replace(toolRegex, '');
}

// Clean up double commas and empty lines
fileContent = fileContent.replace(/,\s*,/g, ',');
fileContent = fileContent.replace(/\n\s*\n\s*\n/g, '\n\n');

// Write back
fs.writeFileSync(filePath, fileContent, 'utf-8');

console.log('✓ Removed tools from all-tools-data.ts');
