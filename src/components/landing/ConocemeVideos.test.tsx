import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ConocemeVideos from "./ConocemeVideos";

describe("Introduction video playback", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  it("opens WujmEv3pb7o with autoplay after one click and unmounts on close", async () => {
    render(<ConocemeVideos />);
    expect(document.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Reproducir video: Quién soy, cómo te acompaño" }));
    const iframe = document.querySelector("iframe");
    expect(iframe?.src).toContain("https://www.youtube-nocookie.com/embed/WujmEv3pb7o?autoplay=1");
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(document.querySelector("iframe")).toBeNull());
  });
});