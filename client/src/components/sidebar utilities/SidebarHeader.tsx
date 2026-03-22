import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../features/auth/types/auth.types';

interface SidebarHeaderProps {
  isOpen: boolean;
  user: User | null;
  search: string;
  setSearch: (value: string) => void;
}

const SidebarHeader = ({
  isOpen,
  user,
  search,
  setSearch,
}: SidebarHeaderProps) => {
  if (!isOpen) return null;
  const content = (
    <>
      {/** Avatar + Name */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-400">
        <div className="avatar placeholder relative">
          <div className="bg-neutral text-neutral-content rounded-full border border-gray-200 w-10 flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt={user?.name}
                className="rounded-full"
              />
            ) : (
              <span>{user?.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
        <span className="absolute z-50 top-0 left-0 w-2 h-2 rounded-full bg-success"></span>
        </div>
        <span className="font-semibold truncate">{user?.name}</span>
      </div>
      {/** Search input */}
      <div className="px-3 py-2 border-b border-gray-200">
        <label
          htmlFor="name"
          aria-label="search input"
          className="input input-bordered flex items-center gap-2 input-sm"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            id="name"
            name="name"
            className="grow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </label>
      </div>
    </>
  );
  return content;
};

export default SidebarHeader;
