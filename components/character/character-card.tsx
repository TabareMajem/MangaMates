"use client";

import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CharacterCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export function CharacterCard({ id, name, description, imageUrl }: CharacterCardProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary/70">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
          {description}
        </p>
        
        <div className="flex gap-2 mt-auto">
          <Link href={`/chat/${id}`} className="flex-1">
            <Button variant="default" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </Link>
          
          <Link href={`/characters/${id}/schedule`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </Link>
        </div>
      </div>

      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/characters/${id}/edit`)}
        >
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/characters/${id}/message`)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
} 