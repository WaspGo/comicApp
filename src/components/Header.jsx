import { Link } from "react-router";

function Header() {
  return (
    <header className="flex justify-between">
      <h1 className="text-[28px] font-bold leading-[37px]">
        <Link to="/" className="inline-block">
          <span className="text-main">Comic</span> information portal
        </Link>
      </h1>
      <nav>
        <ul className="flex justify-between text-[24px] font-bold leading-[32px]">
          <li className="mx-[8px]">
            <Link to="/" className="hover:text-main">
              Characters
            </Link>
          </li>
          /
          <li className="mx-[8px]">
            <Link to="/comics" className="hover:text-main">
              Comics
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
