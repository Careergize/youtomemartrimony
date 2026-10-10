import { useNavigate } from 'react-router-dom';
import MobileAuth from './components/MobileAuth';

export default function MobileAuthPage({ registration = false }: { registration?: boolean }) {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-[#F8FAF8]"><MobileAuth registration={registration} onClose={() => { sessionStorage.setItem('you2me-auth-dismissed', 'true'); navigate('/'); }} /></div>;
}
