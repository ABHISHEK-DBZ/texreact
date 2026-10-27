import React from 'react';

// Reads a {...} group starting at or after pos, honoring nested braces.
function readGroup(text: string, pos: number): [string, number] | null {
  while (text[pos] === ' ') pos++;
  if (text[pos] !== '{') return null;
  let depth = 0;
  for (let i = pos; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) return [text.slice(pos + 1, i), i + 1];
  }
  return null;
}

// Replaces \cmd{...} with fn(args), keeping nested braces intact.
function replaceLatex(
  text: string,
  cmd: string,
  argc: number,
  fn: (...args: string[]) => string
): string {
  const token = `\\${cmd}`;
  let out = '';
  let i = 0;
  while (true) {
    const at = text.indexOf(token, i);
    if (at === -1) return out + text.slice(i);
    let pos = at + token.length;
    const args: string[] = [];
    let ok = true;
    for (let a = 0; a < argc; a++) {
      const group = readGroup(text, pos);
      if (!group) {
        ok = false;
        break;
      }
      args.push(group[0]);
      pos = group[1];
    }
    if (!ok) {
      out += text.slice(i, at + token.length);
      i = at + token.length;
      continue;
    }
    out += text.slice(i, at) + fn(...args);
    i = pos;
  }
}

// Converts raw LaTeX/Markdown-style markup into readable math typography.
function cleanMath(text: string): string {
  if (!text) return '';
  let s = text
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\mu_n/g, 'μₙ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\epsilon_\{ox\}/g, 'ε_ox')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\approx/g, '≈')
    .replace(/\\le(q)?(?![A-Za-z])/g, '≤')
    .replace(/\\ge(q)?(?![A-Za-z])/g, '≥')
    .replace(/\\ll/g, '≪')
    .replace(/\\gg/g, '≫')
    .replace(/\\times/g, '×')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\infty/g, '∞')
    .replace(/\\to/g, '→')
    .replace(/\\implies/g, '⇒')
    .replace(/\\,/g, '\u2009')
    .replace(/\\quad/g, '\u2003')
    .replace(/Q_bar/g, 'Q̅')
    .replace(/R_bar/g, 'R̅')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³');

  s = replaceLatex(s, 'frac', 2, (num, den) =>
    num === '1' && den === '2'
      ? '½'
      : /[+-]/.test(den)
        ? `(${num} / (${den}))`
        : `(${num} / ${den})`
  );
  s = replaceLatex(s, 'sqrt', 1, (x) => `√(${x})`);
  s = replaceLatex(s, 'bar', 1, (x) => `${x}̅`);
  s = replaceLatex(s, 'overline', 1, (x) => `${x}̅`);
  s = replaceLatex(s, 'text', 1, (x) => x);

  return s
    .replace(/\(\(([^()]+)\)\)/g, '($1)')
    .replace(/ {2,}/g, ' ')
    .replace(/\\/g, '');
}

interface MathTextProps {
  text?: string;
  className?: string;
}

// Renders V_out as V<sub>out</sub> and x^2 as x<sup>2</sup>.
export const MathText: React.FC<MathTextProps> = ({ text = '', className }) => {
  const cleaned = cleanMath(text);
  const nodes: React.ReactNode[] = [];
  const pattern =
    /(_\{([^}]*)\}|\^\{([^}]*)\}|_([A-Za-z0-9]+(?:,[A-Za-z0-9]+)?)|\^([0-9]+))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(cleaned)) !== null) {
    if (match.index > lastIndex) nodes.push(cleaned.slice(lastIndex, match.index));

    if (match[2] !== undefined) {
      nodes.push(<sub key={key++}>{match[2]}</sub>);
    } else if (match[3] !== undefined) {
      nodes.push(<sup key={key++}>{match[3]}</sup>);
    } else if (match[4] !== undefined) {
      nodes.push(<sub key={key++}>{match[4]}</sub>);
    } else if (match[5] !== undefined) {
      nodes.push(<sup key={key++}>{match[5]}</sup>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < cleaned.length) nodes.push(cleaned.slice(lastIndex));

  return <span className={className}>{nodes}</span>;
};
