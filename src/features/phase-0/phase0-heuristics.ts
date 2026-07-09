import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

// ponytail: this is a safety-boundary scaffold, not an answer engine.
export function createPhase0Judgement(
  record: Phase0MessyRecord,
): Phase0JudgementDraft {
  const isVerified = record.verificationStatus === "verified";

  return {
    messyRecordId: record.id,
    possibleKind: "unknown",
    confidence: "low",
    responsibleParty: "unknown",
    evidence: ["尚未人工確認：請從原文標出判斷依據。"],
    blockers: isVerified
      ? ["仍需確認這筆資訊適合進入哪個後續流程。"]
      : ["目前不是已確認資訊，不能直接行動或當成事實發布。"],
    suggestedNextStep: isVerified ? "keep_raw" : "send_to_human_review",
    unsafeToActDirectly: true,
  };
}

export function suggestPhase0ResponsibleParty(record: Phase0MessyRecord) {
  const governmentKeywords = [
    "道路封閉",
    "官方公告",
    "藥品",
    "來電",
    "同意公開",
    "無法確認",
  ];

  return governmentKeywords.some((keyword) => record.rawText.includes(keyword))
    ? "government"
    : "volunteer";
}
