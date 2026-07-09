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

| 時間       | 階段       | 任務          | AI / Agent 建議                                                                                                   | 採用 / 拒絕                  | 人類判斷理由                                                                                  | 相關檔案 / commit                                                                                                                           |
| ---------- | ---------- | ------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 09:45      | Phase 0    | 分析原始資訊  | 建議把社群貼文直接轉成 verified report                                                                            | 拒絕                         | 社群貼文來源未確認，應保持 `needs_review`                                                     | `docs/phase0-observations.md`                                                                                                               |
| 2026-07-09 | Phase 0    | 加上初步分流  | Agent 建議在草稿中加入「志工可處理」「交給政府或官方單位」「先不要分派」分類與統計                                | 採用，但保留安全提醒         | 分流可以幫下一位協作者整理，但不能代表正式派工、官方通報或已確認事實                          | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `docs/phase0-observations.md`                     |
| 2026-07-09 | Phase 0    | 強化分流標示  | Agent 建議用綠色標示志工可處理、藍色標示政府或官方單位，並保留初步分流文案                                        | 採用                         | 顏色能幫助快速掃描，但不能把草稿誤認成正式任務或官方通報                                      | `src/features/phase-0/Phase0JudgementCard.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `src/styles/global.css`                         |
| 2026-07-09 | Phase 0    | 改善快速辨識  | Agent 建議把分流統計改成兩個大型分流箱，並列出已分類資料編號                                                      | 採用                         | 原本只有小色塊和數字，使用者無法快速知道哪些資料分到哪邊                                      | `src/features/phase-0/Phase0Workbench.tsx`, `src/styles/global.css`                                                                         |
| 2026-07-09 | Phase 0    | 左側直接標示  | Agent 建議把草稿狀態提升到首頁，讓左側原始資訊卡片直接顯示志工或政府標籤                                          | 採用                         | 使用者要快速掃左側列表，不應被迫先看右側統計或判斷卡                                          | `src/app/App.tsx`, `src/features/phase-0/Phase0RawInfoPanel.tsx`, `src/features/phase-0/Phase0Workbench.tsx`                                |
| 2026-07-09 | Phase 0    | 改回直覺分類  | 使用者指出「分流」不符合一開始想要的說法，Agent 建議改回「處理分類」「志工可處理」「交給政府」                    | 採用                         | 左側原始資訊卡需要直接看懂，避免用語增加理解成本                                              | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0RawInfoPanel.tsx`, `src/features/phase-0/Phase0JudgementCard.tsx` |
| 2026-07-09 | Phase 0    | 收斂成兩類    | 使用者選擇最簡單分類，Agent 將主要可選分類收斂成「志工可處理」與「交給政府」                                      | 採用                         | 畫面要回到最一開始的兩類需求，未選狀態只顯示尚未分類                                          | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0Workbench.tsx`                                                    |
| 2026-07-09 | Phase 0    | 移除左側按鈕  | 使用者不希望用按鈕，Agent 將左側改回只顯示分類結果，分類仍從右側草稿選單操作                                      | 採用                         | 左側是資訊掃描區，不應增加額外操作按鈕                                                        | `src/app/App.tsx`, `src/features/phase-0/Phase0RawInfoPanel.tsx`, `tests/app-smoke.test.tsx`                                                |
| 2026-07-09 | Phase 0    | 左側顯示建議  | 使用者希望左側不用按也顯示兩類，Agent 用關鍵字規則顯示「建議：志工可處理」或「建議：交給政府」                    | 採用                         | 未儲存草稿時只能顯示建議，避免把未確認資訊標成已確認分類                                      | `src/features/phase-0/Phase0RawInfoPanel.tsx`, `tests/app-smoke.test.tsx`                                                                   |
| 2026-07-09 | Release 01 | 使用者訪談    | Agent 依 `01-interview-kit` 模擬回報者、資訊整理者、行動者三個 persona，整理訪談紀錄、彙整與 v1 取捨草稿          | 採用為草稿，待人類刪改       | 這階段是需求分析，不修改 `src/`；AI 可以提供訪談整理，但不能替人類做最終產品決策              | `docs/interview-notes.md`, `docs/interview-summary.md`, `docs/decisions.md`                                                                 |
| 2026-07-09 | Release 01 | v1 使用者取捨 | Agent 原草稿傾向優先服務資訊整理者；使用者決定改為優先服務回報者                                                  | 採用人類決策                 | v1 應先降低回報門檻，讓不完整或轉述資訊能安全留下，且不能被自動改寫成已確認任務               | `docs/decisions.md`, `docs/interview-summary.md`                                                                                            |
| 2026-07-09 | Release 01 | 取捨細化      | Agent 用七個選擇題協助使用者細化「服務回報者」的意思                                                              | 採用人類答案                 | 使用者選擇回報友善、稍完整表單、親眼確認與轉述都要標示、分類可保留但只能是猜測                | `docs/decisions.md`                                                                                                                         |
| 2026-07-09 | Release 01 | 不確定處展開  | Agent 將 `docs/decisions.md` 的「我仍不確定的地方」擴寫為議題、可能作法與目前傾向                                 | 採用為思考草稿               | 這些不是最終決策，而是幫助人類下一步圈選表單、AI 輔助、分類顯示與人工確認作法                 | `docs/decisions.md`                                                                                                                         |
| 2026-07-09 | Release 01 | 不確定處整理  | Agent 將發散的可能作法整理為七個小節，每節保留目前想法、可能作法與還要確認的問題                                  | 採用為決策草稿               | 讓 `decisions.md` 更容易閱讀，也方便後續把不確定處轉成 v1 設計選擇                            | `docs/decisions.md`                                                                                                                         |
| 2026-07-09 | Release 01 | 開放式釐清    | Agent 用開放式問題引導使用者說出 v1 的語氣與核心方向                                                              | 採用人類回答                 | 使用者希望回報流程誠實有效率但細心，AI 溫柔追問時間，第一眼保留原文，避免假消息               | `docs/decisions.md`                                                                                                                         |
| 2026-07-09 | Phase 0    | 背景色調整    | Agent 將頁面整體背景改成米黃色，卡片與工作台維持白色                                                              | 採用                         | 使用者要求改背景顏色；只調整視覺，不改資料或分類判斷                                          | `src/styles/global.css`                                                                                                                     |
| 2026-07-09 | Phase 0    | 背景色加強    | Agent 將 hero 與主 panel 也改成米黃色系，外層背景加深                                                             | 採用                         | 原本只有頁面邊緣變色，主要區塊仍是白色，使用者看不出背景變更                                  | `src/styles/global.css`                                                                                                                     |
| 2026-07-09 | Phase 0    | 米黃色更明顯  | Agent 將外層、hero、panel、工作台容器都改成更深的米黃色                                                           | 採用                         | 使用者仍看不到米黃色，表示中心區塊仍太接近白色                                                | `src/styles/global.css`                                                                                                                     |
| 2026-07-09 | Release 02 | 流程設計      | Agent 依 `02-flow-design-kit`、訪談彙整與 v1 取捨，產生自然語言流程、Mermaid 流程圖、人工確認點與不能自動處理分支 | 採用為草稿，待人類預覽與修正 | 這階段只做流程設計，不修改 `src/`；流程必須保留原文、不把回報者猜測或 AI 提醒顯示成已確認分類 | `docs/flow.md`, `docs/ai-log.md`                                                                                                            |
| 2026-07-09 | Phase 0    | 建議分類統計  | Agent 將快速分類看板改為統計左側建議分類，因此「建議：志工可處理」初始顯示 8 筆                                   | 採用，但保留安全提醒         | 使用者希望看到 8；畫面需明確說明這是建議分類，不代表已確認、已派工或已通報                    | `src/features/phase-0/Phase0Workbench.tsx`, `src/features/phase-0/phase0-heuristics.ts`, `tests/app-smoke.test.tsx`                         |
| 2026-07-09 | Phase 0    | 選擇列表分類  | Agent 在「選擇原始資訊」列表也顯示建議分類或已儲存分類                                                            | 採用，但保留建議標示         | 使用者希望選擇列表也能看分類；未儲存草稿仍顯示為建議，避免誤認成已確認結果                    | `src/features/phase-0/Phase0Workbench.tsx`, `src/styles/global.css`, `tests/app-smoke.test.tsx`                                             |
| 2026-07-09 | Phase 0    | 詳細資料按鈕  | Agent 將原始資訊卡與選擇列表的操作文案統一為「查詢詳細資料」                                                      | 採用                         | 使用者希望每筆資料各自按按鈕查詢詳細資料；這只切換查看內容，不代表查核、派工或通報            | `src/features/phase-0/Phase0RawInfoPanel.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `tests/app-smoke.test.tsx`                       |
| 2026-07-09 | Phase 0    | 外層查詢入口  | Agent 將「選擇原始資訊」移到工作台外層，按「查詢資料」後選取該筆並跳到原始資訊區塊                                | 採用                         | 使用者修正互動方向；選擇入口應在外面，查詢後才進入原始資訊，不把查詢視為查核或派工            | `src/app/App.tsx`, `src/features/phase-0/Phase0RecordSelector.tsx`, `src/features/phase-0/Phase0Workbench.tsx`                              |
| 2026-07-09 | Phase 0    | 移除候選類型  | Agent 從草稿表單與摘要卡移除「候選類型」欄位                                                                      | 採用                         | 使用者不需要候選類型；保留分類、信心、下一步、依據與卡點，降低畫面負擔                        | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0JudgementCard.tsx`, `tests/app-smoke.test.tsx`                    |
| 2026-07-09 | Phase 0    | 查詢定位原文  | Agent 將外層「查詢資料」改為直接選取並捲到對應的原始資訊卡                                                        | 採用                         | 使用者希望按查詢後直接找到原始資料；這只是定位與查看，不代表查核或派工                        | `src/app/App.tsx`, `src/features/phase-0/Phase0RecordSelector.tsx`, `src/features/phase-0/Phase0RawInfoPanel.tsx`                           |
| 2026-07-09 | Phase 0    | 查詢結果框線  | Agent 將查詢到的原始資訊卡片加上明顯紅色外框                                                                      | 採用                         | 使用者希望找到原始資料後能用紅色框起來；外框只表示目前選取，不代表已確認                      | `src/styles/global.css`                                                                                                                     |
| 2026-07-09 | Phase 0    | 移除原文查詢  | Agent 移除原始資訊卡片裡的「查詢資料」按鈕，只保留外層選擇入口                                                    | 採用                         | 原始資訊卡片本身已經是資料內容，不需要重複查詢按鈕；查詢入口集中在外層選擇區                  | `src/features/phase-0/Phase0RawInfoPanel.tsx`, `src/app/App.tsx`, `tests/app-smoke.test.tsx`                                                |
| 2026-07-09 | Phase 0    | 移除整理草稿  | Agent 移除整理草稿表單、草稿儲存/刪除互動與草稿統計                                                               | 採用                         | 使用者不需要整理草稿；畫面保留原始資訊、查詢定位、建議分類與安全邊界提醒                      | `src/app/App.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `src/features/phase-0/Phase0JudgementCard.tsx`, `tests/app-smoke.test.tsx`   |
| 2026-07-09 | Phase 0    | 外部連結標示  | Agent 在「原始資訊」與「待人工確認」標題旁加入「反詐騙網站：https://165.npa.gov.tw/#/」連結                       | 採用                         | 這是使用者指定的外部參考連結；畫面仍保留未確認提醒，不把連結顯示成查核結果                    | `src/features/phase-0/Phase0RawInfoPanel.tsx`, `src/styles/global.css`, `tests/app-smoke.test.tsx`                                          |

## 課後反思

### AI 幫助最大的地方

-

### AI 最容易誤導的地方

-

### 下次使用 AI 開發前，我們會先準備

-
