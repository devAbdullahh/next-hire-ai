import type { AnswerScore } from "@/types";

export interface SessionAnswerDetail {
  questionIndex: number;
  question: string;
  answer: string;
  score: AnswerScore;
}

export function getSessionAnswerDetails(
  messages: { role: string; content: string }[],
  scores: AnswerScore[]
): SessionAnswerDetail[] {
  const details: SessionAnswerDetail[] = [];
  let userIdx = 0;

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role !== "user") continue;

    let question = "";
    for (let j = i - 1; j >= 0; j--) {
      if (messages[j].role === "ai") {
        question = messages[j].content;
        break;
      }
    }

    const score = scores.find((s) => s.questionIndex === userIdx);
    if (score) {
      details.push({
        questionIndex: userIdx,
        question,
        answer: messages[i].content,
        score,
      });
    }

    userIdx++;
  }

  return details;
}
