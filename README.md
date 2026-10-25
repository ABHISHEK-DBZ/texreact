# StudyCode Hub — Professional Engineering Laboratory & DSA Study Platform

A thoughtfully engineered, academic documentation-grade study platform built for computer science and engineering students. The platform organizes engineering laboratory experiments, genuine source programs, step-by-step algorithms, line-by-line code explanations, dry-run trace tables, sample input/output, complexity analyses, and examination viva questions into a single intuitive, searchable interface.

---

## 🌟 Key Architectural & Educational Features

### 1. Light-First Human-Crafted Aesthetic
- **Warm Light-First Theme**: Warm white (`#f8fafc`, `#ffffff`) background with dark charcoal typography (`#0f172a`, `#334155`), subtle slate borders (`#e2e8f0`), and restrained indigo/blue accent (`#2563eb`).
- **Complete Dark Mode**: Accessible via the header Sun/Moon toggle with persistent `localStorage` theme state and zero white-flash on page reload.
- **Anti-AI-Slop Restraint**: Zero decorative glowing blobs, no floating gradients, no generic marketing sections, and no fake statistics. Every component serves a specific learning or revision purpose.
- **Academic Typography**: Inter interface typography paired with JetBrains Mono for pristine code indentation and aligned tabular traces.

### 2. Complete Authentic DSA Curriculum (Extracted from `rawasset/dsa`)
Extracted directly from the 16-page `DSA Experiments – Code Reference.pdf` located in `rawasset/dsa`:
1. **Experiment 1**: Array Operations (Insertion, Deletion, Min, Max, Traversal Display)
2. **Experiment 2**: Stack Implementation Using Array (Fixed Capacity = 5, Push, Pop, Peek, Display)
3. **Experiment 3**: Linear Queue Implementation Using Array (Enqueue, Dequeue, Peek, Display)
4. **Experiment 4**: Singly Linked List (Insert/Delete Beginning and End, Full Traversal)
5. **Experiment 5**: Doubly Linked List (Bidirectional links `prev`/`next`, Insert/Delete Beginning and End)
6. **Experiment 6**: Insertion Sort (In-place comparison and shifting algorithm with step-by-step trace)
7. **Experiment 7**: Binary Search Tree (BST) (Recursive insertion, 90° rotated visual tree display, Inorder, Preorder, Postorder traversals)
8. **Experiment 8**: Breadth First Search (BFS) on Graph (Adjacency list representation, queue, visited set)
9. **Experiment 9**: Infix to Prefix Conversion (Using Stack, modified Shunting Yard with reverse scan)

### 3. Pedagogical Structure for Every Experiment
Every single DSA experiment contains:
- **Experiment Overview & Aim**: Original question and core conceptual purpose.
- **Prerequisites**: Clear conceptual explanations before diving into code (e.g., LIFO semantics, pointer mechanics, adjacency lists).
- **Step-by-Step Algorithm**: Numbered, beginner-friendly procedural steps.
- **Complete Original Program**: Exact Python source code with syntax highlighting, line numbers, language labels, and a clean Copy Code button (copies code only, without line numbers).
- **Line-by-Line Code Breakdown**: Structured explanation cards detailing what each block does, why it is needed, variable roles, and condition checks.
- **Dry Run Trace Table**: Comprehensive step-by-step execution tables showing loop states, pointers, and memory modifications.
- **Sample Input & Output**: Verified console traces matching original executions.
- **Time & Space Complexity**: Big-O notation with practical interpretations.
- **Result & Conclusion**: Clear outcomes and engineering takeaways.
- **Viva Voce Q&A**: Authentic examination questions with concise answers.
- **Quick Revision Summary**: Key formulas, edge cases, and high-yield exam takeaways.

### 4. Client-Side Printable PDF Study Guides (`jspdf`)
- **Download Full DSA Study Guide**: Single-click generation of a complete, formatted A4 revision manual containing all 9 experiments.
- **Individual Experiment PDFs**: Standalone A4 handouts with preserved code indentation, headers, footers, and page numbers.
- **Print Friendly**: Built-in `@media print` rules for browser printing directly to PDF or paper.

### 5. Study & Productivity Tools
- **Global Search (`Ctrl+K` / `Cmd+K`)**: Rapid keyword search across all experiments, source code, viva questions, and theoretical concepts with subject filters.
- **Bookmarks**: Bookmark key experiments and tricky viva questions for instant access during exam revision.
- **Practice Viva Flashcards**: Interactive rapid-fire quiz mode for laboratory viva voce preparation.
- **Offline / PWA Ready**: Service worker caches core scripts, stylesheets, and experiment definitions for offline study.

---

## 📁 Project Directory Structure

```text
texreacter/
├── rawasset/               <-- Symlink / Junction to raw_assets
├── raw_assets/
│   ├── dsa/
│   │   ├── DSA Experiments – Code Reference.pdf   # 16-page authentic DSA manual
│   │   └── EXP 1 - To implement basic array op.txt # 1016-line lab question bank
│   ├── python/                                     # Python lab files
│   ├── mpm/                                        # Microprocessor & Microcontroller files
│   └── dvlsi/                                      # Digital VLSI design files
├── src/
│   ├── components/
│   │   ├── BookmarksView.tsx       # Saved questions and experiments
│   │   ├── CodeBlock.tsx           # Clean syntax highlighted code viewer
│   │   ├── ContentUploaderModal.tsx# Ingestion & JSON import/export
│   │   ├── Dashboard.tsx           # Subject hub and real metrics overview
│   │   ├── ExperimentView.tsx      # Comprehensive 11-section learning view
│   │   ├── GlobalSearchModal.tsx   # Instant Ctrl+K multi-field search
│   │   ├── Navbar.tsx              # Light/dark toggle, title editor, quick search
│   │   ├── PdfStudyModal.tsx       # PDF study guide export dialog
│   │   ├── QuestionCard.tsx        # Expandable viva/theory question card
│   │   ├── RevisionQuizModal.tsx   # Flashcard self-study viva trainer
│   │   ├── Sidebar.tsx             # Collapsible navigation drawer
│   │   └── SubjectPage.tsx         # Subject experiment index and question bank
│   ├── data/
│   │   ├── dsaExperiments.ts       # All 9 authentic DSA experiments extracted from PDF
│   │   └── initialData.ts          # Complete subject registry (Python, DSA, MPM, DVLSI)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   ├── pdfExport.ts            # Client-side A4 PDF document generator
│   │   ├── prism.ts                # PrismJS syntax engine
│   │   └── storage.ts              # LocalStorage persistence & theme management
│   ├── App.tsx                     # Top-level state and routing controller
│   ├── index.css                   # Refined design system tokens and print styles
│   └── main.tsx                    # React DOM entrypoint
├── public/                         # Favicon and PWA manifest
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Development Mode
```bash
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Production Build & Typecheck
```bash
npm run build
```
Generates a minified, production-ready static bundle in `dist/`.

---

## 📖 Using Offline & PDF Revision Guides

1. **In the Web Browser**:
   - Open the web app while connected to the local development server or hosted domain.
   - The Service Worker caches application assets in the browser cache.
2. **Download PDFs for Standalone Offline Revision**:
   - Click **"Study PDFs"** in the top navigation bar or **"Download DSA PDF"** on the dashboard.
   - Select either the **"Download Full Guide"** button for the comprehensive 9-experiment laboratory manual or click individual experiment download icons.
   - The generated PDFs conform to standard A4 page layout with headers, footers, page numbers, and cleanly indented code that can be opened in any offline PDF reader or printed directly.
