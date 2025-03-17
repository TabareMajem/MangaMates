import { Route } from 'react-router-dom';
import { PremiumGuard } from './premium-guard';

// Pages
import TalkWithCharacterPage from '@/pages/talk-with-character';
import CharacterChatPage from '@/pages/talk-with-character/[id]';
import SocialMediaAnalyzerPage from '@/pages/social-media';
import CreateAgentPage from '@/pages/agents/create';

export const premiumRoutes = [
  <Route 
    key="talk-with-character"
    path="/talk-with-character" 
    element={<TalkWithCharacterPage />}
  />,
  <Route 
    key="character-chat"
    path="/talk-with-character/:id" 
    element={<CharacterChatPage />}
  />,
  <Route 
    key="social-media"
    path="/social-media" 
    element={
      <PremiumGuard>
        <SocialMediaAnalyzerPage />
      </PremiumGuard>
    } 
  />,
  <Route 
    key="create-agent"
    path="/agents/create" 
    element={
      <PremiumGuard>
        <CreateAgentPage />
      </PremiumGuard>
    } 
  />
];
