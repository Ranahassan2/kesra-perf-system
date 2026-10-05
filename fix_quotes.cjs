const fs = require('fs');
const file = '/home/beta-technology/Music/perf-system-final/src/components/EvaluationFormModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// Fix single quotes introduced by script
code = code.replace(/>\s*'([^']+)'\s*</g, ">$1<");
code = code.replace(/\{'([^']+)'\}/g, "$1");

// Remove translation object dependencies to force english
code = code.replace(/\{t\.[a-zA-Z0-9_]+ \|\| '([^']+)'\}/g, "$1");

fs.writeFileSync(file, code);
console.log('done fixing quotes');
