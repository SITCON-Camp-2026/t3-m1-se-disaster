import { useState } from "react";
import messyReports from "../fixtures/phase-0/messy-reports.json";
import { EmptyState } from "../components/EmptyState";
import { Phase0RecordSelector } from "../features/phase-0/Phase0RecordSelector";
import { Phase0RawInfoPanel } from "../features/phase-0/Phase0RawInfoPanel";
import { Phase0Workbench } from "../features/phase-0/Phase0Workbench";
import type { Phase0MessyRecord } from "../features/phase-0/phase0-types";

const phase0Records = messyReports satisfies Phase0MessyRecord[];
const emptyDrafts = {};

export function App() {
  const [selectedRecordId, setSelectedRecordId] = useState(
    phase0Records[0]?.id ?? "",
  );

  function queryRecord(recordId: string) {
    setSelectedRecordId(recordId);
    const rawRecord = document.getElementById(`phase0-record-${recordId}`);
    if (typeof rawRecord?.scrollIntoView === "function") {
      rawRecord.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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
          <div className="phase0-page">
            <Phase0RecordSelector
              records={phase0Records}
              drafts={emptyDrafts}
              selectedRecordId={selectedRecordId}
              onQuery={queryRecord}
            />
            <div className="phase0-split">
              <Phase0RawInfoPanel
                records={phase0Records}
                drafts={emptyDrafts}
                selectedRecordId={selectedRecordId}
              />
              <Phase0Workbench
                records={phase0Records}
                selectedRecordId={selectedRecordId}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
