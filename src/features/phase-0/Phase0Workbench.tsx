import { RecordCard } from "../../components/RecordCard";
import { StatusBadge } from "../../components/StatusBadge";
import { Phase0DraftEditor } from "./Phase0DraftEditor";
import { Phase0JudgementCard } from "./Phase0JudgementCard";
import { createPhase0Judgement } from "./phase0-heuristics";
import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

export function Phase0Workbench({
  records,
  drafts,
  selectedRecordId,
  onSelect,
  onSaveDraft,
  onDeleteDraft,
}: {
  records: Phase0MessyRecord[];
  drafts: Record<string, Phase0JudgementDraft>;
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
  onSaveDraft: (draft: Phase0JudgementDraft) => void;
  onDeleteDraft: (recordId: string) => void;
}) {
  const selectedRecord =
    records.find((record) => record.id === selectedRecordId) ?? records[0];
  const safetyBoundary = createPhase0Judgement(selectedRecord);
  const selectedDraft = drafts[selectedRecord.id];
  const hasSavedDraft = Boolean(selectedDraft);
  const draftList = Object.values(drafts);
  const volunteerDraftCount = draftList.filter(
    (draft) => draft.responsibleParty === "volunteer",
  ).length;
  const governmentDraftCount = draftList.filter(
    (draft) => draft.responsibleParty === "government",
  ).length;
  const volunteerDraftIds = draftList
    .filter((draft) => draft.responsibleParty === "volunteer")
    .map((draft) => draft.messyRecordId);
  const governmentDraftIds = draftList
    .filter((draft) => draft.responsibleParty === "government")
    .map((draft) => draft.messyRecordId);
  return (
    <div className="workbench">
      <div className="workbench__intro">
        <p className="eyebrow">整理工作台</p>
        <h2>第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。</h2>
        <p>
          這裡先只標示安全邊界，真正的候選判斷要由小組和 coding agent
          補上；這不是 runtime LLM 分析，也不是正式資料模型。
        </p>
        <p className="workbench__hint">
          如果你看不到完整工作台，請把瀏覽器拉寬或往下捲動。
        </p>
      </div>

      <div className="workbench__layout">
        <aside className="workbench__queue" aria-label="選擇原始資訊">
          <h3>選擇原始資訊</h3>
          {records.map((record) => (
            <button
              className={record.id === selectedRecord.id ? "active" : ""}
              key={record.id}
              type="button"
              onClick={() => onSelect(record.id)}
            >
              <span>{record.id}</span>
              <StatusBadge status={record.verificationStatus} />
            </button>
          ))}
        </aside>

        <div className="workbench__main">
          <RecordCard record={selectedRecord} />

          <Phase0DraftEditor
            key={`${selectedRecord.id}:${hasSavedDraft ? "saved" : "safety"}`}
            record={selectedRecord}
            initialDraft={selectedDraft ?? safetyBoundary}
            hasSavedDraft={hasSavedDraft}
            onSave={onSaveDraft}
            onDelete={() => onDeleteDraft(selectedRecord.id)}
          />

          <Phase0JudgementCard
            judgement={selectedDraft ?? safetyBoundary}
            record={selectedRecord}
          />
        </div>

        <aside className="workbench__checklist">
          <h3>快速分類看板</h3>
          <div className="routing-board" aria-label="快速分類看板">
            <section className="routing-board__lane routing-board__lane--volunteer">
              <p className="routing-board__label">志工可處理</p>
              <p className="routing-board__count">{volunteerDraftCount}</p>
              <p className="routing-board__ids">
                {volunteerDraftIds.length > 0
                  ? volunteerDraftIds.join("、")
                  : "尚無草稿"}
              </p>
            </section>
            <section className="routing-board__lane routing-board__lane--government">
              <p className="routing-board__label">交給政府</p>
              <p className="routing-board__count">{governmentDraftCount}</p>
              <p className="routing-board__ids">
                {governmentDraftIds.length > 0
                  ? governmentDraftIds.join("、")
                  : "尚無草稿"}
              </p>
            </section>
          </div>

          <p className="workbench__hint">
            這裡只統計已儲存草稿；尚未分類不代表原始資訊已經安全可用。
          </p>

          <h3>第一階段完成檢查</h3>
          <ul>
            <li>Starter 已載入 {records.length} 筆原始資訊</li>
            <li>{Object.keys(drafts).length} 筆草稿已建立</li>
            <li>草稿可建立、編輯、刪除或重設</li>
            <li>可標記「志工可處理」或「交給政府」</li>
            <li>至少讓 6 筆原始資訊被嘗試整理成可編輯草稿</li>
            <li>至少挑 2 個候選判斷由人類質疑或修正</li>
            <li>
              把資料品質問題寫進 observations，並記錄 agent 哪裡不能直接相信
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
