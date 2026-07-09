import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/app/App";

describe("App", () => {
  it("renders starter title", () => {
    render(<App />);
    expect(screen.getByText("災害資訊整理工作台")).toBeInTheDocument();
  });

  it("shows both raw info and workbench on the phase 0 homepage", () => {
    render(<App />);

    expect(screen.getByText("原始資訊")).toBeInTheDocument();
    expect(screen.getByText("整理工作台")).toBeInTheDocument();
    const externalLinks = screen.getAllByText(
      "反詐騙網站：https://165.npa.gov.tw/#/",
    );
    expect(externalLinks).toHaveLength(2);
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "https://165.npa.gov.tw/#/");
    });
    expect(screen.queryByText("通報")).not.toBeInTheDocument();
    expect(screen.queryByText("地點")).not.toBeInTheDocument();
    expect(screen.queryByText("志工任務")).not.toBeInTheDocument();
    expect(screen.queryByText("人員指派")).not.toBeInTheDocument();
  });

  it("shows review states in the phase 0 workbench", () => {
    render(<App />);

    expect(
      screen.getByText(
        "第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("待人工確認").length).toBeGreaterThan(0);
    expect(screen.getAllByText("未查核").length).toBeGreaterThan(0);
  });

  it("keeps draft CRUD as learner work instead of starter output", () => {
    render(<App />);

    expect(screen.queryByText("整理草稿")).not.toBeInTheDocument();
    expect(screen.queryByText("儲存草稿")).not.toBeInTheDocument();
    expect(screen.getAllByText("目前仍是待確認資訊").length).toBeGreaterThan(0);
    expect(
      screen.queryByText(/已產生 \d+ 筆安全邊界草稿/),
    ).not.toBeInTheDocument();
  });

  it("lets learners sort saved drafts by tentative responsible party", () => {
    render(<App />);

    expect(screen.queryByLabelText("分類")).not.toBeInTheDocument();
    expect(screen.queryByText("候選類型")).not.toBeInTheDocument();
    expect(screen.getByText("快速分類看板")).toBeInTheDocument();
    expect(
      within(screen.getByLabelText("選擇原始資訊")).getAllByText("查詢資料")
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("查詢資料").length).toBe(12);
    fireEvent.click(screen.getByLabelText("查詢 M-005 原始資料"));
    expect(screen.getByLabelText("M-005 原始資訊")).toHaveClass(
      "record-card--selected",
    );
    fireEvent.click(screen.getByLabelText("查詢 M-001 原始資料"));
    expect(
      within(screen.getByLabelText("選擇原始資訊")).getAllByText(
        "建議：志工可處理",
      ).length,
    ).toBeGreaterThan(0);
    expect(
      within(screen.getByLabelText("選擇原始資訊")).getAllByText(
        "建議：交給政府",
      ).length,
    ).toBeGreaterThan(0);
    expect(
      within(screen.getByLabelText("M-001 原始資訊")).getByText(
        "建議：志工可處理",
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByLabelText("M-005 原始資訊")).getByText(
        "建議：交給政府",
      ),
    ).toBeInTheDocument();
    const volunteerSuggestionLabel = screen
      .getAllByText("建議：志工可處理")
      .find((element) => element.className === "routing-board__label");
    const governmentSuggestionLabel = screen
      .getAllByText("建議：交給政府")
      .find((element) => element.className === "routing-board__label");

    expect(volunteerSuggestionLabel).toBeDefined();
    expect(governmentSuggestionLabel).toBeDefined();

    const volunteerSuggestionLane =
      volunteerSuggestionLabel?.closest("section");
    expect(volunteerSuggestionLane).not.toBeNull();
    expect(within(volunteerSuggestionLane!).getByText("8")).toBeInTheDocument();

    const rawRecord = screen.getByLabelText("M-001 原始資訊");

    expect(rawRecord).toHaveClass("record-card--volunteer");
    expect(within(rawRecord).getByText("建議：志工可處理")).toBeInTheDocument();
  });
});
