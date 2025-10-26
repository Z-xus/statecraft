import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 py-3 fixed top-0 left-0 right-0 bg-opacity-90 backdrop-blur-md z-50 border-b border-gray-700 shadow-lg h-12">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 h-full">
        <Link 
          to="/" 
          className="text-2xl md:text-3xl font-bold text-white tracking-wide hover:text-teal-400 transition-colors duration-300"
        >
          StateCraft
        </Link>
        <div className="flex gap-4 md:gap-8 lg:gap-12">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/dfatoui">DFA From UI</NavLink>
          <NavLink to="/regextodfa">Regex to FA</NavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-300 text-sm md:text-base whitespace-nowrap hover:text-teal-400 transition-colors duration-300"
  >
    {children}
  </Link>
);

export default Navbar;