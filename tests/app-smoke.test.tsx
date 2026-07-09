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

    expect(screen.getAllByText("尚未建立整理草稿").length).toBeGreaterThan(0);
    expect(
      screen.getByText(/草稿可建立、編輯、刪除或重設/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/已產生 \d+ 筆安全邊界草稿/),
    ).not.toBeInTheDocument();
  });

  it("lets learners sort saved drafts by tentative responsible party", () => {
    render(<App />);

    expect(screen.getByLabelText("分類")).toBeInTheDocument();
    expect(screen.getByText("快速分類看板")).toBeInTheDocument();
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
    expect(screen.getAllByText("交給政府").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText("分類"), {
      target: { value: "government" },
    });
    fireEvent.click(screen.getByText("儲存草稿"));

    expect(screen.getAllByText("交給政府").length).toBeGreaterThan(0);

    const governmentLaneLabel = screen
      .getAllByText("交給政府")
      .find((element) => element.className === "routing-board__label");
    const governmentLane = governmentLaneLabel?.closest("section");

    expect(governmentLane).not.toBeNull();
    expect(within(governmentLane!).getByText("M-001")).toBeInTheDocument();

    const rawRecord = screen.getByLabelText("M-001 原始資訊");

    expect(rawRecord).toHaveClass("record-card--government");
    expect(within(rawRecord).getByText("交給政府")).toBeInTheDocument();
  });
});
