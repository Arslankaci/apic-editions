export interface Author {
  id: string;
  name: string;
  photo: string;
  bio: string;
  specialty: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  authorId: string;
  cover: string;
  description: string;
  isbn: string;
  pages: number;
  publishedDate: string;
  genre: string;
  subGenre: string;
  collection: string;
  isNew: boolean;
  bookstores: string[];
  awards?: { name: string; year: number }[];
}

export interface Award {
  id: string;
  name: string;
  year: number;
  bookId: string;
  category: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

export interface Distributor {
  id: string;
  name: string;
  logo: string;
  website: string;
  region: string;
}

export interface PointOfSale {
  id: string;
  name: string;
  address: string;
  city: string;
  type: "headquarters" | "bookstore";
}

export const genres = [
  { id: "histoire", name: "Histoire", subGenres: ["Antiquité", "Moyen Âge", "Époque moderne", "Contemporaine"] },
  { id: "sciences", name: "Sciences", subGenres: ["Physique", "Biologie", "Mathématiques", "Astronomie"] },
  { id: "litterature", name: "Littérature", subGenres: ["Roman", "Poésie", "Théâtre", "Essai"] },
  { id: "jeunesse", name: "Jeunesse", subGenres: ["Albums", "Contes", "Romans jeunesse", "Documentaires"] },
  { id: "art", name: "Art & Culture", subGenres: ["Peinture", "Musique", "Cinéma", "Architecture"] },
];

export const collections = [
  { id: "col-histoire", name: "Mémoires du Monde", genre: "Histoire", description: "Explorez les grandes civilisations et les événements qui ont façonné notre monde.", color: "bg-primary", bookCount: 24 },
  { id: "col-sciences", name: "Horizons Scientifiques", genre: "Sciences", description: "Plongez dans les mystères de l'univers et les avancées de la science.", color: "bg-secondary", bookCount: 18 },
  { id: "col-litterature", name: "Plumes d'Or", genre: "Littérature", description: "Les plus belles voix de la littérature francophone et internationale.", color: "bg-bordeaux", bookCount: 32 },
  { id: "col-jeunesse", name: "Petits Lecteurs", genre: "Jeunesse", description: "Des histoires captivantes pour éveiller l'imagination des plus jeunes.", color: "bg-primary", bookCount: 15 },
  { id: "col-art", name: "Regards Croisés", genre: "Art & Culture", description: "L'art sous toutes ses formes, entre tradition et modernité.", color: "bg-secondary", bookCount: 12 },
];

export const authors: Author[] = [
  { id: "marie-dupont", name: "Marie Dupont", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop", bio: "Historienne passionnée, Marie Dupont se consacre à l'étude des civilisations anciennes et des transformations sociales. Ses ouvrages rendent l'histoire accessible à un large public.", specialty: "Histoire" },
  { id: "jean-pierre-martin", name: "Jean-Pierre Martin", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop", bio: "Physicien et vulgarisateur scientifique, Jean-Pierre Martin explore les mystères de l'univers avec rigueur et pédagogie. Il enseigne également à l'Université d'Alger.", specialty: "Sciences" },
  { id: "amina-benali", name: "Amina Benali", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop", bio: "Romancière et dramaturge, Amina Benali puise dans ses racines méditerranéennes pour écrire des récits universels sur l'identité et l'exil.", specialty: "Littérature" },
  { id: "sophie-leclerc", name: "Sophie Leclerc", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop", bio: "Auteure et illustratrice jeunesse, Sophie Leclerc crée des mondes enchanteurs pour les jeunes lecteurs. Ses albums sont traduits dans plusieurs langues.", specialty: "Jeunesse" },
  { id: "karim-haddad", name: "Karim Haddad", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", bio: "Artiste et écrivain, Karim Haddad célèbre la richesse culturelle de la Méditerranée à travers ses ouvrages sur l'art, la musique et la nature.", specialty: "Art & Culture" },
  { id: "francois-riviere", name: "François Rivière", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop", bio: "Médiéviste reconnu, François Rivière fait revivre les grandes époques de l'histoire européenne avec un talent narratif remarquable.", specialty: "Histoire" },
  { id: "claire-fontaine", name: "Claire Fontaine", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop", bio: "Biologiste et mathématicienne, Claire Fontaine rend les sciences exactes captivantes. Ses livres allient rigueur scientifique et clarté d'écriture.", specialty: "Sciences" },
  { id: "nadia-said", name: "Nadia Saïd", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop", bio: "Poétesse et conteuse, Nadia Saïd tisse des récits empreints de lyrisme et de tradition orale. Son œuvre célèbre la mémoire et l'espoir.", specialty: "Littérature" },
  { id: "rachid-amrani", name: "Rachid Amrani", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop", bio: "Essayiste et cinéaste, Rachid Amrani explore les enjeux contemporains à travers l'écriture et l'image. Il dirige également APIC Éditions.", specialty: "Littérature & Histoire" },
];

export const books: Book[] = [
  { id: "1", title: "Les Empires Oubliés", author: "Marie Dupont", authorId: "marie-dupont", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop", description: "Un voyage fascinant à travers les civilisations perdues de l'Antiquité.", isbn: "978-2-1234-5678-1", pages: 342, publishedDate: "2025-01-15", genre: "histoire", subGenre: "Antiquité", collection: "col-histoire", isNew: true, bookstores: ["2", "3"] },
  { id: "2", title: "Quantum : L'Invisible Réel", author: "Jean-Pierre Martin", authorId: "jean-pierre-martin", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop", description: "La physique quantique expliquée de manière accessible et passionnante.", isbn: "978-2-1234-5678-2", pages: 256, publishedDate: "2025-02-01", genre: "sciences", subGenre: "Physique", collection: "col-sciences", isNew: true, bookstores: ["2", "4"], awards: [{ name: "Prix de l'Essai Scientifique", year: 2024 }] },
  { id: "3", title: "L'Ombre du Figuier", author: "Amina Benali", authorId: "amina-benali", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", description: "Un roman poignant sur l'exil et la quête d'identité.", isbn: "978-2-1234-5678-3", pages: 198, publishedDate: "2024-11-20", genre: "litterature", subGenre: "Roman", collection: "col-litterature", isNew: false, bookstores: ["2", "3", "4"], awards: [{ name: "Grand Prix du Roman", year: 2024 }] },
  { id: "4", title: "Le Petit Astronaute", author: "Sophie Leclerc", authorId: "sophie-leclerc", cover: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300&h=400&fit=crop", description: "Un album illustré pour les rêveurs qui regardent les étoiles.", isbn: "978-2-1234-5678-4", pages: 48, publishedDate: "2025-01-10", genre: "jeunesse", subGenre: "Albums", collection: "col-jeunesse", isNew: true, bookstores: ["3"], awards: [{ name: "Prix du Livre Jeunesse", year: 2025 }] },
  { id: "5", title: "Impressions Méditerranéennes", author: "Karim Haddad", authorId: "karim-haddad", cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop", description: "Un livre d'art célébrant les peintres de la Méditerranée.", isbn: "978-2-1234-5678-5", pages: 220, publishedDate: "2024-09-05", genre: "art", subGenre: "Peinture", collection: "col-art", isNew: false, bookstores: ["2"], awards: [{ name: "Prix Méditerranée", year: 2024 }] },
  { id: "6", title: "Chevaliers et Troubadours", author: "François Rivière", authorId: "francois-riviere", cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop", description: "La vie quotidienne au Moyen Âge entre guerre et poésie.", isbn: "978-2-1234-5678-6", pages: 310, publishedDate: "2025-01-28", genre: "histoire", subGenre: "Moyen Âge", collection: "col-histoire", isNew: true, bookstores: ["2", "4"], awards: [{ name: "Prix des Libraires", year: 2025 }] },
  { id: "7", title: "ADN : Le Code de la Vie", author: "Claire Fontaine", authorId: "claire-fontaine", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", description: "Comprendre la génétique et ses enjeux pour l'avenir.", isbn: "978-2-1234-5678-7", pages: 280, publishedDate: "2024-10-12", genre: "sciences", subGenre: "Biologie", collection: "col-sciences", isNew: false, bookstores: ["3", "4"] },
  { id: "8", title: "Vers la Lumière", author: "Nadia Saïd", authorId: "nadia-said", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop", description: "Recueil de poèmes sur l'espoir et la résilience.", isbn: "978-2-1234-5678-8", pages: 120, publishedDate: "2025-02-05", genre: "litterature", subGenre: "Poésie", collection: "col-litterature", isNew: true, bookstores: ["2", "3"], awards: [{ name: "Prix Goncourt", year: 2025 }] },
  { id: "9", title: "La Révolution Industrielle", author: "Marie Dupont", authorId: "marie-dupont", cover: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&h=400&fit=crop", description: "Comment l'ère industrielle a transformé nos sociétés.", isbn: "978-2-1234-5678-9", pages: 290, publishedDate: "2024-08-15", genre: "histoire", subGenre: "Époque moderne", collection: "col-histoire", isNew: false, bookstores: ["2", "3"] },
  { id: "10", title: "Le Siècle des Lumières", author: "François Rivière", authorId: "francois-riviere", cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop", description: "Les philosophes qui ont changé le cours de l'histoire.", isbn: "978-2-1234-5679-0", pages: 380, publishedDate: "2024-06-20", genre: "histoire", subGenre: "Époque moderne", collection: "col-histoire", isNew: false, bookstores: ["4"] },
  { id: "11", title: "Guerres et Paix au XXe siècle", author: "Rachid Amrani", authorId: "rachid-amrani", cover: "https://images.unsplash.com/photo-1461360370896-922624d12a74?w=300&h=400&fit=crop", description: "Les grands conflits et les chemins vers la réconciliation.", isbn: "978-2-1234-5679-1", pages: 420, publishedDate: "2025-01-05", genre: "histoire", subGenre: "Contemporaine", collection: "col-histoire", isNew: true, bookstores: ["2", "3", "4"] },
  { id: "12", title: "Étoiles et Galaxies", author: "Jean-Pierre Martin", authorId: "jean-pierre-martin", cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=400&fit=crop", description: "Un voyage au cœur de l'univers observable.", isbn: "978-2-1234-5679-2", pages: 300, publishedDate: "2024-12-01", genre: "sciences", subGenre: "Astronomie", collection: "col-sciences", isNew: false, bookstores: ["2"] },
  { id: "13", title: "Nombres Premiers", author: "Claire Fontaine", authorId: "claire-fontaine", cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=400&fit=crop", description: "La beauté cachée des mathématiques.", isbn: "978-2-1234-5679-3", pages: 210, publishedDate: "2025-02-10", genre: "sciences", subGenre: "Mathématiques", collection: "col-sciences", isNew: true, bookstores: ["3", "4"] },
  { id: "14", title: "Scènes de la Vie", author: "Amina Benali", authorId: "amina-benali", cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop", description: "Trois actes sur la condition humaine.", isbn: "978-2-1234-5679-4", pages: 150, publishedDate: "2024-07-18", genre: "litterature", subGenre: "Théâtre", collection: "col-litterature", isNew: false, bookstores: ["2", "4"] },
  { id: "15", title: "Penser le Monde", author: "Rachid Amrani", authorId: "rachid-amrani", cover: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?w=300&h=400&fit=crop", description: "Essais sur les défis contemporains de la mondialisation.", isbn: "978-2-1234-5679-5", pages: 260, publishedDate: "2025-01-20", genre: "litterature", subGenre: "Essai", collection: "col-litterature", isNew: true, bookstores: ["2", "3"], awards: [{ name: "Prix Renaudot", year: 2025 }] },
  { id: "16", title: "Contes du Sahara", author: "Nadia Saïd", authorId: "nadia-said", cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop", description: "Histoires merveilleuses transmises de génération en génération.", isbn: "978-2-1234-5679-6", pages: 96, publishedDate: "2024-10-05", genre: "jeunesse", subGenre: "Contes", collection: "col-jeunesse", isNew: false, bookstores: ["2", "3", "4"] },
  { id: "17", title: "Aventures en Kabylie", author: "Sophie Leclerc", authorId: "sophie-leclerc", cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop", description: "Un roman d'aventure pour les jeunes lecteurs.", isbn: "978-2-1234-5679-7", pages: 180, publishedDate: "2025-02-01", genre: "jeunesse", subGenre: "Romans jeunesse", collection: "col-jeunesse", isNew: true, bookstores: ["3"] },
  { id: "18", title: "Les Animaux d'Afrique", author: "Karim Haddad", authorId: "karim-haddad", cover: "https://images.unsplash.com/photo-1553729459-uj3hr8032e1e?w=300&h=400&fit=crop", description: "Documentaire illustré sur la faune africaine.", isbn: "978-2-1234-5679-8", pages: 64, publishedDate: "2024-11-10", genre: "jeunesse", subGenre: "Documentaires", collection: "col-jeunesse", isNew: false, bookstores: ["2", "4"] },
  { id: "19", title: "Mélodies d'Orient", author: "Karim Haddad", authorId: "karim-haddad", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=400&fit=crop", description: "L'histoire de la musique arabo-andalouse.", isbn: "978-2-1234-5679-9", pages: 240, publishedDate: "2025-01-12", genre: "art", subGenre: "Musique", collection: "col-art", isNew: true, bookstores: ["2", "3"] },
  { id: "20", title: "Cinéma d'Algérie", author: "Rachid Amrani", authorId: "rachid-amrani", cover: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=400&fit=crop", description: "Panorama du cinéma algérien des années 60 à aujourd'hui.", isbn: "978-2-1234-5680-0", pages: 320, publishedDate: "2024-09-25", genre: "art", subGenre: "Cinéma", collection: "col-art", isNew: false, bookstores: ["4"] },
];

export const newsArticles: NewsArticle[] = [
  { id: "1", title: "APIC Éditions au Salon du Livre 2025", excerpt: "Retrouvez-nous au Salon International du Livre d'Alger. Dédicaces, conférences et rencontres avec nos auteurs.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop", date: "2025-03-10", category: "Événement" },
  { id: "2", title: "Prix littéraire pour Amina Benali", excerpt: "Notre auteure Amina Benali reçoit le prix du meilleur roman francophone pour 'L'Ombre du Figuier'.", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop", date: "2025-02-20", category: "Récompense" },
  { id: "3", title: "Nouvelle collection Jeunesse", excerpt: "Découvrez notre nouvelle collection 'Petits Lecteurs', dédiée aux enfants de 6 à 12 ans.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", date: "2025-01-15", category: "Nouveauté" },
];

export const distributors: Distributor[] = [
  { id: "1", name: "Hachette Distribution", logo: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=100&fit=crop", website: "https://example.com", region: "France" },
  { id: "2", name: "EDIF 2000", logo: "https://images.unsplash.com/photo-1614680376408-81e91bbe261f?w=200&h=100&fit=crop", website: "https://example.com", region: "Algérie" },
  { id: "3", name: "Sonabook", logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=100&fit=crop", website: "https://example.com", region: "Algérie" },
  { id: "4", name: "Dar El Nashria", logo: "https://images.unsplash.com/photo-1614680376739-1388c43523d6?w=200&h=100&fit=crop", website: "https://example.com", region: "Tunisie" },
];

export const pointsOfSale: PointOfSale[] = [
  { id: "1", name: "Siège APIC Éditions", address: "12 Rue Didouche Mourad", city: "Alger", type: "headquarters" },
  { id: "2", name: "Librairie du Tiers-Monde", address: "Place Émir Abdelkader", city: "Alger", type: "bookstore" },
  { id: "3", name: "Librairie Ijtihad", address: "Rue Hassiba Ben Bouali", city: "Alger", type: "bookstore" },
  { id: "4", name: "Média-Livre", address: "Centre Commercial Bab Ezzouar", city: "Alger", type: "bookstore" },
];

export const teamMembers = [
  { name: "Rachid Amrani", role: "Directeur général", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" },
  { name: "Fatima Zahra Belkacem", role: "Directrice éditoriale", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
  { name: "Youcef Khelifi", role: "Responsable commercial", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
  { name: "Samira Touati", role: "Responsable communication", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop" },
];

export const awards: Award[] = [
  { id: "aw-1", name: "Grand Prix du Roman", year: 2024, bookId: "3", category: "Roman" },
  { id: "aw-2", name: "Prix Goncourt", year: 2025, bookId: "8", category: "Poésie" },
  { id: "aw-3", name: "Prix Renaudot", year: 2025, bookId: "15", category: "Essai" },
  { id: "aw-4", name: "Prix du Livre Jeunesse", year: 2025, bookId: "4", category: "Jeunesse" },
  { id: "aw-5", name: "Prix de l'Essai Scientifique", year: 2024, bookId: "2", category: "Sciences" },
  { id: "aw-6", name: "Prix des Libraires", year: 2025, bookId: "6", category: "Histoire" },
  { id: "aw-7", name: "Prix Méditerranée", year: 2024, bookId: "5", category: "Art" },
];
