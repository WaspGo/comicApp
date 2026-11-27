import { Link } from "react-router";
import uw from "../../assets/UW.png";

function ComicItem() {
  return (
    <li>
      <Link to="/comicDesc">
        <img
          className="w-full"
          src={uw}
          alt="Cover of Ultimate X-Men Vol. 5: Ultimate War"
        />
        <p className="font-[700] text-[14px]">
          ULTIMATE X-MEN VOL. 5: ULTIMATE WAR TPB
        </p>
        <div className="mt-[9px] font-[700] text-[14px] text-black/60">
          NOT AVAILABLE
        </div>
      </Link>
    </li>
  );
}

export default ComicItem;
