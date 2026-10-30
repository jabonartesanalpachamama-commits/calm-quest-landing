import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AdminWaitlistPanel } from "./AdminWaitlistPanel";

const mocks = vi.hoisted(() => ({ update: vi.fn(), single: vi.fn(), row: {
  id: "test-row", nombre: "Prueba", correo: "prueba@example.com", whatsapp: null, pais: null,
  consentimiento_fecha: "2026-10-30T00:00:00Z", consentimiento_texto: "Consentimiento de prueba",
  estado: "en lista", created_at: "2026-10-30T00:00:00Z",
} }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => ({
  select: () => ({ order: () => Promise.resolve({ data: [mocks.row], error: null }) }),
  update: mocks.update,
}) } }));
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => <select aria-label="Estado" value={value} disabled={disabled} onChange={(e) => onValueChange(e.target.value)}>{children}</select>,
  SelectTrigger: () => null, SelectValue: () => null,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
}));

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  mocks.update.mockReturnValue({ eq: () => ({ select: () => ({ single: mocks.single }) }) });
});

describe("waitlist status changes", () => {
  it("offers exactly the four allowed states", async () => {
    render(<AdminWaitlistPanel />);
    await screen.findByRole("combobox");
    expect(screen.getAllByRole("option").map((o) => o.getAttribute("value"))).toEqual(["en lista", "avisada", "inscrita", "dada de baja"]);
  });
  it("saves only estado and exports the saved state", async () => {
    mocks.single.mockResolvedValue({ data: { id: "test-row", estado: "avisada" }, error: null });
    render(<AdminWaitlistPanel />);
    fireEvent.change(await screen.findByRole("combobox"), { target: { value: "avisada" } });
    await waitFor(() => expect(mocks.update).toHaveBeenCalledWith({ estado: "avisada" }));
    await screen.findByText("Guardado");
    let exported: Blob | undefined;
    URL.createObjectURL = vi.fn((blob: Blob) => { exported = blob; return "blob:test"; });
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    fireEvent.click(screen.getByRole("button", { name: "Exportar CSV" }));
    const content = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      if (exported) reader.readAsText(exported);
    });
    expect(content).toContain(';"avisada";');
    expect(content).not.toContain(';"en lista";');
  });
  it("restores the previous status when saving fails", async () => {
    mocks.single.mockResolvedValue({ data: null, error: { message: "denied" } });
    render(<AdminWaitlistPanel />);
    fireEvent.change(await screen.findByRole("combobox"), { target: { value: "inscrita" } });
    await screen.findByText("No se pudo guardar. Intenta de nuevo.");
    expect(screen.getByRole("combobox")).toHaveValue("en lista");
  });
});