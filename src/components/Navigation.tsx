import { Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';

export function Navigation() {


  return (
    <Navbar fluid className="w-full bg-transparent">
      <Navbar.Brand as={Link} to="/" className='text-gray-900'>
        <img src="/echologo.svg" className="h-14 w-14 mr-3 border border-gray-800 bg-gray-800 p-1 rounded" alt="Echo Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-900">
          Echo
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <div className="flex md:order-2">
        <button
          type="button"
          className="flex text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full md:me-0 focus:ring-4 focus:ring-white/30 p-2.5 transition-all duration-200"
          id="user-menu-button"
          aria-label="User menu"
          aria-expanded="false"
        >
          <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </Navbar>
  );
} 