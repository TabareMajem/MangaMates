"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { socialAnalyzerService } from "@/lib/services/social-analyzer-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SocialAnalyzerPage() {
  const { user } = useAuth();
  const [twitterUsername, setTwitterUsername] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [activeTab, setActiveTab] = useState("twitter");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const analyzeTwitter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twitterUsername) return;
    
    setLoading(true);
    try {
      const result = await socialAnalyzerService.analyzeTwitterProfile(twitterUsername);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Twitter profile analysis has been generated"
      });
    } catch (error) {
      console.error("Twitter analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze Twitter profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    // For Instagram, we would typically use OAuth flow
    // This is a simplified example
    toast({
      title: "Instagram Analysis",
      description: "Instagram analysis requires authentication. Please connect your Instagram account.",
      variant: "default"
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Social Media Analyzer</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>
        
        <TabsContent value="twitter">
          <Card>
            <CardHeader>
              <CardTitle>Twitter Analysis</CardTitle>
              <CardDescription>
                Enter a Twitter username to analyze their personality traits and communication style
              </CardDescription>
            </CardHeader>
            <form onSubmit={analyzeTwitter}>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="twitterUsername" className="block text-sm font-medium mb-1">
                      Twitter Username
                    </label>
                    <Input
                      id="twitterUsername"
                      placeholder="e.g. elonmusk (without @)"
                      value={twitterUsername}
                      onChange={(e) => setTwitterUsername(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Note: This analysis uses publicly available data and AI to generate insights.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading || !twitterUsername}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Profile"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="instagram">
          <Card>
            <CardHeader>
              <CardTitle>Instagram Analysis</CardTitle>
              <CardDescription>
                Analyze an Instagram profile to understand personality traits and visual style
              </CardDescription>
            </CardHeader>
            <form onSubmit={analyzeInstagram}>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="instagramUsername" className="block text-sm font-medium mb-1">
                      Instagram Username
                    </label>
                    <Input
                      id="instagramUsername"
                      placeholder="e.g. natgeo"
                      value={instagramUsername}
                      onChange={(e) => setInstagramUsername(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading || !instagramUsername}>
                  Connect Instagram
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
      
      {analysis && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h3>Profile Analysis</h3>
              <p className="whitespace-pre-line">{analysis.analysis}</p>
              
              {activeTab === "twitter" && analysis.tweets && (
                <>
                  <h3>Sample Content</h3>
                  <ul>
                    {analysis.tweets.slice(0, 5).map((tweet: any, index: number) => (
                      <li key={index} className="mb-2">
                        {tweet.text}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 