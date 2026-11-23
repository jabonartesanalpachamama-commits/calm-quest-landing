import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VideoEmbed from "./VideoEmbed";

describe("VideoEmbed opt-in autoplay", () => {
  it("keeps existing embeds click-to-play", () => {
    const { container, unmount } = render(<VideoEmbed youtubeId="WujmEv3pb7o" title="Conversación" />);
    expect(container.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Reproducir video: Conversación" }));
    expect(container.querySelector("iframe")?.src).toContain("youtube-nocookie.com/embed/WujmEv3pb7o?autoplay=1");
    unmount();
  });
  it("starts the selected video immediately and removes its iframe on unmount", () => {
    const { container, unmount } = render(<VideoEmbed youtubeId="3BfkjKeEL5Q" title="Decisiones" autoplay />);
    expect(container.querySelector("iframe")?.src).toContain("youtube-nocookie.com/embed/3BfkjKeEL5Q?autoplay=1");
    unmount();
    expect(container.querySelector("iframe")).toBeNull();
  });
});