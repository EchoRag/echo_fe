import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConversations } from '../hooks/useConversations';
import { NotificationPopover } from './NotificationPopover';

interface NavItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

interface SideNavProps {
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const mainNavItems: NavItem[] = [
  {
    name: 'New Chat',
    path: '/',
    icon: (
      <div className="flex items-center justify-center w-5 h-5">
        <svg data-testid="chat-icon" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14"/>
        </svg>
      </div>
    ),
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: (
      <div data-testid="notification-icon" className="flex text-center items-center justify-center w-5 h-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.5V4M12 5.5a5 5 0 015 5v4.5m-5-9.5a5 5 0 00-5 5v4.5m5-9.5v9.5m-5 0h10m-10 0v1a5 5 0 0010 0v-1"/>
        </svg>
      </div>
    ),
  },
  {
    name: 'Projects',
    path: '/projects',
    icon: (
      <div className="flex items-center justify-center w-5 h-5">
        <svg data-testid="projects-icon" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4h14v16H5zm0 0v-6h14m-9 2h4"/>
        </svg>
      </div>
    ),
  },
  {
    name: 'Help',
    path: '/help',
    icon: (
      <div className="flex items-center justify-center w-5 h-5">
        <svg data-testid="help-icon" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13.5V10m0-3h.01M12 21a9 9 0 110-18 9 9 0 010 18z"/>
        </svg>
      </div>
    ),
  },
];

const bottomNavItems: NavItem[] = [
  {
    name: 'Logs',
    path: '/logs',
    icon: (
      <div className="flex items-center justify-center w-5 h-5">
        <svg data-testid="logs-icon" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 12h14M5 16h14"/>
        </svg>
      </div>
    ),
  },
  {
    name: 'Connection Status',
    path: '/status',
    icon: (
      <div className="flex items-center justify-center w-5 h-5">
        <svg data-testid="status-icon" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5a8.66 8.66 0 013.006 16.834M12 5a8.66 8.66 0 00-3.006 16.834M12 5v14"/>
        </svg>
      </div>
    ),
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: (
      <div className="flex items-center justify-center w-5 h-5">
        <svg data-testid="settings-icon" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
        </svg>
      </div>
    ),
  },
];

export function SideNav({ onCollapseChange }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const { conversations, loading, error } = useConversations();

  const handleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    const linkContent = (
      <div
        data-testid={`nav-item-${item.path.slice(1) || 'home'}`}
        className={`flex items-center ${isCollapsed ? 'px-3 justify-center' : 'px-6'} py-3 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'text-white bg-black/20'
            : 'text-gray-100 hover:text-white hover:bg-black/10'
        } relative`}
        title={isCollapsed ? item.name : ''}
      >
        <div className="flex items-center justify-center min-w-[20px]">
          {item.icon}
        </div>
        <span className={`ml-3 whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
          {item.name}
        </span>
      </div>
    );

    if (item.name === 'Notifications') {
      return (
        <NotificationPopover>
          {linkContent}
        </NotificationPopover>
      );
    }

    return (
      <Link to={item.path}>
        {linkContent}
      </Link>
    );
  };

  const renderConversations = () => {
    if (loading) {
      return (
        <div className="px-3 py-2">
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-3 py-2">
          <div className="text-red-500 text-sm text-center">Error loading conversations</div>
        </div>
      );
    }

    return (
      <>
        {/* Pinned History */}
        {!isCollapsed && conversations.filter(item => item.isPinned).length > 0 && (
          <div data-testid="pinned-chats" className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 px-3">Pinned Chats</h3>
            <ul className="max-h-[200px] overflow-y-auto">
              {conversations.filter(item => item.isPinned).map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className="flex items-center px-3 py-2 text-sm text-gray-100 hover:text-white hover:bg-black/10 rounded-md"
                  >
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent History */}
        {!isCollapsed && (
          <div data-testid="recent-chats" className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 px-3">Recent Chats</h3>
            <ul className="max-h-[200px] overflow-y-auto">
              {conversations.filter(item => !item.isPinned).map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className="flex items-center px-3 py-2 text-sm text-gray-100 hover:text-white hover:bg-black/10 rounded-md"
                  >
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };

  return (
    <div data-testid="sidenav" className={`flex flex-col ${isCollapsed ? 'w-[60px]' : 'w-64'} h-screen border-r border-gray-700/30 bg-gradient-custom transition-all duration-300`}>
      <button
        data-testid="toggle-button"
        className="w-12 h-12 p-3 text-white hover:bg-black/10 transition-colors duration-200 flex items-center justify-center"
        onClick={handleCollapse}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d={isCollapsed ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
          />
        </svg>
      </button>

      <nav data-testid="sidenav-content" className="flex-1 overflow-y-auto">
        {/* Main Navigation Items */}
        <ul className="py-4">
          {mainNavItems.map((item) => (
            <li key={item.name}>
              {renderNavItem(item)}
            </li>
          ))}
        </ul>

        {/* Conversations Section */}
        {!isCollapsed && renderConversations()}
      </nav>

      {/* Bottom Navigation Items */}
      <div data-testid="bottom-nav" className="border-t border-gray-700/30">
        <ul>
          {bottomNavItems.map((item) => (
            <li key={item.name}>
              {renderNavItem(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 