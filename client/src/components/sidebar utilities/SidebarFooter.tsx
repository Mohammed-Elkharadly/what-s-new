import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

interface SidebarFooterProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  handleLogout: () => void;
}

const SidebarFooter = ({
  isOpen,
  isLoggingOut,
  handleLogout,
}: SidebarFooterProps) => {
  const content = (
    <>
      <div className="border-t border-base-300 p-3 flex flex-col gap-2">
        <button
          type="button"
          aria-label="settings"
          className="btn btn-ghost btn-sm justify-start gap-3 w-full hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faGear} size="lg" />
          {isOpen && <span>Settings</span>}
        </button>
        <button
          type="button"
          aria-label="logout"
          className="btn btn-ghost btn-sm justify-start gap-3 w-full text-error hover:bg-green-700"
          onClick={handleLogout}
        >
          {isLoggingOut ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
          )}
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </>
  );
  return content;
};

export default SidebarFooter;
