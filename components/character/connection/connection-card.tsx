import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ConnectionCardProps {
  connection: any;
  onToggleActive: () => void;
  onDelete: () => void;
}

export function ConnectionCard({ connection, onToggleActive, onDelete }: ConnectionCardProps) {
  const character = connection.character_instances;
  const lineUser = connection.line_users;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{character.name}</span>
          <Switch 
            checked={connection.is_active} 
            onCheckedChange={onToggleActive}
            aria-label="Toggle active state"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={character.appearance?.imageUrl} 
              alt={character.name} 
            />
            <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{character.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              Connected {formatDistanceToNow(new Date(connection.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <Label className="text-xs text-muted-foreground">Connected to LINE User</Label>
          <div className="flex items-center gap-3 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={lineUser.picture_url} 
                alt={lineUser.display_name || 'LINE User'} 
              />
              <AvatarFallback>
                {lineUser.display_name ? lineUser.display_name.charAt(0) : 'L'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm truncate">
              {lineUser.display_name || lineUser.id}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full flex items-center gap-2"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Connection</span>
        </Button>
      </CardFooter>
    </Card>
  );
} 