import { StatusBadge } from "../../components/StatusBadge";
import { suggestPhase0ResponsibleParty } from "./phase0-heuristics";
import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

const responsiblePartyLabels: Record<
  Phase0JudgementDraft["responsibleParty"],
  string
> = {
  volunteer: "志工可處理",
  government: "交給政府",
  do_not_assign: "不分派",
  unknown: "尚未分類",
};

export function Phase0RecordSelector({
  records,
  drafts,
  selectedRecordId,
  onQuery,
}: {
  records: Phase0MessyRecord[];
  drafts: Record<string, Phase0JudgementDraft>;
  selectedRecordId: string;
  onQuery: (recordId: string) => void;
}) {
  return (
    <section className="record-selector" aria-label="選擇原始資訊">
      <div className="record-selector__header">
        <div>
          <h2>選擇原始資訊</h2>
          <p>先選一筆資料，按「查詢資料」後到下方查看原文與安全邊界。</p>
        </div>
        <p>{records.length} 筆</p>
      </div>

      <div className="record-selector__grid">
        {records.map((record) => {
          const savedRouting = drafts[record.id]?.responsibleParty;
          const suggestedRouting = suggestPhase0ResponsibleParty(record);
          const routing =
            savedRouting === "volunteer" || savedRouting === "government"
              ? savedRouting
              : suggestedRouting;
          const routingLabel =
            savedRouting === "volunteer" || savedRouting === "government"
              ? responsiblePartyLabels[savedRouting]
              : `建議：${responsiblePartyLabels[suggestedRouting]}`;

          return (
            <article
              className={`record-selector__item record-selector__item--${routing} ${
                record.id === selectedRecordId
                  ? "record-selector__item--active"
                  : ""
              }`}
              key={record.id}
            >
              <div className="record-selector__meta">
                <strong>{record.id}</strong>
                <StatusBadge status={record.verificationStatus} />
              </div>
              <span
                className={`queue-routing-chip queue-routing-chip--${routing}`}
              >
                {routingLabel}
              </span>
              <button
                aria-label={`查詢 ${record.id} 原始資料`}
                type="button"
                onClick={() => onQuery(record.id)}
              >
                查詢資料
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
