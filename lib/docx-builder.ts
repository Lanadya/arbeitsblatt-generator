import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType,
  BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak,
} from "docx";
import type { WorksheetContent } from "./types";

// ============================================================
// DESIGN CONSTANTS — kopierfest, S/W, schlechte Kopierer
// ============================================================
const FONT = "Arial";
const PAGE_WIDTH = 11906;  // A4
const PAGE_HEIGHT = 16838;
const MARGIN_LEFT = 1417;  // ~2.5cm (Lochung/Heftung)
const MARGIN_RIGHT = 1134; // ~2cm
const MARGIN_TOP = 1417;   // ~2.5cm (Header-Platz)
const MARGIN_BOTTOM = 1134;// ~2cm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const THICK_BORDER = { style: BorderStyle.SINGLE, size: 8, color: "000000" };  // 1pt — kopierfest
const MEDIUM_BORDER = { style: BorderStyle.SINGLE, size: 6, color: "000000" }; // 0.75pt
const THIN_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "000000" };   // 0.5pt — Minimum für Kopie
const DASHED_BORDER = { style: BorderStyle.DASHED, size: 4, color: "000000" };
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const THICK_BORDERS = { top: THICK_BORDER, bottom: THICK_BORDER, left: THICK_BORDER, right: THICK_BORDER };
const MEDIUM_BORDERS = { top: MEDIUM_BORDER, bottom: MEDIUM_BORDER, left: MEDIUM_BORDER, right: MEDIUM_BORDER };
const THIN_BORDERS = { top: THIN_BORDER, bottom: THIN_BORDER, left: THIN_BORDER, right: THIN_BORDER };
const DASHED_BORDERS = { top: DASHED_BORDER, bottom: DASHED_BORDER, left: DASHED_BORDER, right: DASHED_BORDER };
const CELL_MARGINS = { top: 80, bottom: 80, left: 120, right: 120 };
const LIGHT_SHADING = { fill: "CCCCCC", type: ShadingType.CLEAR };  // 20% Schwarz — kopierfest
const BLACK_SHADING = { fill: "000000", type: ShadingType.CLEAR };

// ============================================================
// HELPER FUNCTIONS
// ============================================================

interface ParagraphOpts {
  size?: number;
  bold?: boolean;
  italics?: boolean;
  color?: string;
  before?: number;
  after?: number;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  indent?: { left?: number; hanging?: number };
  font?: string;
  keepNext?: boolean;
  keepLines?: boolean;
}

type TextItem = string | { text: string; bold?: boolean; italics?: boolean; size?: number; color?: string; font?: string };

function p(text: TextItem | TextItem[], opts: ParagraphOpts = {}): Paragraph {
  const runs: TextRun[] = [];
  const items = Array.isArray(text) ? text : [text];
  for (const t of items) {
    if (typeof t === "string") {
      runs.push(new TextRun({ text: t, font: opts.font || FONT, size: opts.size || 24, bold: !!opts.bold, italics: !!opts.italics, color: opts.color || "000000" }));
    } else {
      runs.push(new TextRun({ text: t.text, font: t.font || opts.font || FONT, size: t.size || opts.size || 24, bold: t.bold ?? opts.bold ?? false, italics: t.italics ?? opts.italics ?? false, color: t.color || opts.color || "000000" }));
    }
  }
  return new Paragraph({
    children: runs,
    spacing: { before: opts.before ?? 100, after: opts.after ?? 100, line: 360 },
    alignment: opts.align || AlignmentType.LEFT,
    ...(opts.indent ? { indent: opts.indent } : {}),
    ...(opts.keepNext ? { keepNext: true } : {}),
    ...(opts.keepLines ? { keepLines: true } : {}),
  });
}

function bannerHeading(text: string, number: string): Table {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            borders: THICK_BORDERS,
            shading: BLACK_SHADING,
            margins: { top: 60, bottom: 60, left: 200, right: 200 },
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `TEIL ${number}`, font: FONT, size: 20, bold: true, color: "FFFFFF" }),
                  new TextRun({ text: `   ${text}`, font: FONT, size: 28, bold: true, color: "FFFFFF" }),
                ],
                alignment: AlignmentType.LEFT,
                keepNext: true,
                keepLines: true,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function infoBox(children: Paragraph[]): Table {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: THICK_BORDERS,
            margins: { top: 100, bottom: 100, left: 200, right: 200 },
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            children,
          }),
        ],
      }),
    ],
  });
}

function merkeBox(title: string, children: Paragraph[]): Table {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: MEDIUM_BORDERS,
            shading: LIGHT_SHADING,
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            children: [
              p(title, { bold: true, size: 26, after: 120 }),
              ...children,
            ],
          }),
        ],
      }),
    ],
  });
}

function aufgabeBox(title: string, children: Paragraph[]): Table {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: DASHED_BORDERS,
            margins: { top: 100, bottom: 100, left: 200, right: 200 },
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            children: [
              p(title, { bold: true, size: 24, after: 120 }),
              ...children,
            ],
          }),
        ],
      }),
    ],
  });
}

function achtungBox(children: Paragraph[]): Table {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [400, CONTENT_WIDTH - 400],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { ...THICK_BORDERS },
            shading: BLACK_SHADING,
            width: { size: 400, type: WidthType.DXA },
            margins: CELL_MARGINS,
            children: [p("")],
          }),
          new TableCell({
            borders: { top: THICK_BORDER, bottom: THICK_BORDER, right: THICK_BORDER, left: NO_BORDER },
            margins: { top: 100, bottom: 100, left: 200, right: 200 },
            width: { size: CONTENT_WIDTH - 400, type: WidthType.DXA },
            children,
          }),
        ],
      }),
    ],
  });
}

function checkbox(text: string): Paragraph {
  return p([
    { text: "[   ]  ", font: "Courier New", size: 26, bold: true },
    { text, size: 24 },
  ], { before: 80, after: 80 });
}

function spacer(height = 200): Paragraph {
  return p("", { before: height, after: 0 });
}

function begriffRow(begriff: string, erklaerung: string, shaded = false): TableRow {
  const shading = shaded ? LIGHT_SHADING : undefined;
  return new TableRow({
    children: [
      new TableCell({
        borders: THIN_BORDERS,
        margins: CELL_MARGINS,
        width: { size: 3500, type: WidthType.DXA },
        shading,
        verticalAlign: VerticalAlign.CENTER,
        children: [p(begriff, { bold: true, size: 26 })],
      }),
      new TableCell({
        borders: THIN_BORDERS,
        margins: CELL_MARGINS,
        width: { size: CONTENT_WIDTH - 3500, type: WidthType.DXA },
        shading,
        children: [p(erklaerung, { size: 24 })],
      }),
    ],
  });
}

function fehlerRow(falsch: string, richtig: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        borders: THIN_BORDERS,
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA },
        children: [p(falsch, { size: 22, italics: true })],
      }),
      new TableCell({
        borders: THIN_BORDERS,
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA },
        children: [p(richtig, { size: 22, bold: true })],
      }),
    ],
  });
}

// ============================================================
// FLOWCHART BUILDER (variable Anzahl Boxen)
// ============================================================

function flowchartConnector(arrowText: string, boxWidth: number): Table {
  const children: Paragraph[] = [
    p([{ text: "|", font: "Courier New", size: 24, bold: true }], { before: 20, after: 0, align: AlignmentType.CENTER }),
  ];
  if (arrowText) {
    children.push(
      p([
        { text: arrowText, font: FONT, size: 20, italics: true },
      ], { before: 0, after: 0, align: AlignmentType.CENTER }),
    );
  }
  children.push(
    p([{ text: "|", font: "Courier New", size: 24, bold: true }], { before: 0, after: 0, align: AlignmentType.CENTER }),
  );
  children.push(
    p([{ text: "\u25BC", font: FONT, size: 24, bold: true }], { before: 0, after: 20, align: AlignmentType.CENTER }),
  );

  return new Table({
    width: { size: boxWidth, type: WidthType.DXA },
    columnWidths: [boxWidth],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
            width: { size: boxWidth, type: WidthType.DXA },
            children,
          }),
        ],
      }),
    ],
  });
}

function buildFlowchart(boxes: { label: string; sublabel?: string }[], arrows: string[]): (Table | Paragraph)[] {
  const elements: (Table | Paragraph)[] = [];
  const BOX_WIDTH = 7500;

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const isMiddle = i > 0 && i < boxes.length - 1;

    elements.push(
      new Table({
        width: { size: BOX_WIDTH, type: WidthType.DXA },
        columnWidths: [BOX_WIDTH],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: THICK_BORDERS,
                shading: isMiddle ? LIGHT_SHADING : undefined,
                margins: { top: 80, bottom: 80, left: 200, right: 200 },
                width: { size: BOX_WIDTH, type: WidthType.DXA },
                children: [
                  p(box.label, { bold: true, size: 26, align: AlignmentType.CENTER }),
                  ...(box.sublabel ? [p(box.sublabel, { size: 20, align: AlignmentType.CENTER })] : []),
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Arrow connector between boxes
    if (i < boxes.length - 1) {
      elements.push(flowchartConnector(arrows[i] || "", BOX_WIDTH));
    }
  }

  return elements;
}

// ============================================================
// LOESUNGSBLATT BUILDER
// ============================================================

function loesungsblattBanner(): Table {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            borders: THICK_BORDERS,
            shading: BLACK_SHADING,
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "LÖSUNGSBLATT", font: FONT, size: 36, bold: true, color: "FFFFFF" }),
                ],
                alignment: AlignmentType.CENTER,
                keepNext: true,
                keepLines: true,
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "NUR FÜR LEHRKRÄFTE — NICHT AN SCHÜLER AUSTEILEN", font: FONT, size: 22, bold: true, color: "FFFFFF" }),
                ],
                alignment: AlignmentType.CENTER,
                keepNext: true,
                keepLines: true,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function buildLoesungsblatt(content: WorksheetContent): (Table | Paragraph)[] {
  const loesungen = content.loesungen;
  const elements: (Table | Paragraph)[] = [];
  const SOLUTION_SIZE = 22; // 11pt — smaller than student pages

  // Page break before solutions
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  // Banner
  elements.push(loesungsblattBanner());
  elements.push(spacer(120));

  // -- Level 1: Ankreuzen --
  const level1Solutions: Paragraph[] = [
    p("AUFGABE 1 — Ankreuzen (richtige Antworten)", { bold: true, size: 24, after: 100 }),
  ];
  if (loesungen.level1_antworten) {
    loesungen.level1_antworten.forEach((ans, i) => {
      const question = content.teil5_aufgaben.level1.questions[ans.questionIndex];
      if (question) {
        level1Solutions.push(
          p(`${i + 1}. ${question.question}`, { bold: true, size: SOLUTION_SIZE, after: 40 })
        );
        for (const opt of question.options) {
          const isCorrect = opt === ans.correctOption;
          if (isCorrect) {
            level1Solutions.push(
              p([
                { text: "[X]  ", font: "Courier New", size: 24, bold: true },
                { text: opt, size: SOLUTION_SIZE, bold: true },
              ], { before: 40, after: 40 })
            );
          } else {
            level1Solutions.push(
              p([
                { text: "[   ]  ", font: "Courier New", size: 24 },
                { text: opt, size: SOLUTION_SIZE },
              ], { before: 40, after: 40 })
            );
          }
        }
        level1Solutions.push(spacer(60));
      }
    });
  }

  elements.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [CONTENT_WIDTH],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: MEDIUM_BORDERS,
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
              width: { size: CONTENT_WIDTH, type: WidthType.DXA },
              children: level1Solutions,
            }),
          ],
        }),
      ],
    })
  );

  elements.push(spacer(120));

  // -- Level 2: Lueckentext --
  const level2Solutions: Paragraph[] = [
    p("AUFGABE 2 — Lückentext (vollständige Sätze)", { bold: true, size: 24, after: 100 }),
  ];
  if (loesungen.level2_luecken) {
    loesungen.level2_luecken.forEach((sentence) => {
      level2Solutions.push(
        p([{ text: sentence, size: SOLUTION_SIZE, bold: true }], { after: 80 })
      );
    });
  }

  elements.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [CONTENT_WIDTH],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: MEDIUM_BORDERS,
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
              width: { size: CONTENT_WIDTH, type: WidthType.DXA },
              children: level2Solutions,
            }),
          ],
        }),
      ],
    })
  );

  elements.push(spacer(120));

  // -- Level 3: Musterantwort --
  const level3Solutions: Paragraph[] = [
    p("AUFGABE 3 — Nachdenken (Musterantwort)", { bold: true, size: 24, after: 100 }),
  ];
  if (loesungen.level3_musterantwort) {
    loesungen.level3_musterantwort.forEach((answer) => {
      level3Solutions.push(
        p(answer, { size: SOLUTION_SIZE, after: 80 })
      );
    });
  }
  level3Solutions.push(spacer(60));
  level3Solutions.push(
    p("Hinweis: Bei Aufgabe 3 sind auch andere Antworten möglich.", { size: 20, italics: true, after: 40 })
  );

  elements.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [CONTENT_WIDTH],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: MEDIUM_BORDERS,
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
              width: { size: CONTENT_WIDTH, type: WidthType.DXA },
              children: level3Solutions,
            }),
          ],
        }),
      ],
    })
  );

  elements.push(spacer(200));

  // -- Lehrer-Hinweis: 10-Minuten-Plan --
  if (loesungen.lehrerhinweis_10min && loesungen.lehrerhinweis_10min.length > 0) {
    const lehrerLines: Paragraph[] = loesungen.lehrerhinweis_10min.map(
      (step) => p([{ text: "\u25BA  ", bold: true, size: SOLUTION_SIZE }, { text: step, size: SOLUTION_SIZE }], { after: 60 })
    );

    elements.push(
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [400, CONTENT_WIDTH - 400],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: { ...THICK_BORDERS },
                shading: BLACK_SHADING,
                width: { size: 400, type: WidthType.DXA },
                margins: CELL_MARGINS,
                children: [p("")],
              }),
              new TableCell({
                borders: { top: THICK_BORDER, bottom: THICK_BORDER, right: THICK_BORDER, left: NO_BORDER },
                margins: { top: 100, bottom: 100, left: 200, right: 200 },
                width: { size: CONTENT_WIDTH - 400, type: WidthType.DXA },
                children: [
                  p("LEHRER-HINWEIS: 10-MINUTEN-PLAN", { bold: true, size: 24, after: 120 }),
                  ...lehrerLines,
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  return elements;
}

// ============================================================
// MAIN: buildDocument
// ============================================================

function quellenstand(): string {
  const now = new Date();
  const monat = now.toLocaleString("de-DE", { month: "long" });
  const jahr = now.getFullYear();
  return `Alle Angaben nach aktuellem Stand (${monat} ${jahr})`;
}

export function buildDocument(content: WorksheetContent, isPremium: boolean = false): Document {
  // ---- TEIL 1: Alltagseinstieg ----
  const teil1Children: Paragraph[] = [
    p(content.teil1_alltagseinstieg.situationIntro, { bold: true, size: 26, after: 100 }),
  ];
  for (const q of content.teil1_alltagseinstieg.quotes) {
    teil1Children.push(p(q.speaker, { size: 24, after: 40 }));
    teil1Children.push(p([{ text: `"${q.text}"`, bold: true, italics: true, size: 26 }], { after: 160 }));
  }
  for (const question of content.teil1_alltagseinstieg.questions) {
    teil1Children.push(p([
      { text: "?  ", font: "Courier New", bold: true, size: 28 },
      { text: question, size: 24 },
    ], { before: 120 }));
  }

  // ---- TEIL 2: Erklaerung ----
  const teil2Steps: Paragraph[] = content.teil2_erklaerung.steps.map(
    (step) => p([{ text: "\u25BA  ", bold: true }, { text: step }], { size: 24 })
  );

  const teil2MerkeLines: Paragraph[] = content.teil2_erklaerung.merkeBox.lines.map(
    (line) => p(line, { size: 24, after: 80 })
  );

  // ---- TEIL 3: Schaubild + Achtung ----
  const flowchartElements = buildFlowchart(content.teil3_schaubild.boxes, content.teil3_schaubild.arrows);

  const achtungChildren: Paragraph[] = [];
  if (content.teil3_achtungBox) {
    achtungChildren.push(p(content.teil3_achtungBox.title, { bold: true, size: 26, after: 120 }));
    for (const line of content.teil3_achtungBox.lines) {
      achtungChildren.push(p([{ text: "\u25BA  ", bold: true }, { text: line, size: 24 }]));
    }
  }

  // ---- TEIL 4: Begriffe ----
  const begriffeRows = content.teil4_begriffe.terms.map((term, i) =>
    begriffRow(term.begriff, term.erklaerung, i % 2 === 1)
  );

  // ---- TEIL 5: Aufgaben ----
  // Level 1
  const level1Children: Paragraph[] = [
    p(content.teil5_aufgaben.level1.instruction, { size: 24, after: 160 }),
  ];
  content.teil5_aufgaben.level1.questions.forEach((q, i) => {
    level1Children.push(p(`${i + 1}. ${q.question}`, { bold: true, size: 24, after: 80 }));
    for (const opt of q.options) {
      level1Children.push(checkbox(opt));
    }
    level1Children.push(spacer(100));
  });

  // Level 2
  const level2Children: Paragraph[] = [
    p([
      { text: "Setze die richtigen Wörter ein:   ", size: 24 },
      { text: content.teil5_aufgaben.level2.wordBank.join("  --  "), bold: true, size: 24 },
    ], { after: 200 }),
  ];
  content.teil5_aufgaben.level2.sentences.forEach((sentence) => {
    level2Children.push(p(sentence, { size: 24, after: 160 }));
  });

  // Level 3
  const level3Children: Paragraph[] = [
    p("Situation:", { bold: true, size: 26, after: 80 }),
  ];
  for (const line of content.teil5_aufgaben.level3.situation) {
    level3Children.push(p(line, { size: 24 }));
  }
  level3Children.push(spacer(100));
  for (const sq of content.teil5_aufgaben.level3.subQuestions) {
    level3Children.push(p(sq.label, { bold: true, size: 24, after: 20 }));
    if (sq.hint) {
      level3Children.push(p(`   (Tipp: ${sq.hint})`, { size: 22, after: 20 }));
    }
    for (let i = 0; i < (sq.lines || 1); i++) {
      level3Children.push(p("   ________________________________________________", { size: 24, after: 180 }));
    }
    level3Children.push(spacer(80));
  }

  // ---- TEIL 6: Fehler ----
  const fehlerRows = content.teil6_fehler.rows.map((r) => fehlerRow(r.falsch, r.richtig));

  // ---- TEIL 7: Abschluss ----
  const abschlussLines: Paragraph[] = content.teil7_abschluss.competencies.map(
    (c) => p([{ text: "\u25A0  ", bold: true }, { text: c, size: 24 }])
  );

  // ============================================================
  // ASSEMBLE DOCUMENT
  // ============================================================
  return new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: 24 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
            margin: { top: MARGIN_TOP, right: MARGIN_RIGHT, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT },
          },
          titlePage: true,
        },
        headers: {
          // Seite 1: kein Header (Titel ist schon im Body)
          first: new Header({ children: [new Paragraph({ children: [] })] }),
          // Folgeseiten: dezenter Header mit dünner Linie
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: content.headerText, font: FONT, size: 18, bold: true }),
                ],
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 4 } },
                spacing: { after: 0 },
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: quellenstand(), font: FONT, size: 16, color: "666666" }),
                  new TextRun({ text: "  |  ", font: FONT, size: 16, color: "999999" }),
                  new TextRun({ text: "Seite ", font: FONT, size: 16, color: "666666" }),
                  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "666666" }),
                  new TextRun({ text: " von ", font: FONT, size: 16, color: "666666" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: "666666" }),
                ],
                alignment: AlignmentType.CENTER,
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 4 } },
              }),
            ],
          }),
        },
        children: [
          // === HEADER-BEREICH: 2-Spalten-Layout (Verlagslook) ===
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: [Math.round(CONTENT_WIDTH * 0.6), Math.round(CONTENT_WIDTH * 0.4)],
            rows: [
              new TableRow({
                children: [
                  // Linke Spalte: Titel + Schlüsselbegriffe
                  new TableCell({
                    borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
                    margins: { top: 0, bottom: 0, left: 0, right: 200 },
                    width: { size: Math.round(CONTENT_WIDTH * 0.6), type: WidthType.DXA },
                    verticalAlign: VerticalAlign.BOTTOM,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: content.title, font: FONT, size: 36, bold: true })],
                        spacing: { before: 0, after: 60 },
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: content.subtitle, font: FONT, size: 20, color: "444444" })],
                        spacing: { before: 0, after: 0 },
                      }),
                    ],
                  }),
                  // Rechte Spalte: Name / Datum / Klasse
                  new TableCell({
                    borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
                    margins: { top: 0, bottom: 0, left: 100, right: 0 },
                    width: { size: Math.round(CONTENT_WIDTH * 0.4), type: WidthType.DXA },
                    verticalAlign: VerticalAlign.BOTTOM,
                    children: [
                      p("Name: ____________________________", { size: 20, before: 0, after: 60 }),
                      p("Datum: _______________", { size: 20, before: 0, after: 60 }),
                      p("Klasse: ______________", { size: 20, before: 0, after: 0 }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          // Dünne Trennlinie unter Header
          new Paragraph({
            children: [],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 8 } },
            spacing: { before: 120, after: 340 },
          }),

          // === AKTUALITÄTSHINWEIS (NUR bei Premium) ===
          ...(isPremium && content.aktualitaetshinweise && content.aktualitaetshinweise.hinweise.length > 0
            ? [
                new Table({
                  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                  columnWidths: [CONTENT_WIDTH],
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          borders: { top: THICK_BORDER, bottom: THICK_BORDER, left: THICK_BORDER, right: THICK_BORDER },
                          margins: { top: 120, bottom: 120, left: 200, right: 200 },
                          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                          shading: { fill: "FFF9E6", type: ShadingType.CLEAR },
                          children: [
                            p("\u{1F4CB} Aktualitätshinweis", { bold: true, size: 24, after: 100 }),
                            p("Wir haben Ihr Material mit aktuellen Quellen abgeglichen:", { size: 22, after: 80 }),
                            ...content.aktualitaetshinweise.hinweise.map(h =>
                              p([
                                { text: `• ${h.was}: `, bold: true, size: 22 },
                                { text: `In Ihrem Material: ${h.material} → aktuell: `, size: 22 },
                                { text: h.aktuell, bold: true, size: 22 },
                                ...(h.quelle ? [{ text: ` (${h.quelle})`, size: 20, italics: true }] : []),
                              ], { after: 60 })
                            ),
                            spacer(40),
                            p([{ text: content.aktualitaetshinweise.fazit, italics: true, size: 22 }]),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                spacer(100),
              ]
            : isPremium && content.aktualitaetshinweise && content.aktualitaetshinweise.hinweise.length === 0
            ? [
                new Table({
                  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                  columnWidths: [CONTENT_WIDTH],
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          borders: THIN_BORDERS,
                          margins: { top: 80, bottom: 80, left: 200, right: 200 },
                          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                          shading: { fill: "E8F5E9", type: ShadingType.CLEAR },
                          children: [
                            p([
                              { text: "\u2705 ", size: 22 },
                              { text: content.aktualitaetshinweise.fazit, italics: true, size: 22 },
                            ]),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                spacer(100),
              ]
            : []),

          // ============ TEIL 1 ============
          bannerHeading("AUS DEINEM ALLTAG", "1"),
          spacer(160),
          infoBox(teil1Children),

          spacer(340),

          // ============ TEIL 2 ============
          bannerHeading("SO FUNKTIONIERT ES", "2"),
          spacer(160),
          p(content.teil2_erklaerung.heading, { bold: true, size: 28, after: 160 }),
          ...teil2Steps,
          spacer(200),
          merkeBox(content.teil2_erklaerung.merkeBox.title, teil2MerkeLines),

          spacer(340),

          // ============ TEIL 3 ============
          bannerHeading("SCHAUBILD", "3"),
          spacer(160),
          p(content.teil3_schaubild.intro, { bold: true, size: 24, after: 160 }),
          ...flowchartElements,

          spacer(200),

          // Achtung-Box (optional)
          ...(content.teil3_achtungBox ? [achtungBox(achtungChildren), spacer(200)] : []),

          spacer(340),

          // ============ TEIL 4 ============
          bannerHeading("WICHTIGE BEGRIFFE", "4"),
          spacer(160),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: [3500, CONTENT_WIDTH - 3500],
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    borders: THICK_BORDERS, shading: BLACK_SHADING,
                    margins: CELL_MARGINS,
                    width: { size: 3500, type: WidthType.DXA },
                    children: [p("BEGRIFF", { bold: true, size: 24, color: "FFFFFF" })],
                  }),
                  new TableCell({
                    borders: THICK_BORDERS, shading: BLACK_SHADING,
                    margins: CELL_MARGINS,
                    width: { size: CONTENT_WIDTH - 3500, type: WidthType.DXA },
                    children: [p("WAS BEDEUTET DAS?", { bold: true, size: 24, color: "FFFFFF" })],
                  }),
                ],
              }),
              ...begriffeRows,
            ],
          }),

          spacer(340),

          // ============ TEIL 5 (Aufgaben auf neuer Seite) ============
          new Paragraph({ children: [new PageBreak()] }),
          bannerHeading("AUFGABEN", "5"),
          spacer(160),

          aufgabeBox("AUFGABE 1  --  Ankreuzen                                        Schwierigkeit: \u2605", level1Children),
          spacer(340),
          aufgabeBox("AUFGABE 2  --  Lückentext                                      Schwierigkeit: \u2605 \u2605", level2Children),
          spacer(340),
          aufgabeBox("AUFGABE 3  --  Nachdenken                                       Schwierigkeit: \u2605 \u2605 \u2605", level3Children),

          spacer(340),

          // ============ TEIL 6 ============
          bannerHeading("DAS VERWECHSELN VIELE!", "6"),
          spacer(160),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: [CONTENT_WIDTH / 2, CONTENT_WIDTH / 2],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: THICK_BORDERS, shading: BLACK_SHADING,
                    margins: CELL_MARGINS,
                    width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA },
                    children: [p("FALSCH", { bold: true, size: 24, color: "FFFFFF", align: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    borders: THICK_BORDERS, shading: BLACK_SHADING,
                    margins: CELL_MARGINS,
                    width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA },
                    children: [p("RICHTIG", { bold: true, size: 24, color: "FFFFFF", align: AlignmentType.CENTER })],
                  }),
                ],
              }),
              ...fehlerRows,
            ],
          }),

          spacer(340),

          // ============ TEIL 7 ============
          merkeBox(content.teil7_abschluss.title, abschlussLines),

          // ============ LOESUNGSBLATT ============
          ...(content.loesungen ? buildLoesungsblatt(content) : []),
        ],
      },
    ],
  });
}

export async function buildDocxBuffer(content: WorksheetContent, isPremium: boolean = false): Promise<Buffer> {
  const doc = buildDocument(content, isPremium);
  return await Packer.toBuffer(doc) as Buffer;
}
