import { forwardRef } from "react";

/** Off-screen trap field: humans never fill it; bots usually do. */
const Honeypot = forwardRef<HTMLInputElement>((_, ref) => (
  <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
    <label>
      Sitio web
      <input ref={ref} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </label>
  </div>
));
Honeypot.displayName = "Honeypot";

export const isTrapped = (el: HTMLInputElement | null) => !!el && el.value.trim() !== "";

export default Honeypot;
