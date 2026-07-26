const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-obsidian/60': 'bg-white/80 dark:bg-obsidian/60',
  'bg-obsidian': 'bg-white dark:bg-obsidian',
  'text-white/60': 'text-slate-600 dark:text-white/60',
  'text-white/80': 'text-slate-700 dark:text-white/80',
  'text-white/50': 'text-slate-500 dark:text-white/50',
  'hover:text-white/80': 'hover:text-slate-900 dark:hover:text-white/80',
  'hover:text-white': 'hover:text-slate-900 dark:hover:text-white',
  'text-white': 'text-slate-900 dark:text-white',
  'hover:bg-white/5': 'hover:bg-slate-100 dark:hover:bg-white/5',
  'bg-white/5': 'bg-slate-100 dark:bg-white/5',
  'hover:bg-white/10': 'hover:bg-slate-200 dark:hover:bg-white/10',
  'bg-white/10': 'bg-slate-200 dark:bg-white/10',
  'border-white/5': 'border-slate-200 dark:border-white/5',
  'border-white/10': 'border-slate-300 dark:border-white/10',
  'border-slate-700/50': 'border-slate-300 dark:border-slate-700/50',
  'bg-black/20': 'bg-slate-50 dark:bg-black/20',
  'bg-black/40': 'bg-slate-900/20 dark:bg-black/40',
  'bg-black/90': 'bg-slate-900/40 dark:bg-black/90',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const [oldClass, newClass] of Object.entries(replacements)) {
    content = content.split('"' + oldClass + '"').join('"' + newClass + '"');
    content = content.split(' ' + oldClass + ' ').join(' ' + newClass + ' ');
    content = content.split('"' + oldClass + ' ').join('"' + newClass + ' ');
    content = content.split(' ' + oldClass + '"').join(' ' + newClass + '"');
  }
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

walkDir('d:/potfolio/src/components');
