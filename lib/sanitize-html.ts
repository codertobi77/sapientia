/**
 * Sanitizer HTML léger (sans dépendance externe) pour le contenu richtext des
 * actualites. Conçu pour du HTML produit par un back-office administrateur
 * (RichTextEditor), pas pour du contenu venant d'utilisateurs non authentifiés.
 *
 * Objectifs :
 *  - retirer les balises dangereuses (script, style, iframe, object, …) ;
 *  - retirer tous les gestionnaires d'événements (on*) et URI `javascript:` ;
 *  - retirer les attributs résiduels laissés par l'éditeur
 *    (data-path-to-node, data-index-in-node, …) qui polluent le rendu public ;
 *  - conserver les balises de formatage attendues (h1-h3, p, ul, ol, li,
 *    blockquote, a, b/strong, i/em, u, s, br, hr, img, div, span).
 *
 * Note : on n'utilise PAS `dangerouslySetInnerHTML` directement sur la chaîne
 * brute — on passe toujours par `sanitizeArticleHtml()` côté serveur avant de
 * transmettre le HTML nettoyé au composant qui l'affiche.
 */

const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "div", "span", "br", "hr",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "b", "strong", "i", "em", "u", "s", "strike", "sub", "sup",
  "img",
  "figure", "figcaption",
]);

// Attributs globaux autorisés + spécifiques à certaines balises.
const ALLOWED_ATTRS_BY_TAG: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height"]),
  "*": new Set(["style", "class"]), // style réservé à l'alignement explicite
};

const SKIP_TAGS = new Set([
  "script", "style", "iframe", "object", "embed", "link", "meta",
  "base", "form", "input", "button", "textarea", "select", "option",
  "applet", "noscript", "template", "title", "head", "html", "body",
]);

// Préfixes d'attributs à retirer systématiquement.
const STRIP_ATTR_PREFIXES = ["data-", "on"];

/**
 * Vérifie qu'une URL est sûre. Autorise http(s), mailto, tel, ancres (#),
 * chemins absolus (/…) ou relatifs (./…, ../…), et URLs sans schéma.
 * Bloque javascript:, vbscript:, file:, about:, blob:.
 * Les images data:image/... sont autorisées quand forImage=true.
 */
function safeUrl(url: string, forImage: boolean): boolean {
  const v = url.trim().toLowerCase();
  if (!v) return false;
  if (forImage && v.startsWith("data:image/")) return true;
  if (/^(javascript|vbscript|file|about|blob):/.test(v)) return false;
  if (/^(https?|mailto|tel):/.test(v)) return true;
  if (/^(#|\/|\.)/.test(v)) return true;
  return !/^[a-z][a-z0-9+.-]*:/i.test(v);
}

/**
 * Nettoie une valeur d'attribut `style` : on ne garde que les propriétés
 * d'alignement / décoration / dimensionnement sûres. Bloque `url()`.
 */
function safeStyle(style: string): string {
  const allowed = new Set([
    "text-align", "text-decoration", "font-weight", "font-style",
    "color", "background-color", "width", "max-width", "height",
    "margin", "margin-top", "margin-bottom", "margin-left", "margin-right",
    "padding", "border-radius",
  ]);
  return style
    .split(";")
    .map((decl) => {
      const idx = decl.indexOf(":");
      if (idx === -1) return "";
      const prop = decl.slice(0, idx).trim().toLowerCase();
      const val = decl.slice(idx + 1).trim();
      if (!allowed.has(prop)) return "";
      // Bloque `url()` dans les styles (anti exfiltration / tracking).
      if (/url\(/i.test(val)) return "";
      return `${prop}: ${val}`;
    })
    .filter(Boolean)
    .join("; ");
}

/**
 * Nettoie le HTML d'un article. À exécuter côté serveur (Server Component)
 * avant tout rendu via `dangerouslySetInnerHTML`.
 *
 * Implémentation DOM-based : on parse dans un document détaché, on re-parcourt
 * l'arbre en supprimant/migrant les noeuds interdits. Robuste contre les
 * tentatives de contournement par imbrication.
 */
export function sanitizeArticleHtml(html: string): string {
  if (!html) return "";

  // Côté serveur (Node, sans DOM) : repli sur une sanitization par regex
  // structurée. Côté client : on exploite le DOM pour la robustesse.
  if (typeof document === "undefined") {
    return sanitizeHtmlServer(html);
  }

  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  walk(tpl.content);
  return tpl.innerHTML;
}

function walk(root: DocumentFragment | Element): void {
  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType === 1 /* ELEMENT */) {
      sanitizeElement(node as Element);
    } else if (node.nodeType !== 3 /* TEXT */ && node.nodeType !== 8 /* COMMENT */) {
      node.parentNode?.removeChild(node);
    }
  }
}

function sanitizeElement(el: Element): void {
  const tag = el.tagName.toLowerCase();

  // Retire les balises à ignorer mais en garde le contenu inline (script → supprimé).
  if (SKIP_TAGS.has(tag)) {
    if (tag === "script" || tag === "style" || tag === "noscript" || tag === "template") {
      el.parentNode?.removeChild(el);
      return;
    }
    // Pour les autres (head/title…), on dissout le conteneur et garde les enfants.
    while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
    el.parentNode?.removeChild(el);
    return;
  }

  if (!ALLOWED_TAGS.has(tag)) {
    // Balise non listée : on dissout le conteneur (garde le contenu inline).
    while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
    el.parentNode?.removeChild(el);
    return;
  }

  // Nettoyage des attributs.
  const isImage = tag === "img";
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase();
    const value = attr.value;

    if (STRIP_ATTR_PREFIXES.some((p) => name.startsWith(p))) {
      el.removeAttribute(name);
      continue;
    }

    const allowed =
      ALLOWED_ATTRS_BY_TAG["*"].has(name) ||
      (ALLOWED_ATTRS_BY_TAG[tag]?.has(name) ?? false);

    if (!allowed) {
      el.removeAttribute(name);
      continue;
    }

    if (name === "href" || (isImage && name === "src")) {
      if (!safeUrl(value, isImage)) {
        el.removeAttribute(name);
        continue;
      }
    }

    if (name === "style") {
      const cleaned = safeStyle(value);
      if (cleaned) el.setAttribute("style", cleaned);
      else el.removeAttribute("style");
    }

    if (name === "target" && value === "_blank") {
      el.setAttribute("rel", "noopener noreferrer");
    }
  }

  // Une image sans src sûr : on retire.
  if (isImage && !el.getAttribute("src")) {
    el.parentNode?.removeChild(el);
    return;
  }

  // Récursion.
  walk(el);
}

/* -------------------------------------------------------------------------- */
/* Sanitization côté serveur (sans DOM)                                      */
/* -------------------------------------------------------------------------- */

const TAG_RE = /<\/?[a-zA-Z][^>]*>/g;
const ATTR_RE = /\s([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;

function sanitizeHtmlServer(html: string): string {
  // On retire d'abord les blocs <script>/<style>/<noscript> complets.
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<template[\s\S]*?<\/template>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  return stripped.replace(TAG_RE, (tag) => sanitizeTag(tag));
}

function sanitizeTag(tag: string): string {
  const closing = tag.startsWith("</");
  const inner = tag.slice(closing ? 2 : 1, -1).trim();
  const spaceIdx = inner.indexOf(" ");
  const tagname = (spaceIdx === -1 ? inner : inner.slice(0, spaceIdx)).toLowerCase();

  if (closing) {
    return ALLOWED_TAGS.has(tagname) ? `</${tagname}>` : "";
  }
  if (!ALLOWED_TAGS.has(tagname)) return "";
  const selfClose = inner.endsWith("/");
  const isImage = tagname === "img";

  let attrs: Array<{ name: string; value: string }> = [];
  let m: RegExpExecArray | null;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(tag)) !== null) {
    const name = (m[1] || "").toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    if (STRIP_ATTR_PREFIXES.some((p) => name.startsWith(p))) continue;
    const allowed =
      ALLOWED_ATTRS_BY_TAG["*"].has(name) ||
      (ALLOWED_ATTRS_BY_TAG[tagname]?.has(name) ?? false);
    if (!allowed) continue;
    if (name === "href" || (isImage && name === "src")) {
      if (!safeUrl(value, isImage)) continue;
    }
    if (name === "style") {
      const cleaned = safeStyle(value);
      if (!cleaned) continue;
      attrs.push({ name, value: cleaned });
      continue;
    }
    if (name === "target" && value === "_blank") {
      attrs = attrs.filter((a) => a.name !== "rel");
      attrs.push({ name: "rel", value: "noopener noreferrer" });
    }
    attrs.push({ name, value });
  }

  if (isImage && !attrs.some((a) => a.name === "src")) return "";

  const attrStr = attrs.length
    ? " " + attrs.map((a) => a.name + "=\"" + a.value.replace(/"/g, "") + "\"").join(" ")
    : "";
  const voidTags = new Set(["br", "hr", "img"]);
  if (voidTags.has(tagname)) return "<" + tagname + attrStr + (selfClose ? " />" : ">");
  return "<" + tagname + attrStr + ">";
}
