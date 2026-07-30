-- ============================================================
-- EFES « SAPIENTIA » — Données initiales (seed)
-- ============================================================

-- Formations (9 filières)
insert into public.formations (slug, titre, description, objectifs, debouches, conditions_admission, modalites_inscription, type, icone, ordre) values
  ('lettres-modernes', 'Lettres Modernes', 'Une formation d''excellence en littérature, langue et civilisation françaises et africaines, ouverte à l''enseignement et à la recherche.', 'Maîtriser la langue et la littérature ; préparer aux métiers de l''enseignement et de la culture.', 'Enseignant de lettres, correcteur, rédacteur, journaliste, chargé de communication.', 'Baccalauréat ou équivalent ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes, lettre de motivation.', 'LES_DEUX', 'book-open', 1),
  ('mathematiques', 'Mathématiques', 'Formation rigoureuse en mathématiques fondamentales et appliquées, pour enseigner et modéliser.', 'Renforcer la logique, la modélisation et la didactique des mathématiques.', 'Enseignant de mathématiques, analyste de données, statisticien, chercheur.', 'Baccalauréat scientifique ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes.', 'LES_DEUX', 'sigma', 2),
  ('informatique', 'Informatique', 'Une formation complète en informatique : programmation, réseaux, bases de données et pédagogie du numérique.', 'Former des enseignants et des développeurs polyvalents du numérique.', 'Enseignant d''informatique, développeur, administrateur systèmes, formateur TIC.', 'Baccalauréat scientifique recommandé ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes.', 'LES_DEUX', 'code', 3),
  ('physique', 'Physique', 'Étude de la matière et de l''énergie, de la mécanique à l''électricité, avec une forte dimension pédagogique.', 'Maîtriser les concepts physiques et leur enseignement.', 'Enseignant de physique, technicien en laboratoire, ingénieur.', 'Baccalauréat scientifique ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes.', 'LES_DEUX', 'atom', 4),
  ('chimie', 'Chimie', 'Formation en chimie organique, minérale et analytique, orientée enseignement et recherche appliquée.', 'Comprendre la matière et ses transformations ; enseigner la chimie.', 'Enseignant de chimie, technicien de laboratoire, contrôleur qualité.', 'Baccalauréat scientifique ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes.', 'LES_DEUX', 'flask-conical', 5),
  ('technologie', 'Technologie', 'Une formation transversale dédiée à l''ingénierie pédagogique et aux technologies éducatives.', 'Intégrer les technologies dans l''enseignement et concevoir des dispositifs d''apprentissage.', 'Enseignant de technologie, concepteur pédagogique, médiateur numérique.', 'Baccalauréat ou équivalent ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes.', 'PRESENTIEL', 'cpu', 6),
  ('histoire', 'Histoire', 'Étude critique des sociétés et des civilisations, de l''Antiquité à nos jours, avec un focus sur l''Afrique.', 'Former à l''analyse historique et à la didactique de l''histoire.', 'Enseignant d''histoire, archiviste, guide culturel, chercheur.', 'Baccalauréat ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes.', 'LES_DEUX', 'landmark', 7),
  ('geographie', 'Géographie', 'Comprendre les territoires, les milieux et les sociétés, au Bénin et dans la sous-région.', 'Maîtriser les enjeux spatiaux et leur enseignement.', 'Enseignant de géographie, cartographe, urbaniste, animateur territorial.', 'Baccalauréat ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes.', 'LES_DEUX', 'globe', 8),
  ('sciences-de-la-vie-et-de-la-terre', 'Sciences de la Vie et de la Terre (SVT)', 'Biologie, géologie et environnement au service de l''enseignement scientifique.', 'Observer, comprendre et enseigner le vivant et la Terre.', 'Enseignant de SVT, technicien en environnement, animateur scientifique.', 'Baccalauréat scientifique ; dossier de candidature.', 'Inscription en ligne, pièce d''identité, relevés de notes.', 'LES_DEUX', 'leaf', 9)
on conflict (slug) do nothing;

-- Campus (Porto-Novo, Parakou, Savè, Abomey-Calavi)
insert into public.campus (ville, adresse, telephone, email, latitude, longitude, description, ordre) values
  ('Porto-Novo', 'Quartier Ouando, Porto-Novo', '+229 00 00 00 01', 'portonovo@efes-sapientia.bj', 6.4969, 2.6289, 'Campus principal de l''EFES « SAPIENTIA » à Porto-Novo, capitale politique.', 1),
  ('Parakou', 'Quartier Arafat, Parakou', '+229 00 00 00 02', 'parakou@efes-sapientia.bj', 9.3372, 2.6148, 'Campus de Parakou, au cœur du nord du Bénin.', 2),
  ('Savè', 'Route principale, Savè', '+229 00 00 00 03', 'save@efes-sapientia.bj', 8.3290, 2.4840, 'Nouveau site de Savè, en plein développement.', 3),
  ('Abomey-Calavi', 'Zone universitaire, Abomey-Calavi', '+229 00 00 00 04', 'calavi@efes-sapientia.bj', 6.4485, 2.3560, 'Nouveau site d''Abomey-Calavi, proche de Cotonou.', 4)
on conflict (id) do nothing;

-- Partenaires institutionnels
insert into public.partenaires (nom, ordre) values
  ('UNESCO', 1), ('CAMES', 2), ('AUF', 3), ('Ministère de l''Enseignement Supérieur', 4), ('Ambassade de France', 5)
on conflict (id) do nothing;

-- Témoignages
insert into public.temoignages (auteur, role, contenu, ordre) values
  ('Aïcha Dossou', 'Diplômée en Lettres Modernes', 'EFES « SAPIENTIA » m''a donné une formation rigoureuse et humaine. J''enseigne aujourd''hui avec confiance.', 1),
  ('Paulin Houngbo', 'Étudiant en Informatique', 'La plateforme e-learning est intuitive et les professeurs sont très disponibles. Une vraie réussite.', 2),
  ('Mariam Adam', 'Diplômée en SVT', 'Un accompagnement personnalisé et de vraies valeurs pédagogiques. Je recommande cette école.', 3)
on conflict (id) do nothing;

-- Actualités
insert into public.actualites (slug, titre, extrait, contenu, date, type) values
  ('rentree-academique-2026', 'Rentrée académique 2026', 'L''EFES « SAPIENTIA » annonce sa rentrée sur ses 4 campus. Inscriptions ouvertes.', 'La rentrée académique se tient à Porto-Novo, Parakou, Savè et Abomey-Calavi. Les inscriptions sont ouvertes en ligne.', current_date, 'EVENEMENT'),
  ('seminaire-pedagogie-innovante', 'Séminaire : Pédagogie innovante', 'Un séminaire international sur l''innovation pédagogique se tiendra en mars.', 'En partenariat avec l''AUF, un séminaire réunira enseignants et chercheurs autour de l''innovation pédagogique.', current_date - 15, 'SEMINAIRE'),
  ('partenariat-unesco', 'Partenariat avec l''UNESCO', 'L''EFES « SAPIENTIA » signe un partenariat stratégique avec l''UNESCO.', 'Ce partenariat vise à renforcer la formation des enseignants à l''échelle sous-régionale.', current_date - 30, 'PARTENARIAT'),
  ('ouverture-site-save', 'Ouverture du site de Savè', 'Un nouveau campus ouvre à Savè pour la rentrée 2026.', 'L''EFES « SAPIENTIA » s''étend à Savè afin de rapprocher la formation des populations du centre du Bénin.', current_date - 7, 'NOUVELLE_FORMATION')
on conflict (slug) do nothing;

-- Galerie (placeholders)
insert into public.galerie_items (titre, type, url, vignette_url, categorie, ordre) values
  ('Campus de Porto-Novo', 'PHOTO', '/images/galerie/campus-portonovo.svg', '/images/galerie/campus-portonovo.svg', 'CAMPUS', 1),
  ('Salle de cours moderne', 'PHOTO', '/images/galerie/salle-cours.svg', '/images/galerie/salle-cours.svg', 'PEDAGOGIQUE', 2),
  ('Remise des diplômes 2025', 'PHOTO', '/images/galerie/remise-diplomes.svg', '/images/galerie/remise-diplomes.svg', 'DIPLOMES', 3),
  ('Travaux pratiques en laboratoire', 'PHOTO', '/images/galerie/laboratoire.svg', '/images/galerie/laboratoire.svg', 'PEDAGOGIQUE', 4)
on conflict (id) do nothing;
