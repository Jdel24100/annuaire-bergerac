// Test temporaire pour vérifier AdminPage
import { AdminPage } from './components/AdminPage';

export function TestAdmin() {
  const handleNavigate = (page: string) => {
    console.log('Navigate to:', page);
  };

  return <AdminPage onNavigate={handleNavigate} />;
}