import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ReviewCapture } from "./ReviewCapture";
import { FEATURED_RESENAS } from "@/data/resenas";

afterEach(cleanup);
it("opens the original screenshot on one click and unmounts enlargement on Escape", async () => {
  const review = FEATURED_RESENAS[0];
  if (!review) throw new Error("Missing featured review");
  render(<ReviewCapture resena={review} />);
  fireEvent.click(screen.getByRole("button", { name: `Ampliar reseña de ${review.nombre}` }));
  const dialog = screen.getByRole("dialog");
  expect(dialog.querySelector("img")?.getAttribute("src")).toBe(review.img);
  fireEvent.keyDown(dialog, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});