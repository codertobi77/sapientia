// Textarea est défini canoniquement dans ./input (il existait déjà et est
// importé depuis plusieurs formulaires publics). On le ré-exporte ici pour
// exposer un point d'entrée `@/components/ui/textarea` pour le back-office,
// sans dupliquer l'implémentation ni casser les imports existants.
export { Textarea } from "./input";
