import { AnimeMedia } from '@/types/anime';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface MediaCardProps {
  media: AnimeMedia;
  showType?: boolean;
}

export function MediaCard({ media, showType = true }: MediaCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/media/${media.id}`}>
        <div className="relative h-[320px]">
          <Image
            src={media.coverImage.large}
            alt={media.title.english || media.title.romaji}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {showType && (
            <Badge className="absolute top-2 right-2">
              {media.type}
            </Badge>
          )}
          {media.averageScore && (
            <Badge variant="secondary" className="absolute bottom-2 right-2">
              {media.averageScore}%
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold truncate">
            {media.title.english || media.title.romaji}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {media.format} • {media.episodes || media.chapters || '?'} {media.type === 'ANIME' ? 'Episodes' : 'Chapters'}
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {media.genres.slice(0, 3).map(genre => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </Card>
  );
}
