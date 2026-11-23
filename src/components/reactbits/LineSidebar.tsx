/** Source: https://reactbits.dev/r/LineSidebar-TS-TW.json
 * React Bits — MIT with Commons Clause. Editorial links with hover/focus photo preview. */
import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ProgramPhoto } from "./ProgramPhoto";
import { useDesktop } from "./useDesktop";
import type { PhotoProgram } from "./types";
import "./reactbits.css";

export default function LineSidebar({ items }: { items: readonly PhotoProgram[] }) {
  const [preview, setPreview] = useState(0);
  const reduce = useReducedMotion();
  const desktop = useDesktop();
  const photo = items[preview];
  return <div className="rb-scene grid md:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20 items-start" data-line-sidebar="">
    <ul className="min-w-0 border-t border-border">
      {items.map((item, index) => <li key={item.href} className="border-b border-border">
        <Link to={item.href} className="rb-option block focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold focus-visible:outline-offset-4 hover:text-brand-mauve"
          onFocus={() => setPreview(index)} onMouseEnter={() => setPreview(index)}>{item.title}</Link>
      </li>)}
    </ul>
    {desktop && photo && <div aria-hidden="true" className="rb-path-panel-photo relative w-full overflow-hidden bg-brand-ink">
      <AnimatePresence initial={false}>
        <motion.div key={photo.href} className="absolute inset-0" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .9 }}>
          <ProgramPhoto item={photo} first={preview === 0} sizes="(min-width: 768px) 42vw, 100vw" />
        </motion.div>
      </AnimatePresence>
    </div>}
  </div>;
}
