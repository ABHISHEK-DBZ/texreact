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

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      cursorY = margin;
      renderHeaderFooter();
    }
  };

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

  renderHeaderFooter();

  // Document Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 30, 50);
  doc.text(`Experiment ${experiment.expNumber}: ${experiment.title}`, margin, cursorY);
  cursorY += 8;

  // Metadata / Topic
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 100, 120);
  const metaText = `Subject: ${subject.name} | Topic: ${experiment.topic || 'General'} | Source: ${experiment.sourceReference?.docName || 'PDF Reference'} (p. ${experiment.sourceReference?.pageNumber || '1'})`;
  doc.text(metaText, margin, cursorY);
  cursorY += 8;
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 6;

  // 1. AIM
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. AIM & OBJECTIVE', margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const aimLines = doc.splitTextToSize(experiment.aim, contentWidth);
  doc.text(aimLines, margin, cursorY);
  cursorY += aimLines.length * 4.5 + 4;

  // 2. PREREQUISITES (if present)
  if (experiment.prerequisites && experiment.prerequisites.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('2. PREREQUISITES & KEY CONCEPTS', margin, cursorY);
    cursorY += 5;

    experiment.prerequisites.forEach((p) => {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(37, 99, 235);
      doc.text(`• ${p.concept}:`, margin, cursorY);
      cursorY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const pLines = doc.splitTextToSize(p.explanation, contentWidth - 4);
      doc.text(pLines, margin + 4, cursorY);
      cursorY += pLines.length * 4 + 3;
    });
    cursorY += 2;
  }

  // 3. ALGORITHM
  if (experiment.algorithm && experiment.algorithm.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('3. STEP-BY-STEP ALGORITHM', margin, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    experiment.algorithm.forEach((step, idx) => {
      checkPageBreak(12);
      const stepLines = doc.splitTextToSize(`${idx + 1}. ${step}`, contentWidth);
      doc.text(stepLines, margin, cursorY);
      cursorY += stepLines.length * 4.2 + 1.5;
    });
    cursorY += 4;
  }

  // 4. SOURCE CODE
  if (experiment.codeSnippets && experiment.codeSnippets.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`4. COMPLETE PROGRAM CODE (${experiment.codeSnippets[0].language.toUpperCase()})`, margin, cursorY);
    cursorY += 5;

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);

    const code = experiment.codeSnippets[0].code;
    const rawLines = code.split('\n');

    rawLines.forEach((line) => {
      checkPageBreak(5);
      doc.text(line.slice(0, 95), margin + 2, cursorY);
      cursorY += 3.8;
    });
    cursorY += 5;
  }

  // 5. DRY RUN & TRACE (if present)
  if (experiment.dryRun) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('5. DRY RUN & EXECUTION TRACE', margin, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const traceIntro = doc.splitTextToSize(`Input: ${experiment.dryRun.initialInput} | ${experiment.dryRun.description}`, contentWidth);
    doc.text(traceIntro, margin, cursorY);
    cursorY += traceIntro.length * 4 + 3;

    experiment.dryRun.steps.forEach((s) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`Step ${s.stepNumber}: ${s.action}`, margin, cursorY);
      cursorY += 3.8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`State: ${s.stateOrVariables}${s.outputOrLog ? ' | Log: ' + s.outputOrLog : ''}`, margin + 4, cursorY);
      cursorY += 4.5;
    });
    cursorY += 3;
  }

  // 6. COMPLEXITY ANALYSIS
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('6. COMPLEXITY ANALYSIS', margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Time Complexity:  ${experiment.timeComplexity || 'O(n)'}`, margin, cursorY);
  cursorY += 4.5;
  doc.text(`Space Complexity: ${experiment.spaceComplexity || 'O(1)'}`, margin, cursorY);
  cursorY += 4.5;

  if (experiment.complexityExplanation) {
    const cLines = doc.splitTextToSize(experiment.complexityExplanation, contentWidth);
    doc.text(cLines, margin, cursorY);
    cursorY += cLines.length * 4 + 4;
  }

  // 7. VIVA VOCE QUESTIONS
  if (experiment.vivaQuestions && experiment.vivaQuestions.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('7. VIVA VOCE QUESTIONS & ANSWERS', margin, cursorY);
    cursorY += 5;

    experiment.vivaQuestions.forEach((v, vIdx) => {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      const qLines = doc.splitTextToSize(`Q${vIdx + 1}: ${v.question}`, contentWidth);
      doc.text(qLines, margin, cursorY);
      cursorY += qLines.length * 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const aLines = doc.splitTextToSize(`Ans: ${v.answer}`, contentWidth - 4);
      doc.text(aLines, margin + 4, cursorY);
      cursorY += aLines.length * 4 + 3;
    });
  }

  // 8. RESULT & CONCLUSION
  if (experiment.result || experiment.conclusion) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('8. RESULT & CONCLUSION', margin, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
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
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(subject.name, margin, 70);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(71, 85, 105);
  doc.text('Comprehensive Engineering Laboratory Handbook & Code Reference', margin, 82);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Includes ${subject.experiments.length} Experiments, Source Code, Line-by-Line Explanations, Dry Runs, and Viva Voce Questions.`, margin, 92);

  doc.line(margin, 105, pageWidth - margin, 105);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('Table of Contents:', margin, 120);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let tocY = 130;
  subject.experiments.forEach((exp) => {
    doc.text(`Exp ${exp.expNumber}: ${exp.title}`, margin + 5, tocY);
    tocY += 7;
  });

  // START EXPERIMENTS ON NEXT PAGE
  subject.experiments.forEach((exp) => {
    doc.addPage();
    cursorY = margin;
    renderHeaderFooter();

    // Experiment Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Exp ${exp.expNumber}: ${exp.title}`, margin, cursorY);
    cursorY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Topic: ${exp.topic || 'General'} | Source Reference: Page ${exp.sourceReference?.pageNumber || '1'}`, margin, cursorY);
    cursorY += 8;

    // Aim
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('AIM:', margin, cursorY);
    cursorY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const aimLines = doc.splitTextToSize(exp.aim, contentWidth);
    doc.text(aimLines, margin, cursorY);
    cursorY += aimLines.length * 4 + 4;

    // Algorithm
    if (exp.algorithm && exp.algorithm.length > 0) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text('ALGORITHM:', margin, cursorY);
      cursorY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      exp.algorithm.slice(0, 6).forEach((st, idx) => {
        checkPageBreak(10);
        const stLines = doc.splitTextToSize(`${idx + 1}. ${st}`, contentWidth);
        doc.text(stLines, margin, cursorY);
        cursorY += stLines.length * 3.8 + 1;
      });
      cursorY += 3;
    }

    // Code
    if (exp.codeSnippets && exp.codeSnippets.length > 0) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(`CODE (${exp.codeSnippets[0].language.toUpperCase()}):`, margin, cursorY);
      cursorY += 4.5;

      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);

      const codeLines = exp.codeSnippets[0].code.split('\n');
      codeLines.slice(0, 40).forEach((cl) => {
        checkPageBreak(4.5);
        doc.text(cl.slice(0, 100), margin + 2, cursorY);
        cursorY += 3.4;
      });
      cursorY += 4;
    }

    // Viva
    if (exp.vivaQuestions && exp.vivaQuestions.length > 0) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text('VIVA QUESTIONS:', margin, cursorY);
      cursorY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      exp.vivaQuestions.slice(0, 2).forEach((vq, i) => {
        checkPageBreak(15);
        doc.text(`Q${i + 1}: ${vq.question}`, margin, cursorY);
        cursorY += 3.8;
        const ansL = doc.splitTextToSize(`Ans: ${vq.answer}`, contentWidth - 4);
        doc.text(ansL, margin + 4, cursorY);
        cursorY += ansL.length * 3.6 + 2;
      });
    }
  });

  const filename = `${subject.shortCode}_Complete_Study_Guide.pdf`;
  doc.save(filename);
}
