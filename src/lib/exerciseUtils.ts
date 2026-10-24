export function isAnswerCorrect(option: string, answer: string): boolean {
  const opt = (option || "").trim();
  const ans = (answer || "").trim();
  if (opt === ans) return true;
  if (ans.startsWith(opt)) return true;

  const optNum = opt.match(/^([1-4])/)?.[1];
  const ansNum = ans.match(/^([1-4])/)?.[1];
  if (optNum && ansNum && optNum === ansNum) return true;

  return false;
}
