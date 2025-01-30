export type PanelLayout = 
  | 'full'
  | 'split-horizontal'
  | 'split-vertical'
  | 'triple'
  | 'quad';

export interface MangaPanel {
  id: string;
  imageUrl: string;
  prompt: string;
  dialogue?: string;
  position: number;
  layout: PanelLayout;
}

export interface MangaStory {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  panels: MangaPanel[];
  createdAt: Date;
}
