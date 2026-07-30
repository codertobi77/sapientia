"use client";

import * as React from "react";
import { Bold, Italic, List, ListOrdered, Quote, Link2, Heading2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * STUB — admin-foundations doit fournir la version canonique.
 * ---------------------------------------------------------------
 * Éditeur richtext léger basé sur contentEditable + document.execCommand.
 * Stocke du HTML (actualites.contenu). Aucune dépendance externe.
 *
 * Note : execCommand est déprécié mais reste fonctionnel et est le choix
 * retenu par la phase 2 pour un éditeur simple sans dépendance lourde.
 *
 * Le HTML produit est contrôlé via `value` / `onChange` (le parent gère
 * l'état). On synchronise le DOM via ref quand `value` change extérieurement
 * (ex: édition d'un enregistrement existant) sans perdre le focus.
 */

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Rédigez votre contenu…", id }: RichTextEditorProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const lastEmitted = React.useRef<string>(value);

  // Initialise / resync le contenu quand value change de l'extérieur.
  React.useEffect(() => {
    const el = ref.current;
    if (el && value !== el.innerHTML && value !== lastEmitted.current) {
      el.innerHTML = value || "";
      lastEmitted.current = value;
    }
  }, [value]);

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg);
    emit();
  }

  function addLink() {
    const url = window.prompt("URL du lien");
    if (url) exec("createLink", url);
  }

  function emit() {
    const html = ref.current?.innerHTML ?? "";
    lastEmitted.current = html;
    onChange(html);
  }

  const btn = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
  ) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-navy-50 transition-colors"
    >
      {icon}
    </button>
  );

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5 bg-cream">
        {btn("Gras", <Bold className="h-4 w-4" />, () => exec("bold"))}
        {btn("Italique", <Italic className="h-4 w-4" />, () => exec("italic"))}
        {btn("Titre", <Heading2 className="h-4 w-4" />, () => exec("formatBlock", "<h2>"))}
        {btn("Liste à puces", <List className="h-4 w-4" />, () => exec("insertUnorderedList"))}
        {btn("Liste numérotée", <ListOrdered className="h-4 w-4" />, () => exec("insertOrderedList"))}
        {btn("Citation", <Quote className="h-4 w-4" />, () => exec("formatBlock", "<blockquote>"))}
        {btn("Lien", <Link2 className="h-4 w-4" />, addLink)}
      </div>
      <div
        id={id}
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className={cn(
          "prose prose-sm max-w-none min-h-48 p-4 outline-none",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_blockquote]:italic",
          "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-3 [&_h2]:mb-2",
          "[&_a]:text-gold [&_a]:underline",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
        )}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #64748b;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
