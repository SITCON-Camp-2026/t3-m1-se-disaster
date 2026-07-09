import { useState } from "react";
import messyReports from "../fixtures/phase-0/messy-reports.json";
import { EmptyState } from "../components/EmptyState";
import { Phase0RawInfoPanel } from "../features/phase-0/Phase0RawInfoPanel";
import { Phase0Workbench } from "../features/phase-0/Phase0Workbench";
import type {
  Phase0JudgementDraft,
  Phase0MessyRecord,
} from "../features/phase-0/phase0-types";

const phase0Records = messyReports satisfies Phase0MessyRecord[];

export function App() {
  const [selectedRecordId, setSelectedRecordId] = useState(
    phase0Records[0]?.id ?? "",
  );
  const [drafts, setDrafts] = useState<Record<string, Phase0JudgementDraft>>(
    {},
  );

  function saveDraft(draft: Phase0JudgementDraft) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [draft.messyRecordId]: draft,
    }));
  }

  function deleteDraft(recordId: string) {
    setDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };
      delete nextDrafts[recordId];
      return nextDrafts;
    });
  }

  return (
    <main className="layout">
      <header className="hero">
        <p className="eyebrow">SITCON Camp 2026</p>
        <h1>災害資訊整理工作台</h1>
        <p>
          第一階段先用 coding agent
          做出可展示的前端原型，再從成果中看見資料品質、角色、狀態與來源的限制。
        </p>
      </header>

      <section className="panel">
        {phase0Records.length === 0 ? (
          <EmptyState message="目前沒有資料" />
        ) : (
          <div className="phase0-split">
            <Phase0RawInfoPanel
              records={phase0Records}
              drafts={drafts}
              selectedRecordId={selectedRecordId}
              onSelect={setSelectedRecordId}
            />
            <Phase0Workbench
              records={phase0Records}
              drafts={drafts}
              selectedRecordId={selectedRecordId}
              onSelect={setSelectedRecordId}
              onSaveDraft={saveDraft}
              onDeleteDraft={deleteDraft}
            />
          </div>
        )}
      </section>
    </main>
  );
}
