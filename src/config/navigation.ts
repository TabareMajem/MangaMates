export const sections = [
  {
    id: 'chat',
    title: 'Talk with Characters',
    description: 'Chat with your favorite manga characters',
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586',
    href: '/talk-with-character',
    premium: true
  },
  {
    id: 'social',
    title: 'Social Media Analysis',
    description: 'Discover your online personality',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
    href: '/social-media',
    premium: true
  },
  {
    id: 'ai-agent',
    title: 'Create Your AI Agent',
    description: 'Design your own manga companion',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820',
    href: '/agents/create',
    premium: true
  }
] as const;
