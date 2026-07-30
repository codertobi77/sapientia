"use client";

import * as React from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Éditeur richtext léger (sans dépendance lourde) basé sur contentEditable +
 * document.execCommand. Le HTML produit est stocké tel quel dans actualites.contenu.
 *
 * `document.execCommand` est officiellement déprécié mais reste supporté par
 * tous les navigateurs et convient pour un back-office interne simple. On
 * dégrade proprement : si execCommand est indisponible, les boutons deviennent
 * inactifs et l'éditeur reste un contentEditable que l'utilisateur peut éditer.
 *
 * Props :
 * - value : HTML initial (appliqué une fois au montage via dangerouslySetInnerHTML).
 * - onChanged(html) : appelé à chaque input avec le innerHTML.
 * - placeholder, className, ariaLabel.
 *
 * Non contrôlé strict (on ne réinjecte pas value à chaque rendu pour ne pas
 * casser le curseur). Le parent synchronise via onChanged.
 */
export function RichTextEditor({
  value,
  onChanged,
  placeholder = "Saisissez votre contenu…",
  className,
  ariaLabel = "Éditeur de texte enrichi",
}: {
  value?: string;
  onChanged: (html: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [canExec] = React.useState(
    () => typeof document !== "undefined" && typeof document.execCommand === "function",
  );
  const [empty, setEmpty] = React.useState(!value);

  // Inject initial content once on mount.
  React.useEffect(() => {
    const editor = ref.current;
    if (editor && value && !editor.innerHTML) {
      editor.innerHTML = value;
      setEmpty(!editor.textContent);
    }
  }, [value]);

  function exec(command: string, arg?: string) {
    const editor = ref.current;
    if (!editor || !canExec) return;
    editor.focus();
    document.execCommand(command, false, arg);
    onChanged(editor.innerHTML);
    setEmpty(!editor.textContent);
  }

  function onLink() {
    const editor = ref.current;
    if (!editor || !canExec) return;
    const url = window.prompt("URL du lien :", "https://");
    if (!url) return;
    exec("createLink", url);
  }

  function onInput() {
    const editor = ref.current;
    if (!editor) return;
    onChanged(editor.innerHTML);
    setEmpty(!editor.textContent);
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white shadow-premium overflow-hidden",
        className,
      )}
    >
      <div
        role="toolbar"
        aria-label="Mise en forme"
        className="flex flex-wrap items-center gap-1 border-b border-border bg-navy-50 px-2 py-1.5"
      >
        <RteBtn onClick={() => exec("bold")} disabled={!canExec} label="Gras (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </RteBtn>
        <RteBtn onClick={() => exec("italic")} disabled={!canExec} label="Italique (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </RteBtn>
        <Sep />
        <RteBtn onClick={() => exec("formatBlock", "<h2>")} disabled={!canExec} label="Titre niveau 2">
          <Heading2 className="h-4 w-4" />
        </RteBtn>
        <RteBtn onClick={() => exec("formatBlock", "<h3>")} disabled={!canExec} label="Titre niveau 3">
          <Heading3 className="h-4 w-4" />
        </RteBtn>
        <Sep />
        <RteBtn onClick={() => exec("insertUnorderedList")} disabled={!canExec} label="Liste à puces">
          <List className="h-4 w-4" />
        </RteBtn>
        <RteBtn onClick={() => exec("insertOrderedList")} disabled={!canExec} label="Liste numérotée">
          <ListOrdered className="h-4 w-4" />
        </RteBtn>
        <Sep />
        <RteBtn onClick={onLink} disabled={!canExec} label="Insérer un lien">
          <Link2 className="h-4 w-4" />
        </RteBtn>
      </div>
      <div className="relative">
        {empty ? (
          <div
            className="pointer-events-none absolute left-4 top-3 text-sm text-muted"
            aria-hidden
          >
            {placeholder}
          </div>
        ) : null}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label={ariaLabel}
          aria-multiline="true"
          onInput={onInput}
          onBlur={onInput}
          className="prose prose-sm max-w-none min-h-48 px-4 py-3 text-ink outline-none [&_a]:text-navy [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-navy [&_h3]:mt-2 [&_h3]:mb-1"
        />
      </div>
    </div>
  );
}

function RteBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-navy transition-colors hover:bg-navy hover:text-white disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />;
}
