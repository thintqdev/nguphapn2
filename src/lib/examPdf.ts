import type { ExamData, ExamQuestion, ExamSection } from "./examTypes";
import { isExamAnswerCorrect, optionKey } from "./examUtils";

export interface ExamPdfPayload {
  exam: ExamData;
  answers: Record<number, string>;
  score: number;
  total: number;
  timeSpentSeconds: number;
  studentName?: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTime(sec: number): string {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.max(0, sec) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDate(d: Date): string {
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderReading(text: string): string {
  return esc(text).replace(/\[(\d+)\]/g, (_m, n) => {
    return `<span class="blank">[${n}]</span>`;
  });
}

function renderTemplate(template: string): string {
  return esc(template)
    .replace(/★/g, '<span class="star">★</span>')
    .replace(/＿＿/g, '<span class="blank-line">＿＿</span>');
}

function questionStem(q: ExamQuestion): string {
  const parts: string[] = [];
  if (q.target_word && !q.question) {
    parts.push(`<p class="stem-word">${esc(q.target_word)}</p>`);
  }
  if (q.question) {
    let text = esc(q.question);
    if (q.target_word) {
      const t = esc(q.target_word);
      text = text.split(t).join(`<u class="target">${t}</u>`);
    }
    parts.push(`<p class="stem">${text}</p>`);
  }
  if (q.template) {
    parts.push(`<p class="stem">${renderTemplate(q.template)}</p>`);
  }
  return parts.join("");
}

function renderQuestion(
  q: ExamQuestion,
  selected: string | undefined
): string {
  const verdict = isExamAnswerCorrect(q, selected);
  const mark =
    verdict === true
      ? '<span class="ok">✓ Đúng</span>'
      : verdict === false
        ? '<span class="bad">✗ Sai</span>'
        : '<span class="na">—</span>';

  const opts = q.options
    .map((opt, i) => {
      const key = optionKey(opt, i);
      const isSelected = selected === key;
      const isCorrect = q.answer != null && String(q.answer) === key;
      let cls = "opt";
      if (isCorrect) cls += " opt-correct";
      if (isSelected && !isCorrect) cls += " opt-wrong";
      if (isSelected) cls += " opt-picked";
      const tags: string[] = [];
      if (isSelected) tags.push("đã chọn");
      if (isCorrect) tags.push("đáp án");
      const tagHtml = tags.length
        ? ` <span class="tag">(${tags.join(" · ")})</span>`
        : "";
      return `<div class="${cls}">${esc(opt)}${tagHtml}</div>`;
    })
    .join("");

  const orderNote =
    q.correct_order && q.correct_order.length
      ? `<p class="meta">Thứ tự đúng: ${q.correct_order.join(" → ")} (★ = đáp án ${esc(String(q.answer ?? ""))})</p>`
      : "";

  const unanswered =
    q.answer && !selected
      ? `<p class="meta muted">Học sinh chưa chọn</p>`
      : "";

  return `
    <div class="q">
      <div class="q-head">
        <strong>${q.id}.</strong>
        ${mark}
      </div>
      ${questionStem(q)}
      <div class="opts">${opts}</div>
      ${orderNote}
      ${unanswered}
    </div>`;
}

function renderSection(section: ExamSection, index: number, answers: Record<number, string>): string {
  const reading = section.reading_text
    ? `<div class="reading"><div class="reading-label">読解文</div><div class="reading-body">${renderReading(section.reading_text)}</div></div>`
    : "";

  const qs = section.questions
    .map((q) => renderQuestion(q, answers[q.id]))
    .join("");

  return `
    <section class="section">
      <h2>問題 ${index + 1}</h2>
      <p class="instruction">${esc(section.instruction)}</p>
      ${reading}
      ${qs}
    </section>`;
}

function buildHtml(payload: ExamPdfPayload): string {
  const { exam, answers, score, total, timeSpentSeconds, studentName } =
    payload;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const now = formatDate(new Date());
  const name = studentName?.trim() || "…………………………";

  const sections = exam.sections
    .map((s, i) => renderSection(s, i, answers))
    .join("");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<title>${esc(exam.test_title)} — Kết quả</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP",
      "Yu Gothic", "Meiryo", "Segoe UI", sans-serif;
    color: #1a1714;
    font-size: 11.5pt;
    line-height: 1.55;
    margin: 0;
    padding: 0;
  }
  .sheet { max-width: 800px; margin: 0 auto; }
  h1 { font-size: 16pt; margin: 0 0 6px; }
  h2 {
    font-size: 12.5pt;
    margin: 18px 0 6px;
    padding-bottom: 3px;
    border-bottom: 1.5px solid #1a1714;
  }
  .meta-box {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px 12px;
    margin: 10px 0 16px;
    background: #faf9f7;
  }
  .meta-box table { width: 100%; border-collapse: collapse; font-size: 10.5pt; }
  .meta-box td { padding: 3px 4px; vertical-align: top; }
  .meta-box .label { color: #666; width: 28%; }
  .score { font-size: 14pt; font-weight: 700; }
  .instruction { color: #444; margin: 0 0 10px; font-size: 10.5pt; }
  .reading {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px 12px;
    margin: 0 0 14px;
    background: #f7f6f3;
    page-break-inside: avoid;
  }
  .reading-label {
    font-size: 9pt;
    font-weight: 700;
    color: #666;
    margin-bottom: 6px;
    letter-spacing: 0.04em;
  }
  .reading-body {
    white-space: pre-wrap;
    font-size: 10.5pt;
    line-height: 1.85;
  }
  .blank {
    display: inline-block;
    min-width: 1.4em;
    padding: 0 3px;
    margin: 0 1px;
    border: 1px solid #888;
    border-radius: 3px;
    font-weight: 700;
    font-size: 9.5pt;
    text-align: center;
  }
  .star {
    display: inline-block;
    padding: 0 4px;
    background: #1a1714;
    color: #fff;
    border-radius: 3px;
    font-weight: 700;
  }
  .blank-line { letter-spacing: 0.05em; }
  .q {
    margin: 0 0 12px;
    padding-bottom: 10px;
    border-bottom: 1px dotted #ddd;
    page-break-inside: avoid;
  }
  .q-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 4px;
  }
  .stem, .stem-word { margin: 0 0 6px; }
  .stem-word { font-weight: 700; font-size: 12pt; }
  u.target { text-decoration-thickness: 2px; text-underline-offset: 2px; }
  .opts { margin-left: 4px; }
  .opt {
    padding: 3px 6px;
    margin: 2px 0;
    border-radius: 4px;
    border: 1px solid transparent;
    font-size: 10.5pt;
  }
  .opt-correct {
    border-color: #2e7d58;
    background: #e8f5ef;
  }
  .opt-wrong {
    border-color: #c0392b;
    background: #fceceb;
  }
  .tag { font-size: 8.5pt; color: #555; }
  .ok { color: #2e7d58; font-size: 9.5pt; font-weight: 700; }
  .bad { color: #c0392b; font-size: 9.5pt; font-weight: 700; }
  .na { color: #888; font-size: 9.5pt; }
  .meta { font-size: 9pt; color: #555; margin: 4px 0 0; }
  .muted { color: #888; }
  .footer {
    margin-top: 22px;
    padding-top: 8px;
    border-top: 1px solid #ccc;
    font-size: 9pt;
    color: #666;
  }
  .sign {
    margin-top: 28px;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    font-size: 10pt;
  }
  .sign div { flex: 1; }
  .sign .line {
    margin-top: 28px;
    border-bottom: 1px solid #999;
    height: 1px;
  }
  @media print {
    .no-print { display: none !important; }
    a { color: inherit; text-decoration: none; }
  }
  .toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    background: #fff;
    border-bottom: 1px solid #ddd;
    margin-bottom: 14px;
  }
  .toolbar button {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #1a1714;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    font-size: 12px;
  }
  .toolbar button.secondary {
    background: #fff;
    color: #1a1714;
  }
</style>
</head>
<body>
  <div class="toolbar no-print">
    <button type="button" onclick="window.print()">In / Lưu PDF</button>
    <button type="button" class="secondary" onclick="window.close()">Đóng</button>
    <span style="align-self:center;font-size:12px;color:#666">Chọn máy in 「Save as PDF」 / 「Microsoft Print to PDF」</span>
  </div>
  <div class="sheet">
    <h1>${esc(exam.test_title)}</h1>
    <p style="margin:0 0 4px;color:#555;font-size:10.5pt">Phiếu đề + kết quả nộp giáo viên · JLPT N2</p>
    <div class="meta-box">
      <table>
        <tr><td class="label">Họ tên học sinh</td><td><strong>${esc(name)}</strong></td></tr>
        <tr><td class="label">Ngày nộp</td><td>${esc(now)}</td></tr>
        <tr><td class="label">Điểm</td><td class="score">${score}/${total} (${pct}%)</td></tr>
        <tr><td class="label">Thời gian làm</td><td>${formatTime(timeSpentSeconds)}</td></tr>
        <tr><td class="label">Mã đề</td><td>${esc(exam.id)}</td></tr>
        <tr><td class="label">Số câu</td><td>${exam.total_questions}</td></tr>
      </table>
    </div>
    ${sections}
    <div class="sign">
      <div>Chữ ký học sinh<div class="line"></div></div>
      <div>Chữ ký / xác nhận GV<div class="line"></div></div>
    </div>
    <div class="footer">
      Xuất từ nguphapn2 · Đáp án đúng được tô xanh; lựa chọn sai tô đỏ.
    </div>
  </div>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 350);
    });
  </script>
</body>
</html>`;
}

/** Mở cửa sổ in A4 — chọn Save as PDF để nộp GV (hỗ trợ tiếng Nhật đầy đủ). */
export function exportExamResultPdf(payload: ExamPdfPayload): boolean {
  const html = buildHtml(payload);
  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
}
