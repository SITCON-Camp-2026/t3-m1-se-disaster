# AI Log

這份紀錄用來留下小組如何使用 AI / Coding Agent 的操作脈絡。重點不是逐字保存所有對話，而是記錄重要協作、取捨與人類判斷。

## 什麼時候要記錄

請在以下情況更新本檔案：

- AI 協助分析原始資訊。
- AI 協助找出不能判斷處。
- AI 協助判斷哪些資訊不能直接相信。
- AI 協助判斷哪些資訊不能直接變成任務。
- AI 協助修改畫面標示或前端工作台。
- AI 可能補了原文沒有的資訊。
- AI 建議被小組拒絕，且拒絕原因和安全 / 正確性 / scope 有關
- AI 輸出可能造成誤導，例如把未確認資料寫成已確認事實

## 不需要記錄

- 不需要逐字貼完整對話
- 不需要記錄每一次小型 autocomplete
- 不需要記錄單純修 typo 或格式化

## 紀錄格式

| 時間 | 階段 | 任務 | AI / Agent 建議 | 採用 / 拒絕 | 人類判斷理由 | 相關檔案 / commit |
| ---- | ---- | ---- | --------------- | ----------- | ------------ | ----------------- |
|      |      |      |                 |             |              |                   |

## 範例

| 時間       | 階段    | 任務         | AI / Agent 建議                                                                                | 採用 / 拒絕          | 人類判斷理由                                                         | 相關檔案 / commit                                                                                                                           |
| ---------- | ------- | ------------ | ---------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 09:45      | Phase 0 | 分析原始資訊 | 建議把社群貼文直接轉成 verified report                                                         | 拒絕                 | 社群貼文來源未確認，應保持 `needs_review`                            | `docs/phase0-observations.md`                                                                                                               |
| 2026-07-09 | Phase 0 | 加上初步分流 | Agent 建議在草稿中加入「志工可處理」「交給政府或官方單位」「先不要分派」分類與統計             | 採用，但保留安全提醒 | 分流可以幫下一位協作者整理，但不能代表正式派工、官方通報或已確認事實 | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `docs/phase0-observations.md`                     |
| 2026-07-09 | Phase 0 | 強化分流標示 | Agent 建議用綠色標示志工可處理、藍色標示政府或官方單位，並保留初步分流文案                     | 採用                 | 顏色能幫助快速掃描，但不能把草稿誤認成正式任務或官方通報             | `src/features/phase-0/Phase0JudgementCard.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `src/styles/global.css`                         |
| 2026-07-09 | Phase 0 | 改善快速辨識 | Agent 建議把分流統計改成兩個大型分流箱，並列出已分類資料編號                                   | 採用                 | 原本只有小色塊和數字，使用者無法快速知道哪些資料分到哪邊             | `src/features/phase-0/Phase0Workbench.tsx`, `src/styles/global.css`                                                                         |
| 2026-07-09 | Phase 0 | 左側直接標示 | Agent 建議把草稿狀態提升到首頁，讓左側原始資訊卡片直接顯示志工或政府標籤                       | 採用                 | 使用者要快速掃左側列表，不應被迫先看右側統計或判斷卡                 | `src/app/App.tsx`, `src/features/phase-0/Phase0RawInfoPanel.tsx`, `src/features/phase-0/Phase0Workbench.tsx`                                |
| 2026-07-09 | Phase 0 | 改回直覺分類 | 使用者指出「分流」不符合一開始想要的說法，Agent 建議改回「處理分類」「志工可處理」「交給政府」 | 採用                 | 左側原始資訊卡需要直接看懂，避免用語增加理解成本                     | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0RawInfoPanel.tsx`, `src/features/phase-0/Phase0JudgementCard.tsx` |
| 2026-07-09 | Phase 0 | 收斂成兩類   | 使用者選擇最簡單分類，Agent 將主要可選分類收斂成「志工可處理」與「交給政府」                   | 採用                 | 畫面要回到最一開始的兩類需求，未選狀態只顯示尚未分類                 | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0Workbench.tsx`                                                    |
| 2026-07-09 | Phase 0 | 移除左側按鈕 | 使用者不希望用按鈕，Agent 將左側改回只顯示分類結果，分類仍從右側草稿選單操作                   | 採用                 | 左側是資訊掃描區，不應增加額外操作按鈕                               | `src/app/App.tsx`, `src/features/phase-0/Phase0RawInfoPanel.tsx`, `tests/app-smoke.test.tsx`                                                |
| 2026-07-09 | Phase 0 | 左側顯示建議 | 使用者希望左側不用按也顯示兩類，Agent 用關鍵字規則顯示「建議：志工可處理」或「建議：交給政府」 | 採用                 | 未儲存草稿時只能顯示建議，避免把未確認資訊標成已確認分類             | `src/features/phase-0/Phase0RawInfoPanel.tsx`, `tests/app-smoke.test.tsx`                                                                   |

## 課後反思

### AI 幫助最大的地方

-

### AI 最容易誤導的地方

-

### 下次使用 AI 開發前，我們會先準備

-
