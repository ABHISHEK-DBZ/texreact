import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-verilog';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

export function highlightCode(code: string, language: string = 'python'): string {
  const normalizedLang = language.toLowerCase().trim();
  let grammar = Prism.languages[normalizedLang];
  
  if (!grammar) {
    if (normalizedLang === 'py') grammar = Prism.languages.python;
    else if (normalizedLang === 'c++') grammar = Prism.languages.cpp;
    else if (normalizedLang === 'v' || normalizedLang === 'sv') grammar = Prism.languages.verilog;
    else if (normalizedLang === 'js') grammar = Prism.languages.javascript;
    else if (normalizedLang === 'ts') grammar = Prism.languages.typescript;
    else grammar = Prism.languages.plain || Prism.languages.clike;
  }

  if (!grammar) {
    return escapeHtml(code);
  }

  try {
    return Prism.highlight(code, grammar, normalizedLang);
  } catch {
    return escapeHtml(code);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
