import { useState } from "react";
import type {
  Phase0JudgementDraft,
  Phase0MessyRecord,
  Phase0PossibleKind,
  Phase0Confidence,
  Phase0SuggestedNextStep,
  Phase0ResponsibleParty,
} from "./phase0-types";

const kindOptions: Array<{ value: Phase0PossibleKind; label: string }> = [
  { value: "help_request_candidate", label: "求助候選" },
  { value: "site_status_candidate", label: "地點狀態候選" },
  { value: "task_candidate", label: "任務候選" },
  { value: "assignment_candidate", label: "人員指派候選" },
  { value: "announcement_candidate", label: "公告候選" },
  { value: "unknown", label: "候選類型待判斷" },
];

const confidenceOptions: Array<{ value: Phase0Confidence; label: string }> = [
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
];

const nextStepOptions: Array<{
  value: Phase0SuggestedNextStep;
  label: string;
}> = [
  { value: "keep_raw", label: "先保留原始資訊" },
  { value: "ask_for_more_info", label: "補問來源或現場資訊" },
  { value: "send_to_human_review", label: "交給人工確認" },
  { value: "create_candidate_report", label: "建立候選通報" },
  { value: "create_site_update_suggestion", label: "建立地點更新建議" },
  { value: "do_not_use_yet", label: "暫時不要使用" },
];

function joinLines(lines: string[]) {
  return lines.join("\n");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const responsiblePartyOptions: Array<{
  value: Phase0ResponsibleParty;
  label: string;
  disabled?: boolean;
}> = [
  { value: "unknown", label: "請選擇分類", disabled: true },
  { value: "volunteer", label: "志工可處理" },
  { value: "government", label: "交給政府" },
];

export function Phase0DraftEditor({
  record,
  initialDraft,
  hasSavedDraft,
  onSave,
  onDelete,
}: {
  record: Phase0MessyRecord;
  initialDraft: Phase0JudgementDraft;
  hasSavedDraft: boolean;
  onSave: (draft: Phase0JudgementDraft) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(initialDraft);
  const [evidenceText, setEvidenceText] = useState(
    joinLines(initialDraft.evidence),
  );
  const [blockersText, setBlockersText] = useState(
    joinLines(initialDraft.blockers),
  );

  function updateDraft<K extends keyof Phase0JudgementDraft>(
    key: K,
    value: Phase0JudgementDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    onSave({
      ...draft,
      evidence: splitLines(evidenceText),
      blockers: splitLines(blockersText),
    });
  }

  function handleReset() {
    const blankDraft: Phase0JudgementDraft = {
      messyRecordId: record.id,
      possibleKind: "unknown",
      confidence: "low",
      responsibleParty: "unknown",
      suggestedNextStep: "send_to_human_review",
      unsafeToActDirectly: true,
      evidence: ["待補判斷依據，請從原文標出證據。"],
      blockers: ["尚未確認來源、時間或地點，不能直接轉為任務。"],
      humanReviewNote: "",
    };

    setDraft(blankDraft);
    setEvidenceText(joinLines(blankDraft.evidence));
    setBlockersText(joinLines(blankDraft.blockers));
  }

  return (
    <section className="draft-editor">
      <div className="draft-editor__header">
        <div>
          <p className="eyebrow">整理草稿</p>
          <h3>{hasSavedDraft ? "已建立整理草稿" : "尚未建立整理草稿"}</h3>
        </div>
        <span>{record.id}</span>
      </div>

      <p className="draft-editor__hint">
        這裡是你和 agent
        可以一起建立的草稿。分類只是待確認建議，請把候選類型、信心、下一步、依據與卡點寫清楚。
      </p>

      <div className="draft-editor__field">
        <label>
          候選類型
          <select
            value={draft.possibleKind}
            onChange={(event) =>
              updateDraft(
                "possibleKind",
                event.target.value as Phase0PossibleKind,
              )
            }
          >
            {kindOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="draft-editor__field-group">
        <label>
          信心程度
          <select
            value={draft.confidence}
            onChange={(event) =>
              updateDraft("confidence", event.target.value as Phase0Confidence)
            }
          >
            {confidenceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          分類
          <select
            value={draft.responsibleParty}
            onChange={(event) =>
              updateDraft(
                "responsibleParty",
                event.target.value as Phase0ResponsibleParty,
              )
            }
          >
            {responsiblePartyOptions.map((option) => (
              <option
                disabled={option.disabled}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          下一步
          <select
            value={draft.suggestedNextStep}
            onChange={(event) =>
              updateDraft(
                "suggestedNextStep",
                event.target.value as Phase0SuggestedNextStep,
              )
            }
          >
            {nextStepOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="draft-editor__field">
        <label>
          這筆草稿的說明
          <textarea
            rows={4}
            value={draft.humanReviewNote ?? ""}
            onChange={(event) =>
              updateDraft("humanReviewNote", event.target.value)
            }
            placeholder="請寫下你對這筆資訊的觀察、懷疑點或提醒。"
          />
        </label>
      </div>

      <div className="draft-editor__field">
        <label>
          依據（每行一條）
          <textarea
            rows={4}
            value={evidenceText}
            onChange={(event) => setEvidenceText(event.target.value)}
          />
        </label>
      </div>

      <div className="draft-editor__field">
        <label>
          卡點（每行一條）
          <textarea
            rows={4}
            value={blockersText}
            onChange={(event) => setBlockersText(event.target.value)}
          />
        </label>
      </div>

      <div className="draft-editor__actions">
        <button type="button" onClick={handleSave}>
          儲存草稿
        </button>
        <button type="button" onClick={handleReset}>
          重設表單
        </button>
        <button type="button" onClick={onDelete}>
          刪除草稿
        </button>
      </div>
    </section>
  );
}
