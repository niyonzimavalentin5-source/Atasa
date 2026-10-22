import { User, Post, Collection, Notification, Comment } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_self',
    username: 'niyovalentin',
    displayName: 'Niyo Valentin',
    avatarUrl: '/src/assets/images/portrait_editorial_light_1792655998838.jpg',
    bio: 'Photographer and visual observer. Exploring structural stillness, morning light, and candid human moments.',
    websiteUrl: 'https://atasa.gallery/niyovalentin',
    isPrivate: false,
    isVerified: true,
    followersCount: 1420,
    followingCount: 284,
    postsCount: 12,
    isFollowing: false,
  },
  {
    id: 'user_elena',
    username: 'elena_lens',
    displayName: 'Elena Rostova',
    avatarUrl: '/src/assets/images/portrait_editorial_light_1792655998838.jpg',
    bio: 'Architectural geometry and silent concrete spaces. Based in Zurich & Berlin.',
    websiteUrl: 'https://elenarostova.studio',
    isPrivate: false,
    isVerified: true,
    followersCount: 8940,
    followingCount: 312,
    postsCount: 84,
    isFollowing: true,
  },
  {
    id: 'user_marcus',
    username: 'marcusv',
    displayName: 'Marcus Vance',
    avatarUrl: '/src/assets/images/fashion_monochrome_trench_1792656071059.jpg',
    bio: '35mm documentary and rain-slicked city streets. Leica M11 devotee.',
    websiteUrl: 'https://vancestreets.com',
    isPrivate: false,
    isVerified: false,
    followersCount: 5210,
    followingCount: 195,
    postsCount: 62,
    isFollowing: true,
  },
  {
    id: 'user_amina',
    username: 'amina_studio',
    displayName: 'Amina Diallo',
    avatarUrl: '/src/assets/images/portrait_editorial_light_1792655998838.jpg',
    bio: 'Natural light portraits, linen textures, and quiet interior studies. London & Dakar.',
    websiteUrl: 'https://aminadiallo.photo',
    isPrivate: false,
    isVerified: true,
    followersCount: 12400,
    followingCount: 418,
    postsCount: 105,
    isFollowing: false,
  },
  {
    id: 'user_kaito',
    username: 'kaitotanaka',
    displayName: 'Kaito Tanaka',
    avatarUrl: '/src/assets/images/nature_misty_forest_1792655999291.jpg',
    bio: 'Atmospheric landscapes and alpine silence. Wandering the misty pines of northern forests.',
    isPrivate: false,
    isVerified: false,
    followersCount: 3870,
    followingCount: 142,
    postsCount: 48,
    isFollowing: true,
  },
  {
    id: 'user_clara',
    username: 'claramoreau',
    displayName: 'Clara Moreau',
    avatarUrl: '/src/assets/images/art_ceramic_geometry_1792656070527.jpg',
    bio: 'Form, stone, ceramics, and light studies. Milan & Paris art curation.',
    websiteUrl: 'https://claramoreau.design',
    isPrivate: false,
    isVerified: true,
    followersCount: 6730,
    followingCount: 220,
    postsCount: 57,
    isFollowing: false,
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_elena',
    author: INITIAL_USERS[1], // Elena
    imageUrl: '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg',
    images: [
      '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg',
      '/src/assets/images/art_ceramic_geometry_1792656070527.jpg'
    ],
    aspectRatio: 0.72, // Tall vertical portrait
    caption: 'Interlocking cast concrete and dry-laid limestone. Morning cast shadows framing the inner courtyard pavilion.',
    category: 'Architecture',
    visibility: 'public',
    allowDownloads: true,
    createdAt: '2 hours ago',
    likesCount: 342,
    commentsCount: 18,
    isLiked: false,
    isSaved: true,
    tags: ['architecture', 'concrete', 'brutalism', 'geometry', 'lightandshadow'],
    exif: {
      camera: 'Hasselblad X2D 100C',
      lens: 'XCD 38mm f/2.5 V',
      focalLength: '38mm',
      aperture: 'f/8.0',
      iso: '64',
      shutterSpeed: '1/250s',
      location: 'Ticino, Switzerland'
    }
  },
  {
    id: 'post_2',
    userId: 'user_amina',
    author: INITIAL_USERS[3], // Amina
    imageUrl: '/src/assets/images/portrait_editorial_light_1792655998838.jpg',
    images: [
      '/src/assets/images/portrait_editorial_light_1792655998838.jpg',
      '/src/assets/images/fashion_monochrome_trench_1792656071059.jpg'
    ],
    aspectRatio: 0.72, // Tall vertical portrait
    caption: 'Serenity in the ceramic studio. Diffused north-facing morning window light across warm olive silk and coarse knit wool.',
    category: 'Portraits',
    visibility: 'public',
    allowDownloads: false, // downloads disabled by creator!
    createdAt: '4 hours ago',
    likesCount: 519,
    commentsCount: 24,
    isLiked: true,
    isSaved: false,
    tags: ['portrait', 'naturallight', 'editorial', 'quietmoments', 'warmth'],
    exif: {
      camera: 'Leica SL2-S',
      lens: 'Summilux-SL 50mm f/1.4 ASPH',
      focalLength: '50mm',
      aperture: 'f/2.0',
      iso: '200',
      shutterSpeed: '1/320s',
      location: 'Shoreditch, London'
    }
  },
  {
    id: 'post_3',
    userId: 'user_kaito',
    author: INITIAL_USERS[4], // Kaito
    imageUrl: '/src/assets/images/nature_misty_forest_1792655999291.jpg',
    images: [
      '/src/assets/images/nature_misty_forest_1792655999291.jpg',
      '/src/assets/images/lifestyle_coastal_golden_1792655998779.jpg'
    ],
    aspectRatio: 1.25, // Refined landscape
    caption: 'Crepuscular rays filtering through ancient spruce and pine needles at first light. Complete silence except for droplets on the moss.',
    category: 'Nature',
    visibility: 'public',
    allowDownloads: true,
    createdAt: '8 hours ago',
    likesCount: 884,
    commentsCount: 42,
    isLiked: true,
    isSaved: true,
    tags: ['nature', 'mistyforest', 'solitude', 'pineforest', 'goldenhour'],
    exif: {
      camera: 'Sony Alpha 1',
      lens: 'FE 24-70mm f/2.8 GM II',
      focalLength: '45mm',
      aperture: 'f/5.6',
      iso: '160',
      shutterSpeed: '1/125s',
      location: 'Biei, Hokkaido'
    }
  },
  {
    id: 'post_4',
    userId: 'user_self',
    author: INITIAL_USERS[0], // Self
    imageUrl: '/src/assets/images/lifestyle_coastal_golden_1792655998779.jpg',
    images: [
      '/src/assets/images/lifestyle_coastal_golden_1792655998779.jpg',
      '/src/assets/images/portrait_editorial_light_1792655998838.jpg'
    ],
    aspectRatio: 0.8, // Elegant vertical
    caption: 'Afternoon conversations under bougainvillea blossoms. Terracotta pavers warmed by the late afternoon sun above the Tyrrhenian sea.',
    category: 'Travel',
    visibility: 'public',
    allowDownloads: true,
    createdAt: '1 day ago',
    likesCount: 412,
    commentsCount: 15,
    isLiked: false,
    isSaved: false,
    tags: ['travel', 'mediterranean', 'goldenhour', 'amalficoast', 'candid'],
    exif: {
      camera: 'Fujifilm GFX 100S II',
      lens: 'GF 45mm f/2.8 R WR',
      focalLength: '45mm',
      aperture: 'f/4.0',
      iso: '125',
      shutterSpeed: '1/500s',
      location: 'Ravello, Italy'
    }
  },
  {
    id: 'post_5',
    userId: 'user_marcus',
    author: INITIAL_USERS[2], // Marcus
    imageUrl: '/src/assets/images/fashion_monochrome_trench_1792656071059.jpg',
    images: [
      '/src/assets/images/fashion_monochrome_trench_1792656071059.jpg',
      '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg'
    ],
    aspectRatio: 0.72, // Tall vertical portrait
    caption: 'The morning rain over Rue Mouffetard. Reflections echoing off century-old paving stones as the artisan passes the corner bakery.',
    category: 'Photography',
    visibility: 'public',
    allowDownloads: true,
    createdAt: '1 day ago',
    likesCount: 671,
    commentsCount: 31,
    isLiked: false,
    isSaved: false,
    tags: ['blackandwhite', 'streetphotography', 'paris', 'leica', 'monochrome'],
    exif: {
      camera: 'Leica M11 Monochrom',
      lens: 'APO-Summicron-M 35mm f/2 ASPH',
      focalLength: '35mm',
      aperture: 'f/2.8',
      iso: '400',
      shutterSpeed: '1/180s',
      location: 'Paris, France'
    }
  },
  {
    id: 'post_6',
    userId: 'user_clara',
    author: INITIAL_USERS[5], // Clara
    imageUrl: '/src/assets/images/art_ceramic_geometry_1792656070527.jpg',
    images: [
      '/src/assets/images/art_ceramic_geometry_1792656070527.jpg',
      '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg'
    ],
    aspectRatio: 0.8, // Tall vertical
    caption: 'Study in negative space. Carved limestone and chamotte stoneware resting on a rough-hewn sandstone plinth in the gallery annex.',
    category: 'Art & Creativity',
    visibility: 'public',
    allowDownloads: false, // downloads disabled
    createdAt: '2 days ago',
    likesCount: 295,
    commentsCount: 11,
    isLiked: false,
    isSaved: true,
    tags: ['sculpture', 'ceramics', 'minimalism', 'design', 'galleryart'],
    exif: {
      camera: 'Canon EOS R5',
      lens: 'RF 50mm f/1.2L USM',
      focalLength: '50mm',
      aperture: 'f/4.0',
      iso: '100',
      shutterSpeed: '1/200s',
      location: 'Brera, Milan'
    }
  }
];

export const INITIAL_COMMENTS: Record<string, Comment[]> = {
  post_1: [
    {
      id: 'comm_1_1',
      postId: 'post_1',
      userId: 'user_clara',
      author: INITIAL_USERS[5],
      body: 'The play of diagonal shadows against the cast texture is remarkable. Beautifully exposed.',
      createdAt: '1 hour ago',
      likesCount: 14,
      isLiked: false,
      replies: [
        {
          id: 'comm_1_1_reply_1',
          postId: 'post_1',
          userId: 'user_elena',
          author: INITIAL_USERS[1],
          parentCommentId: 'comm_1_1',
          body: 'Thank you Clara! Waited nearly two hours for the sun angle to graze the concrete relief just right.',
          createdAt: '45 mins ago',
          likesCount: 7,
          isLiked: true,
        }
      ]
    },
    {
      id: 'comm_1_2',
      postId: 'post_1',
      userId: 'user_marcus',
      author: INITIAL_USERS[2],
      body: 'Hasselblad medium format depth really shines through in the subtle limestone grain.',
      createdAt: '30 mins ago',
      likesCount: 5,
      isLiked: false,
      replies: []
    }
  ],
  post_2: [
    {
      id: 'comm_2_1',
      postId: 'post_2',
      userId: 'user_self',
      author: INITIAL_USERS[0],
      body: 'Sublime tonal balance and dignity. The catchlight in the eyes is so natural and gentle.',
      createdAt: '3 hours ago',
      likesCount: 18,
      isLiked: true,
      replies: [
        {
          id: 'comm_2_1_reply_1',
          postId: 'post_2',
          userId: 'user_amina',
          author: INITIAL_USERS[3],
          parentCommentId: 'comm_2_1',
          body: 'Warmest thanks Niyo. Natural north light through high warehouse windows always does the magic.',
          createdAt: '2 hours ago',
          likesCount: 9,
          isLiked: false,
        }
      ]
    }
  ],
  post_3: [
    {
      id: 'comm_3_1',
      postId: 'post_3',
      userId: 'user_elena',
      author: INITIAL_USERS[1],
      body: 'Can almost smell the wet damp pine moss and cold morning air. Breathtaking depth.',
      createdAt: '6 hours ago',
      likesCount: 22,
      isLiked: false,
      replies: []
    }
  ]
};

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col_1',
    userId: 'user_self',
    name: 'Favorite Photography',
    description: 'Images that capture timeless light, restraint, and profound stillness.',
    isPublic: true,
    coverImageUrl: '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg',
    postIds: ['post_1', 'post_3', 'post_6'],
    createdAt: 'Oct 2026'
  },
  {
    id: 'col_2',
    userId: 'user_self',
    name: 'Minimalist Architecture',
    description: 'Clean geometry, structural rhythms, and honest raw materials.',
    isPublic: true,
    coverImageUrl: '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg',
    postIds: ['post_1'],
    createdAt: 'Oct 2026'
  },
  {
    id: 'col_3',
    userId: 'user_self',
    name: 'Nature & Solitude',
    description: 'Misty landscapes, morning fog, and wilderness compositions.',
    isPublic: false,
    coverImageUrl: '/src/assets/images/nature_misty_forest_1792655999291.jpg',
    postIds: ['post_3'],
    createdAt: 'Oct 2026'
  },
  {
    id: 'col_4',
    userId: 'user_self',
    name: 'Art & Sculptural Form',
    description: 'Three-dimensional spatial studies, ceramics, and museum lighting.',
    isPublic: true,
    coverImageUrl: '/src/assets/images/art_ceramic_geometry_1792656070527.jpg',
    postIds: ['post_6'],
    createdAt: 'Oct 2026'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    recipientId: 'user_self',
    actor: INITIAL_USERS[1], // Elena
    eventType: 'like',
    postId: 'post_4',
    postImage: '/src/assets/images/lifestyle_coastal_golden_1792655998779.jpg',
    isRead: false,
    createdAt: '25 mins ago'
  },
  {
    id: 'notif_2',
    recipientId: 'user_self',
    actor: INITIAL_USERS[3], // Amina
    eventType: 'reply',
    postId: 'post_2',
    postImage: '/src/assets/images/portrait_editorial_light_1792655998838.jpg',
    commentText: 'Warmest thanks Niyo. Natural north light through high warehouse windows always does the magic.',
    isRead: false,
    createdAt: '2 hours ago'
  },
  {
    id: 'notif_3',
    recipientId: 'user_self',
    actor: INITIAL_USERS[2], // Marcus
    eventType: 'follow',
    isRead: true,
    createdAt: 'Yesterday'
  },
  {
    id: 'notif_4',
    recipientId: 'user_self',
    actor: INITIAL_USERS[4], // Kaito
    eventType: 'comment',
    postId: 'post_4',
    postImage: '/src/assets/images/lifestyle_coastal_golden_1792655998779.jpg',
    commentText: 'The warm tones on the terrace are so evocative of summer.',
    isRead: true,
    createdAt: '1 day ago'
  }
];
