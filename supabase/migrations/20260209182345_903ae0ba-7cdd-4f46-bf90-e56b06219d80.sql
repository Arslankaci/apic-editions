
-- Step 1: Assign admin role
INSERT INTO public.user_roles (user_id, role) VALUES ('e5221d96-cca0-484a-9387-f83ba4621e0b', 'admin');

-- Step 2: Insert genres
INSERT INTO public.genres (id, name) VALUES
  (gen_random_uuid(), 'Histoire'),
  (gen_random_uuid(), 'Sciences'),
  (gen_random_uuid(), 'Littérature'),
  (gen_random_uuid(), 'Jeunesse'),
  (gen_random_uuid(), 'Art & Culture');

-- Step 3: Insert sub_genres (using subqueries to get genre IDs)
INSERT INTO public.sub_genres (id, genre_id, name)
SELECT gen_random_uuid(), g.id, s.name
FROM public.genres g
CROSS JOIN (VALUES ('Antiquité'), ('Moyen Âge'), ('Époque moderne'), ('Contemporaine')) AS s(name)
WHERE g.name = 'Histoire';

INSERT INTO public.sub_genres (id, genre_id, name)
SELECT gen_random_uuid(), g.id, s.name
FROM public.genres g
CROSS JOIN (VALUES ('Physique'), ('Biologie'), ('Mathématiques'), ('Astronomie')) AS s(name)
WHERE g.name = 'Sciences';

INSERT INTO public.sub_genres (id, genre_id, name)
SELECT gen_random_uuid(), g.id, s.name
FROM public.genres g
CROSS JOIN (VALUES ('Roman'), ('Poésie'), ('Théâtre'), ('Essai')) AS s(name)
WHERE g.name = 'Littérature';

INSERT INTO public.sub_genres (id, genre_id, name)
SELECT gen_random_uuid(), g.id, s.name
FROM public.genres g
CROSS JOIN (VALUES ('Albums'), ('Contes'), ('Romans jeunesse'), ('Documentaires')) AS s(name)
WHERE g.name = 'Jeunesse';

INSERT INTO public.sub_genres (id, genre_id, name)
SELECT gen_random_uuid(), g.id, s.name
FROM public.genres g
CROSS JOIN (VALUES ('Peinture'), ('Musique'), ('Cinéma'), ('Architecture')) AS s(name)
WHERE g.name = 'Art & Culture';

-- Step 4: Insert collections
INSERT INTO public.collections (id, name, genre, description, color) VALUES
  (gen_random_uuid(), 'Mémoires du Monde', 'Histoire', 'Explorez les grandes civilisations et les événements qui ont façonné notre monde.', 'bg-primary'),
  (gen_random_uuid(), 'Horizons Scientifiques', 'Sciences', 'Plongez dans les mystères de l''univers et les avancées de la science.', 'bg-secondary'),
  (gen_random_uuid(), 'Plumes d''Or', 'Littérature', 'Les plus belles voix de la littérature francophone et internationale.', 'bg-bordeaux'),
  (gen_random_uuid(), 'Petits Lecteurs', 'Jeunesse', 'Des histoires captivantes pour éveiller l''imagination des plus jeunes.', 'bg-primary'),
  (gen_random_uuid(), 'Regards Croisés', 'Art & Culture', 'L''art sous toutes ses formes, entre tradition et modernité.', 'bg-secondary');

-- Step 5: Insert authors
INSERT INTO public.authors (id, name, photo, bio, specialty) VALUES
  (gen_random_uuid(), 'Marie Dupont', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop', 'Historienne passionnée, Marie Dupont se consacre à l''étude des civilisations anciennes et des transformations sociales.', 'Histoire'),
  (gen_random_uuid(), 'Jean-Pierre Martin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop', 'Physicien et vulgarisateur scientifique, Jean-Pierre Martin explore les mystères de l''univers avec rigueur et pédagogie.', 'Sciences'),
  (gen_random_uuid(), 'Amina Benali', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop', 'Romancière et dramaturge, Amina Benali puise dans ses racines méditerranéennes pour écrire des récits universels.', 'Littérature'),
  (gen_random_uuid(), 'Sophie Leclerc', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop', 'Auteure et illustratrice jeunesse, Sophie Leclerc crée des mondes enchanteurs pour les jeunes lecteurs.', 'Jeunesse'),
  (gen_random_uuid(), 'Karim Haddad', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', 'Artiste et écrivain, Karim Haddad célèbre la richesse culturelle de la Méditerranée.', 'Art & Culture'),
  (gen_random_uuid(), 'François Rivière', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop', 'Médiéviste reconnu, François Rivière fait revivre les grandes époques de l''histoire européenne.', 'Histoire'),
  (gen_random_uuid(), 'Claire Fontaine', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop', 'Biologiste et mathématicienne, Claire Fontaine rend les sciences exactes captivantes.', 'Sciences'),
  (gen_random_uuid(), 'Nadia Saïd', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop', 'Poétesse et conteuse, Nadia Saïd tisse des récits empreints de lyrisme et de tradition orale.', 'Littérature'),
  (gen_random_uuid(), 'Rachid Amrani', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop', 'Essayiste et cinéaste, Rachid Amrani explore les enjeux contemporains à travers l''écriture et l''image.', 'Littérature & Histoire');

-- Step 6: Insert books (using subqueries for author_id and collection_id)
INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Les Empires Oubliés', a.id, c.id, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop', 'Un voyage fascinant à travers les civilisations perdues de l''Antiquité.', '978-2-1234-5678-1', 342, '2025-01-15', 'Histoire', 'Antiquité', true
FROM public.authors a, public.collections c WHERE a.name = 'Marie Dupont' AND c.name = 'Mémoires du Monde';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Quantum : L''Invisible Réel', a.id, c.id, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop', 'La physique quantique expliquée de manière accessible et passionnante.', '978-2-1234-5678-2', 256, '2025-02-01', 'Sciences', 'Physique', true
FROM public.authors a, public.collections c WHERE a.name = 'Jean-Pierre Martin' AND c.name = 'Horizons Scientifiques';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'L''Ombre du Figuier', a.id, c.id, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop', 'Un roman poignant sur l''exil et la quête d''identité.', '978-2-1234-5678-3', 198, '2024-11-20', 'Littérature', 'Roman', false
FROM public.authors a, public.collections c WHERE a.name = 'Amina Benali' AND c.name = 'Plumes d''Or';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Le Petit Astronaute', a.id, c.id, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300&h=400&fit=crop', 'Un album illustré pour les rêveurs qui regardent les étoiles.', '978-2-1234-5678-4', 48, '2025-01-10', 'Jeunesse', 'Albums', true
FROM public.authors a, public.collections c WHERE a.name = 'Sophie Leclerc' AND c.name = 'Petits Lecteurs';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Impressions Méditerranéennes', a.id, c.id, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop', 'Un livre d''art célébrant les peintres de la Méditerranée.', '978-2-1234-5678-5', 220, '2024-09-05', 'Art & Culture', 'Peinture', false
FROM public.authors a, public.collections c WHERE a.name = 'Karim Haddad' AND c.name = 'Regards Croisés';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Chevaliers et Troubadours', a.id, c.id, 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop', 'La vie quotidienne au Moyen Âge entre guerre et poésie.', '978-2-1234-5678-6', 310, '2025-01-28', 'Histoire', 'Moyen Âge', true
FROM public.authors a, public.collections c WHERE a.name = 'François Rivière' AND c.name = 'Mémoires du Monde';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'ADN : Le Code de la Vie', a.id, c.id, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop', 'Comprendre la génétique et ses enjeux pour l''avenir.', '978-2-1234-5678-7', 280, '2024-10-12', 'Sciences', 'Biologie', false
FROM public.authors a, public.collections c WHERE a.name = 'Claire Fontaine' AND c.name = 'Horizons Scientifiques';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Vers la Lumière', a.id, c.id, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop', 'Recueil de poèmes sur l''espoir et la résilience.', '978-2-1234-5678-8', 120, '2025-02-05', 'Littérature', 'Poésie', true
FROM public.authors a, public.collections c WHERE a.name = 'Nadia Saïd' AND c.name = 'Plumes d''Or';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'La Révolution Industrielle', a.id, c.id, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&h=400&fit=crop', 'Comment l''ère industrielle a transformé nos sociétés.', '978-2-1234-5678-9', 290, '2024-08-15', 'Histoire', 'Époque moderne', false
FROM public.authors a, public.collections c WHERE a.name = 'Marie Dupont' AND c.name = 'Mémoires du Monde';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Le Siècle des Lumières', a.id, c.id, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop', 'Les philosophes qui ont changé le cours de l''histoire.', '978-2-1234-5679-0', 380, '2024-06-20', 'Histoire', 'Époque moderne', false
FROM public.authors a, public.collections c WHERE a.name = 'François Rivière' AND c.name = 'Mémoires du Monde';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Guerres et Paix au XXe siècle', a.id, c.id, 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=300&h=400&fit=crop', 'Les grands conflits et les chemins vers la réconciliation.', '978-2-1234-5679-1', 420, '2025-01-05', 'Histoire', 'Contemporaine', true
FROM public.authors a, public.collections c WHERE a.name = 'Rachid Amrani' AND c.name = 'Mémoires du Monde';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Étoiles et Galaxies', a.id, c.id, 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=400&fit=crop', 'Un voyage au cœur de l''univers observable.', '978-2-1234-5679-2', 300, '2024-12-01', 'Sciences', 'Astronomie', false
FROM public.authors a, public.collections c WHERE a.name = 'Jean-Pierre Martin' AND c.name = 'Horizons Scientifiques';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Nombres Premiers', a.id, c.id, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=400&fit=crop', 'La beauté cachée des mathématiques.', '978-2-1234-5679-3', 210, '2025-02-10', 'Sciences', 'Mathématiques', true
FROM public.authors a, public.collections c WHERE a.name = 'Claire Fontaine' AND c.name = 'Horizons Scientifiques';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Scènes de la Vie', a.id, c.id, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop', 'Trois actes sur la condition humaine.', '978-2-1234-5679-4', 150, '2024-07-18', 'Littérature', 'Théâtre', false
FROM public.authors a, public.collections c WHERE a.name = 'Amina Benali' AND c.name = 'Plumes d''Or';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Penser le Monde', a.id, c.id, 'https://images.unsplash.com/photo-1490633874781-1c63cc424610?w=300&h=400&fit=crop', 'Essais sur les défis contemporains de la mondialisation.', '978-2-1234-5679-5', 260, '2025-01-20', 'Littérature', 'Essai', true
FROM public.authors a, public.collections c WHERE a.name = 'Rachid Amrani' AND c.name = 'Plumes d''Or';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Contes du Sahara', a.id, c.id, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop', 'Histoires merveilleuses transmises de génération en génération.', '978-2-1234-5679-6', 96, '2024-10-05', 'Jeunesse', 'Contes', false
FROM public.authors a, public.collections c WHERE a.name = 'Nadia Saïd' AND c.name = 'Petits Lecteurs';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Aventures en Kabylie', a.id, c.id, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop', 'Un roman d''aventure pour les jeunes lecteurs.', '978-2-1234-5679-7', 180, '2025-02-01', 'Jeunesse', 'Romans jeunesse', true
FROM public.authors a, public.collections c WHERE a.name = 'Sophie Leclerc' AND c.name = 'Petits Lecteurs';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Les Animaux d''Afrique', a.id, c.id, 'https://images.unsplash.com/photo-1553729459-uj3hr8032e1e?w=300&h=400&fit=crop', 'Documentaire illustré sur la faune africaine.', '978-2-1234-5679-8', 64, '2024-11-10', 'Jeunesse', 'Documentaires', false
FROM public.authors a, public.collections c WHERE a.name = 'Karim Haddad' AND c.name = 'Petits Lecteurs';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Mélodies d''Orient', a.id, c.id, 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=400&fit=crop', 'L''histoire de la musique arabo-andalouse.', '978-2-1234-5679-9', 240, '2025-01-12', 'Art & Culture', 'Musique', true
FROM public.authors a, public.collections c WHERE a.name = 'Karim Haddad' AND c.name = 'Regards Croisés';

INSERT INTO public.books (title, author_id, collection_id, cover, description, isbn, pages, published_date, genre, sub_genre, is_new)
SELECT 'Cinéma d''Algérie', a.id, c.id, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=400&fit=crop', 'Panorama du cinéma algérien des années 60 à aujourd''hui.', '978-2-1234-5680-0', 320, '2024-09-25', 'Art & Culture', 'Cinéma', false
FROM public.authors a, public.collections c WHERE a.name = 'Rachid Amrani' AND c.name = 'Regards Croisés';

-- Step 7: Insert awards (using book title subqueries)
INSERT INTO public.awards (name, book_id, year, category)
SELECT 'Grand Prix du Roman', b.id, 2024, 'Roman' FROM public.books b WHERE b.title = 'L''Ombre du Figuier';

INSERT INTO public.awards (name, book_id, year, category)
SELECT 'Prix Goncourt', b.id, 2025, 'Poésie' FROM public.books b WHERE b.title = 'Vers la Lumière';

INSERT INTO public.awards (name, book_id, year, category)
SELECT 'Prix Renaudot', b.id, 2025, 'Essai' FROM public.books b WHERE b.title = 'Penser le Monde';

INSERT INTO public.awards (name, book_id, year, category)
SELECT 'Prix du Livre Jeunesse', b.id, 2025, 'Jeunesse' FROM public.books b WHERE b.title = 'Le Petit Astronaute';

INSERT INTO public.awards (name, book_id, year, category)
SELECT 'Prix de l''Essai Scientifique', b.id, 2024, 'Sciences' FROM public.books b WHERE b.title = 'Quantum : L''Invisible Réel';

INSERT INTO public.awards (name, book_id, year, category)
SELECT 'Prix des Libraires', b.id, 2025, 'Histoire' FROM public.books b WHERE b.title = 'Chevaliers et Troubadours';

INSERT INTO public.awards (name, book_id, year, category)
SELECT 'Prix Méditerranée', b.id, 2024, 'Art' FROM public.books b WHERE b.title = 'Impressions Méditerranéennes';

-- Step 8: Insert news articles
INSERT INTO public.news_articles (title, excerpt, image, date, category) VALUES
  ('APIC Éditions au Salon du Livre 2025', 'Retrouvez-nous au Salon International du Livre d''Alger. Dédicaces, conférences et rencontres avec nos auteurs.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop', '2025-03-10', 'Événement'),
  ('Prix littéraire pour Amina Benali', 'Notre auteure Amina Benali reçoit le prix du meilleur roman francophone pour ''L''Ombre du Figuier''.', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop', '2025-02-20', 'Récompense'),
  ('Nouvelle collection Jeunesse', 'Découvrez notre nouvelle collection ''Petits Lecteurs'', dédiée aux enfants de 6 à 12 ans.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop', '2025-01-15', 'Nouveauté');

-- Step 9: Insert distributors
INSERT INTO public.distributors (name, logo, website, region) VALUES
  ('Hachette Distribution', 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=100&fit=crop', 'https://example.com', 'France'),
  ('EDIF 2000', 'https://images.unsplash.com/photo-1614680376408-81e91bbe261f?w=200&h=100&fit=crop', 'https://example.com', 'Algérie'),
  ('Sonabook', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=100&fit=crop', 'https://example.com', 'Algérie'),
  ('Dar El Nashria', 'https://images.unsplash.com/photo-1614680376739-1388c43523d6?w=200&h=100&fit=crop', 'https://example.com', 'Tunisie');

-- Step 10: Insert points of sale
INSERT INTO public.points_of_sale (name, address, city, type) VALUES
  ('Siège APIC Éditions', '12 Rue Didouche Mourad', 'Alger', 'headquarters'),
  ('Librairie du Tiers-Monde', 'Place Émir Abdelkader', 'Alger', 'bookstore'),
  ('Librairie Ijtihad', 'Rue Hassiba Ben Bouali', 'Alger', 'bookstore'),
  ('Média-Livre', 'Centre Commercial Bab Ezzouar', 'Alger', 'bookstore');

-- Step 11: Insert team members
INSERT INTO public.team_members (name, role, photo) VALUES
  ('Rachid Amrani', 'Directeur général', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'),
  ('Fatima Zahra Belkacem', 'Directrice éditoriale', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'),
  ('Youcef Khelifi', 'Responsable commercial', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'),
  ('Samira Touati', 'Responsable communication', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop');
