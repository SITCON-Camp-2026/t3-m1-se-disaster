import { SourceLabel } from "../../components/SourceLabel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/date";
import { suggestPhase0ResponsibleParty } from "./phase0-heuristics";
import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

const routingLabels: Record<Phase0JudgementDraft["responsibleParty"], string> =
  {
    volunteer: "志工可處理",
    government: "交給政府",
    do_not_assign: "不分派",
    unknown: "尚未分類",
  };

const externalReferenceUrl = "https://165.npa.gov.tw/#/";

function ExternalReferenceLink() {
  return (
    <a
      className="external-reference-link"
      href={externalReferenceUrl}
      rel="noreferrer"
      target="_blank"
    >
      反詐騙網站：{externalReferenceUrl}
    </a>
  );
}

export function Phase0RawInfoPanel({
  records,
  drafts,
  selectedRecordId,
}: {
  records: Phase0MessyRecord[];
  drafts: Record<string, Phase0JudgementDraft>;
  selectedRecordId: string;
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
            <div className="heading-with-link">
              <h3>{title}</h3>
              {title === "待人工確認" ? <ExternalReferenceLink /> : null}
            </div>
            <p>{subtitle}</p>
          </div>
          <p>{items.length} 筆</p>
        </div>

        <div className="grid">
          {items.map((record) => {
            const draft = drafts[record.id];
            const savedRouting = draft?.responsibleParty;
            const suggestedRouting = suggestPhase0ResponsibleParty(record);
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
                id={`phase0-record-${record.id}`}
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
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className="phase0-raw" id="phase0-raw-info">
      <div className="panel__header">
        <div>
          <div className="heading-with-link">
            <h2>原始資訊</h2>
            <ExternalReferenceLink />
          </div>
          <p>這些還不是整理後資料，不能直接當成行動依據。</p>
        </div>
        <p>{records.length} 筆資料</p>
      </div>

      {renderSection(
        "尚未查核",
        "這些資訊尚未查核，仍需進一步確認。",
        notCheckedRecords,
      )}

      {renderSection(
        "待人工確認",
        "這些資訊需要人工確認，不能直接當成任務或發布內容。",
        needsHumanReviewRecords,
      )}

      {renderSection("Other status", "其他狀態的原始資訊。", otherRecords)}
    </div>
  );
}
