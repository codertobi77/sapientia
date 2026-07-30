import Link from "next/link";
import { ArrowRight, GraduationCap, MonitorPlay, Award } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-navy text-white overflow-hidden">
      <div className="container-site grid lg:grid-cols-5 min-h-[600px] lg:min-h-[680px]">
        {/* Colonne gauche (40%) */}
        <div className="lg:col-span-2 flex flex-col justify-center py-16 lg:py-24 pr-0 lg:pr-10">
          <span className="badge-gold inline-flex items-center gap-2 self-start rounded-full bg-gold text-navy text-xs font-bold uppercase tracking-wider px-4 py-1.5 mb-6">
            <Award className="h-4 w-4" />
            N°1 dans la formation des enseignants au Bénin
          </span>

          <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] text-balance">
            Formez les <span className="text-gold">enseignants</span> de demain au cœur du <span className="text-gold">Bénin</span>.
          </h1>

          <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-md">
            L'EFES « SAPIENTIA » propose des formations en présentiel et à distance, sur 4 campus,
            pour une pédagogie innovante et accessible à tous.
          </p>

          {/* Cartes flottantes formation */}
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            <Link
              href="/formation-distance"
              className="group rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 p-4 transition-colors"
            >
              <MonitorPlay className="h-6 w-6 text-gold mb-2" />
              <p className="text-sm font-semibold">Formation à distance</p>
              <p className="text-xs text-white/70">E-learning</p>
            </Link>
            <Link
              href="/formation-presentiel"
              className="group rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 p-4 transition-colors"
            >
              <GraduationCap className="h-6 w-6 text-gold mb-2" />
              <p className="text-sm font-semibold">Formation en présentiel</p>
              <p className="text-xs text-white/70">Sur campus</p>
            </Link>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 h-13 px-8 rounded-full bg-gold text-navy font-semibold hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
            >
              S'inscrire
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 h-13 px-8 rounded-full bg-navy-700 text-white font-semibold hover:bg-navy-600 transition-colors"
            >
              Nos formations
            </Link>
          </div>
        </div>

        {/* Colonne droite (60%) — photo */}
        <div className="lg:col-span-3 relative min-h-[320px] lg:min-h-full -mx-6 lg:mx-0">
          <div
            className="absolute inset-0 bg-gradient-to-br from-navy via-navy-700 to-gold/30"
            aria-hidden
          />
          <div className="relative h-full min-h-[320px] lg:min-h-full flex items-center justify-center p-10 lg:p-16">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div className="text-center px-8">
                <GraduationCap className="h-16 w-16 text-gold mx-auto mb-4" />
                <p className="font-display text-2xl font-bold">Campus EFES « SAPIENTIA »</p>
                <p className="text-white/70 mt-2">
                  Étudiants en uniforme, salles modernes, enseignants qualifiés.
                </p>
              </div>
              {/* motif décoratif */}
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gold/20 blur-xl" aria-hidden />
              <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-xl" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
