import clsx from 'clsx';
import { NavLink, NavLinkProps } from 'react-router-dom';

const HeaderLink = ({ children, className, ...rest }: NavLinkProps) => (
  <NavLink
    className={(props) =>
      clsx(
        className,
        'px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-white',
        props.isActive && 'font-bold text-black dark:text-white'
      )
    }
    {...rest}
  >
    {children}
  </NavLink>
);

export default function Header() {
  return (
    <header className="block sm:flex items-center text-center">
      <div className="font-bold text-2xl me-3 mb-3">Voting Prototype</div>
      <nav className="ms-auto mb-3">
        <HeaderLink to="/">Leaderboard</HeaderLink>
        <HeaderLink to="/vote">Vote Now</HeaderLink>
      </nav>
    </header>
  );
}
