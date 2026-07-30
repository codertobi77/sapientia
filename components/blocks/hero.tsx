import Link from "next/link";
import Image from "next/image";
import { MonitorPlay, School, GraduationCap, Play, Award } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-navy text-white overflow-hidden min-h-[580px] lg:min-h-[660px]">
      {/* Image de l'école en arrière-plan côté droit */}
      <div className="absolute inset-0 lg:left-[42%]">
        <Image
          src="/ecole-hero.jpg"
          alt="Campus EFES SAPIENTIA"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        {/* Gradient overlay pour lisibilité */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/30 lg:via-navy/60 lg:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-navy/50 lg:hidden"
          aria-hidden
        />
      </div>

      <div className="container-site relative z-10 grid lg:grid-cols-5 min-h-[580px] lg:min-h-[660px]">
        {/* Colonne gauche (42%) */}
        <div className="lg:col-span-2 flex flex-col justify-center py-16 lg:py-20 pr-0 lg:pr-8">
          {/* Titre principal */}
          <h1 className="font-display text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.05] text-balance">
            Former aujourd&apos;hui
            <br />
            les éducateurs de{" "}
            <span className="text-gold">demain</span>
          </h1>

          <p className="mt-5 text-base text-white/80 leading-relaxed max-w-sm">
            EFES « SAPIENTIA » est une université privée spécialisée dans la
            formation des enseignants compétents, éthiques et innovants.
          </p>

          {/* Badge N°1 */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex flex-col items-center justify-center rounded-full bg-gold text-navy font-bold w-16 h-16 shrink-0 text-center leading-tight shadow-premium">
              <span className="text-xs font-extrabold">N°1</span>
              <Award className="h-4 w-4 mt-0.5" />
            </div>
            <p className="text-sm text-white/80 leading-snug max-w-[160px]">
              dans la formation<br />des enseignants<br />au Bénin
            </p>
          </div>

          {/* Cartes flottantes formation */}
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm">
            <Link
              href="/formation-distance"
              className="group rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 p-4 transition-all duration-200 hover:-translate-y-0.5"
            >
              <MonitorPlay className="h-6 w-6 text-gold mb-2" />
              <p className="text-sm font-bold leading-tight">Formation<br />à distance</p>
              <p className="text-xs text-white/65 mt-1 leading-snug">
                Apprenez où que vous soyez ! Accédez à nos cours en ligne et progressez à votre rythme avec l&apos;accompagnement de nos enseignants.
              </p>
            </Link>
            <Link
              href="/formation-presentiel"
              className="group rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 p-4 transition-all duration-200 hover:-translate-y-0.5"
            >
              <School className="h-6 w-6 text-gold mb-2" />
              <p className="text-sm font-bold leading-tight">Formation<br />en présentiel</p>
              <p className="text-xs text-white/65 mt-1 leading-snug">
                Vivez une expérience d&apos;apprentissage riche sur nos campus modernes avec des enseignants et des équipements de qualité.
              </p>
            </Link>
          </div>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-gold text-navy font-semibold text-sm hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
            >
              <GraduationCap className="h-4 w-4" />
              Découvrir nos formations
            </Link>
            <Link
              href="/galerie"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-200"
            >
              <Play className="h-4 w-4" />
              Voir la vidéo
            </Link>
          </div>
        </div>

        {/* Colonne droite vide — la photo occupe cet espace en background */}
        <div className="hidden lg:block lg:col-span-3" aria-hidden />
      </div>
    </section>
  );
}
