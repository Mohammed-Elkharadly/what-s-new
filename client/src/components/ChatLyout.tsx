import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useSocket from '../shared/hooks/useSocket';

const ChatLyout = () => {
  // connect socket when autheticated
  useSocket();
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatLyout;
