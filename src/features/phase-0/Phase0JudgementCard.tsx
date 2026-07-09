import { StatusBadge } from "../../components/StatusBadge";
import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

const confidenceLabels: Record<Phase0JudgementDraft["confidence"], string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const nextStepLabels: Record<
  Phase0JudgementDraft["suggestedNextStep"],
  string
> = {
  keep_raw: "先保留原始資訊",
  ask_for_more_info: "補問來源或現場資訊",
  send_to_human_review: "交給人工確認",
  create_candidate_report: "建立候選通報",
  create_site_update_suggestion: "建立地點更新建議",
  do_not_use_yet: "暫時不要使用",
};

const responsiblePartyLabels: Record<
  Phase0JudgementDraft["responsibleParty"],
  string
> = {
  volunteer: "志工可處理",
  government: "交給政府",
  do_not_assign: "先不要分派成任務",
  unknown: "尚未分類",
};

export function Phase0JudgementCard({
  judgement,
  record,
}: {
  judgement: Phase0JudgementDraft;
  record: Phase0MessyRecord;
}) {
  const routingClassName = `routing-chip routing-chip--${judgement.responsibleParty}`;
  const cardClassName = `judgement-card judgement-card--${judgement.responsibleParty}`;

  return (
    <article className={cardClassName}>
      <div className="judgement-card__header">
        <div>
          <p className="eyebrow">安全邊界</p>
          <h3>目前仍是待確認資訊</h3>
        </div>
        <StatusBadge status={record.verificationStatus} />
      </div>

      <p>
        這張卡只保留保守的安全邊界，不是 agent
        對這筆資料的整理答案，也不是正式任務。
      </p>

      <dl className="judgement-summary">
        <div>
          <dt>信心程度</dt>
          <dd>{confidenceLabels[judgement.confidence]}</dd>
        </div>
        <div>
          <dt>分類</dt>
          <dd>
            <span className={routingClassName}>
              {responsiblePartyLabels[judgement.responsibleParty]}
            </span>
          </dd>
        </div>
        <div>
          <dt>下一步</dt>
          <dd>{nextStepLabels[judgement.suggestedNextStep]}</dd>
        </div>
      </dl>

      <p>
        能否直接行動：
        <strong>
          {judgement.unsafeToActDirectly ? "不可直接行動" : "仍需確認情境"}
        </strong>
      </p>

      <p className="judgement-card__notice">
        分類不能取代人工確認；交給政府的事項也不能由這個前端原型自動通報。
      </p>

      <section>
        <h4>目前只有安全預設</h4>
        <ul>
          {judgement.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4>目前卡住的地方</h4>
        <ul>
          {judgement.blockers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
