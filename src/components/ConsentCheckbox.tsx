import { Checkbox } from "@/components/ui/checkbox";

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

const ConsentCheckbox = ({ id, checked, onChange, required = false }: ConsentCheckboxProps) => (
  <div className="flex items-start gap-3">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={(v) => onChange(v === true)}
      required={required}
      aria-required={required}
      className="mt-1 border-brand-mauve data-[state=checked]:bg-brand-mauve data-[state=checked]:text-brand-cream"
    />
    <label htmlFor={id} className="text-base leading-snug text-brand-ink cursor-pointer">
      Autorizo el tratamiento de mis datos personales según la{" "}
      <a
        href="/terminos-y-condiciones#datos"
        className="underline decoration-brand-gold underline-offset-2 text-brand-mauve hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
      >
        Política de Tratamiento de Datos
      </a>{" "}
      (Ley 1581 de 2012).
      {required && <span className="sr-only"> (obligatorio)</span>}
    </label>
  </div>
);

export default ConsentCheckbox;
