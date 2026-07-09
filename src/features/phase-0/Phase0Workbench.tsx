import { useState } from "react";
import { RecordCard } from "../../components/RecordCard";
import { Phase0JudgementCard } from "./Phase0JudgementCard";
import {
  createPhase0Judgement,
  suggestPhase0ResponsibleParty,
} from "./phase0-heuristics";
import type { Phase0MessyRecord, Phase0UserRole } from "./phase0-types";

export function Phase0Workbench({
  records,
  selectedRecordId,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
}) {
  const [userRole, setUserRole] = useState<Phase0UserRole>("volunteer");
  const selectedRecord =
    records.find((record) => record.id === selectedRecordId) ?? records[0];
  const safetyBoundary = createPhase0Judgement(selectedRecord);
  const volunteerSuggestionIds = records
    .filter((record) => suggestPhase0ResponsibleParty(record) === "volunteer")
    .map((record) => record.id);
  const governmentSuggestionIds = records
    .filter((record) => suggestPhase0ResponsibleParty(record) === "government")
    .map((record) => record.id);
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
        <div className="workbench__main">
          <RecordCard record={selectedRecord} />

          <Phase0JudgementCard
            judgement={safetyBoundary}
            record={selectedRecord}
          />
        </div>

        <aside className="workbench__checklist">
          <h3>快速分類看板</h3>
          <div className="routing-board" aria-label="快速分類看板">
            <section
              className={`routing-board__lane routing-board__lane--volunteer ${
                userRole === "volunteer"
                  ? "routing-board__lane--highlighted"
                  : ""
              }`}
            >
              <p className="routing-board__label">建議：志工可處理</p>
              <p className="routing-board__count">
                {volunteerSuggestionIds.length}
              </p>
              <p className="routing-board__ids">
                {volunteerSuggestionIds.join("、")}
              </p>
            </section>
            <section
              className={`routing-board__lane routing-board__lane--government ${
                userRole === "government"
                  ? "routing-board__lane--highlighted"
                  : ""
              }`}
            >
              <p className="routing-board__label">建議：交給政府</p>
              <p className="routing-board__count">
                {governmentSuggestionIds.length}
              </p>
              <p className="routing-board__ids">
                {governmentSuggestionIds.join("、")}
              </p>
            </section>
          </div>

          <p className="workbench__hint">
            這裡統計建議分類，不代表已確認、已派工或已通報。
          </p>

          <div className="role-selector">
            <button
              className={`role-btn ${userRole === "volunteer" ? "role-btn--active" : ""}`}
              onClick={() => setUserRole("volunteer")}
            >
              🧑‍🤝‍🧑 志工
            </button>
            <button
              className={`role-btn ${userRole === "government" ? "role-btn--active" : ""}`}
              onClick={() => setUserRole("government")}
            >
              🏛️ 政府部門
            </button>
          </div>

          <h3>我的身份</h3>

          <h3>第一階段完成檢查</h3>
          <ul>
            <li>Starter 已載入 {records.length} 筆原始資訊</li>
            <li>可查看每筆原始資訊與建議分類</li>
            <li>建議分類不能取代人工確認</li>
            <li>把資料品質問題寫進 observations，並記錄 AI 哪裡不能直接相信</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
