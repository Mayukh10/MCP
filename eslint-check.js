// This script will help manually check for ESLint warnings
// To use: node eslint-check.js

const fs = require('fs');
const path = require('path');

// Common ESLint warnings we want to check
const warningPatterns = [
  { pattern: /const (\w+) = [^;]+ .*/, description: 'Unused variable', check: (file, match) => {
    // Check if the variable is used later in the file
    const content = fs.readFileSync(file, 'utf8');
    const varName = match[1];
    // Count occurrences of the variable name (more than 1 means it's used)
    const regex = new RegExp(`\\b${varName}\\b`, 'g');
    return (content.match(regex) || []).length <= 1;
  }},
  { pattern: /useEffect\(\(\) => {[\s\S]*?}, \[(.*?)\]\);/, description: 'Missing dependencies in useEffect', check: (file, match) => {
    // Extract the callback function body
    const content = fs.readFileSync(file, 'utf8');
    const effectMatch = /useEffect\(\(\) => {([\s\S]*?)}, \[(.*?)\]\);/.exec(content);
    if (!effectMatch) return false;
    
    const effectBody = effectMatch[1];
    const dependencies = effectMatch[2].split(',').map(d => d.trim());
    
    // Check for common hooks and state variables in the effect body
    const stateSetters = effectBody.match(/set\w+\(/g) || [];
    const stateSetterNames = stateSetters.map(s => s.slice(0, -1)); // Remove the opening parenthesis
    
    // Check if any setters are missing from dependencies
    return stateSetterNames.some(setter => !dependencies.includes(setter));
  }}
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      callback(fullPath);
    }
  });
}

console.log('Checking for potential ESLint warnings...');

const warnings = [];

walkDir('./frontend/src', file => {
  const content = fs.readFileSync(file, 'utf8');
  
  warningPatterns.forEach(({ pattern, description, check }) => {
    const matches = content.match(pattern);
    if (matches && check(file, matches)) {
      warnings.push({
        file,
        description,
        match: matches[0]
      });
    }
  });
});

if (warnings.length === 0) {
  console.log('No potential ESLint warnings found!');
} else {
  console.log(`Found ${warnings.length} potential ESLint warnings:`);
  warnings.forEach(warning => {
    console.log(`\nFile: ${warning.file}`);
    console.log(`Warning: ${warning.description}`);
    console.log(`Code: ${warning.match}`);
  });
} 