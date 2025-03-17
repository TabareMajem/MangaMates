import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { ChatProvider } from '@/lib/chat/chat-context';

// Pages
import HomePage from './pages/home';
import SignInPage from './pages/auth/signin';
import SignUpPage from './pages/auth/signup';
import PricingPage from './pages/pricing';
import JournalPage from './pages/journal';
import PersonalityQuizPage from './pages/personality-quiz';
import AssessmentPage from './pages/personality-quiz/[type]';
import AssessmentResultsPage from './pages/personality-quiz/results';
import ProfileInsightsPage from './pages/profile-insights';
import MangaStoryPage from './pages/manga-story';
import CharacterListPage from './pages/character/list';
import CharacterProfilePage from './pages/character/[id]';
import TalkWithCharacterPage from './pages/talk-with-character';
import CharacterChatPage from './pages/talk-with-character/[id]';
import SocialMediaAnalyzerPage from './pages/social-media';
import CreateAgentPage from './pages/agents/create';
import PremiumPreviewPage from './pages/premium-preview';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ChatProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/journal" element={<JournalPage />} />
          
          {/* Assessment Routes */}
          <Route path="/personality-quiz" element={<PersonalityQuizPage />} />
          <Route path="/personality-quiz/:type" element={<AssessmentPage />} />
          <Route path="/personality-quiz/:type/results" element={<AssessmentResultsPage />} />
          
          {/* Other Routes */}
          <Route path="/profile-insights" element={<ProfileInsightsPage />} />
          <Route path="/manga-story" element={<MangaStoryPage />} />
          <Route path="/character/list" element={<CharacterListPage />} />
          <Route path="/character/:id" element={<CharacterProfilePage />} />
          <Route path="/talk-with-character" element={<TalkWithCharacterPage />} />
          <Route path="/talk-with-character/:id" element={<CharacterChatPage />} />
          <Route path="/social-media" element={<SocialMediaAnalyzerPage />} />
          <Route path="/agents/create" element={<CreateAgentPage />} />
          <Route path="/premium-preview" element={<PremiumPreviewPage />} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
