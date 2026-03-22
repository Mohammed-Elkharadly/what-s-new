import { useAppDispatch } from '../../app/hooks';
import { setSelectedContact } from '../../features/users/slices/usersSlice';
import type { Contact } from '../../features/users/types/users.types';

interface SidebarContentProps {
  isOpen: boolean;
  contacts: Contact[];
  selectedContact: Contact | null;
  search: string;
  onlineUsers: string[];
}
const SidebarContent = ({
  isOpen,
  contacts,
  selectedContact,
  search,
  onlineUsers,
}: SidebarContentProps) => {
  const dispatch = useAppDispatch();

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()),
  );

  const content = (
    <>
      <div className="flex-1 overflow-y-auto py-2">
        {filteredContacts?.length === 0 ? (
          isOpen ? (
            <span className="text-xs text-base-content/50 px-4 py-2">
              No contacts found
            </span>
          ) : null
        ) : (
          filteredContacts.map((contact: Contact) => (
            <button
              key={contact._id}
              type="button"
              aria-label="selected contact"
              className={`flex items-center w-full px-4 py-2 hover:bg-green-700 transition-colors cursor-pointer mb-2 rounded-xl
                ${isOpen ? 'gap-3' : 'justify-center'}
                ${selectedContact?._id === contact._id ? 'bg-green-700' : ''}`}
              onClick={() => dispatch(setSelectedContact(contact))}
            >
              <div className="flex items-center gap-3 relative">
                <div className="avatar placeholder shrink-0">
                  <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center border border-gray-200">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-xs">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                {/** online indicator */}
                <span
                  className={`absolute z-50 top-0 left-0 w-2 h-2 rounded-full 
                  ${onlineUsers.includes(contact._id) ? 'bg-success' : 'bg-gray-400'}`}
                ></span>
                {isOpen && (
                  <span className="truncate text-sm">{contact.name}</span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );
  return content;
};

export default SidebarContent;
