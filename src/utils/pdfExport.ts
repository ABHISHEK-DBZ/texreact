import { jsPDF } from 'jspdf';
import type { Experiment, Subject } from '../types';

export function exportExperimentPdf(experiment: Experiment, subject: Subject): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const renderHeaderFooter = () => {
    const pageNum = (doc as any).internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);

    // Running Header
    doc.text(`${subject.name} — Laboratory Reference Manual`, margin, 10);
    doc.line(margin, 12, pageWidth - margin, 12);

    // Running Footer
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(`StudyCode Hub | Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      cursorY = margin;
      renderHeaderFooter();
    }
  };

  renderHeaderFooter();

  // Document Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(20, 30, 50);
  const titleLines = doc.splitTextToSize(`Experiment ${experiment.expNumber}: ${experiment.title}`, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 6 + 2;

  // Metadata / Topic
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 100, 120);
  const metaText = `Subject: ${subject.name} | Topic: ${experiment.topic || 'General'} | Source Document: ${experiment.sourceReference?.docName || 'PDF Reference'}`;
  doc.text(metaText, margin, cursorY);
  cursorY += 6;
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 6;

  // 1. AIM
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('1. AIM & OBJECTIVE', margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const aimLines = doc.splitTextToSize(experiment.aim, contentWidth);
  doc.text(aimLines, margin, cursorY);
  cursorY += aimLines.length * 4.3 + 4;

  if (experiment.problemStatement) {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Problem Statement: ', margin, cursorY);
    doc.setFont('helvetica', 'normal');
    const psLines = doc.splitTextToSize(experiment.problemStatement, contentWidth - 30);
    doc.text(psLines, margin + 30, cursorY);
    cursorY += psLines.length * 4 + 3;
  }

  // 2. THEORY & GOVERNING EQUATIONS (if present)
  if (experiment.theory) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text('2. THEORY & FUNDAMENTAL PRINCIPLES', margin, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    // Clean markdown headings/bolding for PDF
    const cleanTheory = experiment.theory
      .replace(/###\s+/g, '\n[SECTION] ')
      .replace(/####\s+/g, '\n[SUBSECTION] ')
      .replace(/---/g, '\n')
      .replace(/\*\*/g, '')
      .replace(/\$\$/g, '')
      .replace(/\$/g, '');

    const tLines = doc.splitTextToSize(cleanTheory, contentWidth);
    tLines.forEach((tl: string) => {
      checkPageBreak(5);
      if (tl.startsWith('[SECTION] ')) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text(tl.replace('[SECTION] ', ''), margin, cursorY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
      } else if (tl.startsWith('[SUBSECTION] ')) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(tl.replace('[SUBSECTION] ', '▶ '), margin, cursorY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
      } else {
        doc.text(tl, margin, cursorY);
      }
      cursorY += 4.0;
    });
    cursorY += 4;
  }

  if (experiment.booleanExpression) {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text(`Governing Equation: ${experiment.booleanExpression}`, margin, cursorY);
    cursorY += 6;
  }

  // 3. PREREQUISITES
  if (experiment.prerequisites && experiment.prerequisites.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text('3. PREREQUISITES & KEY CONCEPTS', margin, cursorY);
    cursorY += 5;

    experiment.prerequisites.forEach((p) => {
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text(`• ${p.concept}:`, margin, cursorY);
      cursorY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const pLines = doc.splitTextToSize(p.explanation, contentWidth - 4);
      doc.text(pLines, margin + 4, cursorY);
      cursorY += pLines.length * 3.8 + 2;
    });
    cursorY += 3;
  }

  // 4. CIRCUIT COMPONENTS LIST (if present)
  if (experiment.componentsList && experiment.componentsList.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text('4. IDENTIFIED CIRCUIT COMPONENTS & SPICE SPECIFICATIONS', margin, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Designator', margin, cursorY);
    doc.text('Type', margin + 25, cursorY);
    doc.text('Value / Model', margin + 65, cursorY);
    doc.text('Circuit Role', margin + 115, cursorY);
    cursorY += 4;
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    experiment.componentsList.forEach((c) => {
      checkPageBreak(7);
      doc.text(c.designator, margin, cursorY);
      doc.text(c.component, margin + 25, cursorY);
      doc.text(c.value, margin + 65, cursorY);
      const roleLines = doc.splitTextToSize(c.description, contentWidth - 115);
      doc.text(roleLines[0] || '', margin + 115, cursorY);
      cursorY += 4.5;
    });
    cursorY += 3;
  }

  // 5. FUNCTIONAL TRUTH TABLE (if present)
  if (experiment.truthTable) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`5. ${experiment.truthTable.title || 'FUNCTIONAL TRUTH TABLE'}`, margin, cursorY);
    cursorY += 5;

    const colCount = experiment.truthTable.headers.length;
    const colWidth = contentWidth / colCount;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    experiment.truthTable.headers.forEach((h, i) => {
      doc.text(h, margin + i * colWidth, cursorY);
    });
    cursorY += 4;
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    experiment.truthTable.rows.forEach((r) => {
      checkPageBreak(7);
      r.forEach((cell, ci) => {
        const textStr = String(cell);
        doc.text(textStr.slice(0, 30), margin + ci * colWidth, cursorY);
      });
      cursorY += 4.5;
    });
    cursorY += 3;
  }

  // 6. SIMULATION SETUP & DIRECTIVES (if present)
  if (experiment.simulationSetup) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`6. SIMULATION SETUP & DIRECTIVES (${experiment.simulationSetup.software})`, margin, cursorY);
    cursorY += 5;

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129);
    experiment.simulationSetup.directives.forEach((d) => {
      checkPageBreak(6);
      doc.text(d, margin + 4, cursorY);
      cursorY += 4;
    });
    cursorY += 2;
  }

  // 7. WAVEFORM TRACE INTERPRETATION (if present)
  if (experiment.traceBreakdown && experiment.traceBreakdown.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text('7. SIGNAL-BY-SIGNAL WAVEFORM ANALYSIS', margin, cursorY);
    cursorY += 5;

    experiment.traceBreakdown.forEach((tr) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.text(`• ${tr.label} (${tr.color}):`, margin, cursorY);
      cursorY += 3.8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const bLines = doc.splitTextToSize(tr.behavior, contentWidth - 4);
      doc.text(bLines, margin + 4, cursorY);
      cursorY += bLines.length * 3.8 + 2;
    });
    cursorY += 3;
  }

  // 8. OBSERVATION TABLE (if present)
  if (experiment.observationTable) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`8. ${experiment.observationTable.title || 'OBSERVATION TABLE'}`, margin, cursorY);
    cursorY += 5;

    const colCount = experiment.observationTable.headers.length;
    const colWidth = contentWidth / colCount;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    experiment.observationTable.headers.forEach((h, i) => {
      doc.text(h.slice(0, 22), margin + i * colWidth, cursorY);
    });
    cursorY += 3.8;
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    experiment.observationTable.rows.forEach((r) => {
      checkPageBreak(6);
      r.forEach((cell, ci) => {
        doc.text(String(cell).slice(0, 24), margin + ci * colWidth, cursorY);
      });
      cursorY += 4.0;
    });
    cursorY += 3;
  }

  // 9. SOURCE CODE / NETLIST (if present)
  if (experiment.codeSnippets && experiment.codeSnippets.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`9. COMPLETE CODE / SPICE NETLIST (${experiment.codeSnippets[0].language.toUpperCase()})`, margin, cursorY);
    cursorY += 5;

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);

    const code = experiment.codeSnippets[0].code;
    const rawLines = code.split('\n');

    rawLines.forEach((line) => {
      checkPageBreak(5);
      doc.text(line.slice(0, 95), margin + 2, cursorY);
      cursorY += 3.6;
    });
    cursorY += 4;
  }

  // 10. VIVA VOCE QUESTIONS
  if (experiment.vivaQuestions && experiment.vivaQuestions.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text('10. VIVA VOCE QUESTIONS & EXPERT ANSWERS', margin, cursorY);
    cursorY += 5;

    experiment.vivaQuestions.forEach((v, vIdx) => {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      const qLines = doc.splitTextToSize(`Q${vIdx + 1}: ${v.question}`, contentWidth);
      doc.text(qLines, margin, cursorY);
      cursorY += qLines.length * 3.8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const aLines = doc.splitTextToSize(`Ans: ${v.answer}`, contentWidth - 4);
      doc.text(aLines, margin + 4, cursorY);
      cursorY += aLines.length * 3.8 + 2.5;
    });
    cursorY += 2;
  }

  // 11. RESULT & CONCLUSION
  if (experiment.result || experiment.conclusion) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text('11. RESULT & CONCLUSION', margin, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    if (experiment.result) {
      const rLines = doc.splitTextToSize(`Result: ${experiment.result}`, contentWidth);
      doc.text(rLines, margin, cursorY);
      cursorY += rLines.length * 4 + 2;
    }
    if (experiment.conclusion) {
      const concLines = doc.splitTextToSize(`Conclusion: ${experiment.conclusion}`, contentWidth);
      doc.text(concLines, margin, cursorY);
      cursorY += concLines.length * 4 + 2;
    }
  }

  // Save PDF
  const filename = `${subject.shortCode}_Exp_${experiment.expNumber}_StudyGuide.pdf`;
  doc.save(filename);
}

export function exportSubjectPdf(subject: Subject): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const renderHeaderFooter = () => {
    const pageNum = (doc as any).internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`${subject.name} — Complete Laboratory Study Guide`, margin, 10);
    doc.line(margin, 12, pageWidth - margin, 12);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(`StudyCode Hub | Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      cursorY = margin;
      renderHeaderFooter();
    }
  };

  // COVER PAGE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text(subject.name, margin, 70);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('Comprehensive Engineering Laboratory Handbook & Study Guide', margin, 80);

  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Complete verified collection of ${subject.experiments.length} experiments with circuit schematics, truth tables, simulation waveforms, and viva voce question bank.`, margin, 90, { maxWidth: contentWidth });

  doc.line(margin, 105, pageWidth - margin, 105);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('Table of Contents:', margin, 120);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  let tocY = 130;
  subject.experiments.forEach((exp) => {
    doc.text(`Exp ${exp.expNumber}: ${exp.title}`, margin + 5, tocY);
    tocY += 7;
  });

  // START EXPERIMENTS ON SUBSEQUENT PAGES
  subject.experiments.forEach((exp) => {
    doc.addPage();
    cursorY = margin;
    renderHeaderFooter();

    // Experiment Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`Exp ${exp.expNumber}: ${exp.title}`, margin, cursorY);
    cursorY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Topic: ${exp.topic || 'General'} | Source Reference: ${exp.sourceReference?.docName || 'Manual'}`, margin, cursorY);
    cursorY += 8;

    // Aim
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('AIM & OBJECTIVE:', margin, cursorY);
    cursorY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const aimLines = doc.splitTextToSize(exp.aim, contentWidth);
    doc.text(aimLines, margin, cursorY);
    cursorY += aimLines.length * 3.8 + 4;

    // Governing Equation
    if (exp.booleanExpression) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(79, 70, 229);
      doc.text(`Governing Equation: ${exp.booleanExpression}`, margin, cursorY);
      cursorY += 5;
    }

    // Truth Table (if applicable)
    if (exp.truthTable) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(exp.truthTable.title || 'TRUTH TABLE:', margin, cursorY);
      cursorY += 4;

      const colWidth = contentWidth / exp.truthTable.headers.length;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      exp.truthTable.headers.forEach((h, i) => doc.text(h, margin + i * colWidth, cursorY));
      cursorY += 3.5;
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      exp.truthTable.rows.forEach((r) => {
        checkPageBreak(5);
        r.forEach((cell, ci) => doc.text(String(cell).slice(0, 25), margin + ci * colWidth, cursorY));
        cursorY += 3.8;
      });
      cursorY += 3;
    }

    // SPICE Directives
    if (exp.simulationSetup) {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`SIMULATION SETUP (${exp.simulationSetup.software}):`, margin, cursorY);
      cursorY += 4;

      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(16, 185, 129);
      exp.simulationSetup.directives.forEach((d) => {
        checkPageBreak(5);
        doc.text(d, margin + 4, cursorY);
        cursorY += 3.5;
      });
      cursorY += 2;
    }

    // Code / Netlist Preview
    if (exp.codeSnippets && exp.codeSnippets.length > 0) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(`CODE / NETLIST (${exp.codeSnippets[0].language.toUpperCase()}):`, margin, cursorY);
      cursorY += 4.5;

      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);

      const codeLines = exp.codeSnippets[0].code.split('\n');
      codeLines.slice(0, 35).forEach((cl) => {
        checkPageBreak(4.5);
        doc.text(cl.slice(0, 100), margin + 2, cursorY);
        cursorY += 3.2;
      });
      cursorY += 4;
    }

    // Viva Questions Preview
    if (exp.vivaQuestions && exp.vivaQuestions.length > 0) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text('VIVA VOCE QUESTIONS:', margin, cursorY);
      cursorY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      exp.vivaQuestions.slice(0, 3).forEach((vq, i) => {
        checkPageBreak(15);
        doc.text(`Q${i + 1}: ${vq.question}`, margin, cursorY);
        cursorY += 3.6;
        const ansL = doc.splitTextToSize(`Ans: ${vq.answer}`, contentWidth - 4);
        doc.text(ansL, margin + 4, cursorY);
        cursorY += ansL.length * 3.4 + 2;
      });
    }

    // Result & Conclusion
    if (exp.result || exp.conclusion) {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text('RESULT & CONCLUSION:', margin, cursorY);
      cursorY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      if (exp.result) {
        const rLines = doc.splitTextToSize(`Result: ${exp.result}`, contentWidth);
        doc.text(rLines, margin, cursorY);
        cursorY += rLines.length * 3.6 + 1.5;
      }
      if (exp.conclusion) {
        const cLines = doc.splitTextToSize(`Conclusion: ${exp.conclusion}`, contentWidth);
        doc.text(cLines, margin, cursorY);
        cursorY += cLines.length * 3.6 + 2;
      }
    }
  });

  const filename = `${subject.shortCode}_Complete_Study_Guide.pdf`;
  doc.save(filename);
}
