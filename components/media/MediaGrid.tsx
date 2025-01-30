import { AnimeMedia } from '@/types/anime';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  items: AnimeMedia[];
  showType?: boolean;
}

export function MediaGrid({ items, showType }: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map(media => (
        <MediaCard key={media.id} media={media} showType={showType} />
      ))}
    </div>
  );
}
