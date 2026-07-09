import { SourceLabel } from "../../components/SourceLabel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/date";
import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

const routingLabels: Record<Phase0JudgementDraft["responsibleParty"], string> =
  {
    volunteer: "志工可處理",
    government: "交給政府",
    do_not_assign: "不分派",
    unknown: "尚未分類",
  };

function suggestResponsibleParty(record: Phase0MessyRecord) {
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

export function Phase0RawInfoPanel({
  records,
  drafts,
  selectedRecordId,
  onSelect,
}: {
  records: Phase0MessyRecord[];
  drafts: Record<string, Phase0JudgementDraft>;
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
}) {
  const notCheckedRecords = records.filter(
    (record) => record.verificationStatus === "unverified",
  );
  const needsHumanReviewRecords = records.filter(
    (record) => record.verificationStatus === "needs_review",
  );
  const otherRecords = records.filter(
    (record) =>
      record.verificationStatus !== "unverified" &&
      record.verificationStatus !== "needs_review",
  );

  function renderSection(
    title: string,
    subtitle: string,
    items: Phase0MessyRecord[],
  ) {
    if (items.length === 0) {
      return null;
    }

    return (
      <section className="phase0-raw__group">
        <div className="phase0-raw__group-header">
          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          <p>{items.length} 筆</p>
        </div>

        <div className="grid">
          {items.map((record) => {
            const draft = drafts[record.id];
            const savedRouting = draft?.responsibleParty;
            const suggestedRouting = suggestResponsibleParty(record);
            const routing =
              savedRouting === "volunteer" || savedRouting === "government"
                ? savedRouting
                : suggestedRouting;
            const routingLabel =
              savedRouting === "volunteer" || savedRouting === "government"
                ? routingLabels[savedRouting]
                : `建議：${routingLabels[suggestedRouting]}`;

            return (
              <article
                aria-label={`${record.id} 原始資訊`}
                className={`record-card record-card--${routing} ${record.id === selectedRecordId ? "record-card--selected" : ""}`}
                key={record.id}
              >
                <div
                  className={`raw-routing-strip raw-routing-strip--${routing}`}
                >
                  {routingLabel}
                </div>
                <div className="record-card__header">
                  <div>
                    <h3>{record.id}</h3>
                  </div>
                  <StatusBadge status={record.verificationStatus} />
                </div>
                <p>{record.rawText}</p>
                <div className="record-card__meta">
                  <SourceLabel sourceType={record.sourceType} />
                  <span>更新：{formatDateTime(record.updatedAt)}</span>
                </div>
                <button type="button" onClick={() => onSelect(record.id)}>
                  送到整理工作台
                </button>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className="phase0-raw">
      <div className="panel__header">
        <div>
          <h2>原始資訊</h2>
          <p>這些還不是整理後資料，不能直接當成行動依據。</p>
        </div>
        <p>{records.length} 筆資料</p>
      </div>

      {renderSection(
        "Haven't checked",
        "這些資訊尚未查核，仍需進一步確認。",
        notCheckedRecords,
      )}

      {renderSection(
        "Need human to check",
        "這些資訊需要人工確認，不能直接當成任務或發布內容。",
        needsHumanReviewRecords,
      )}

      {renderSection("Other status", "其他狀態的原始資訊。", otherRecords)}
    </div>
  );
}
