import { Link } from "react-router";

import Banner from "../Banner";
import Header from "../Header";

import uw from "../../assets/UW.png";

function ComicDescription() {
  return (
    <div className="relative mx-auto w-[1100px] py-[50px] font-sans">
      <Header />
      <Banner />
      <div className="mt-[50px] grid grid-cols-[293px_550px_1fr] gap-x-[50px]">
        <img
          className="w-full"
          src={uw}
          alt="Cover of X-Men: Days of Future Past"
        />
        <div>
          <h2 className="font-[700] text-[22px]">X-Men: Days of Future Past</h2>
          <p className="mt-[28px] font-normal text-[18px]">
            Re-live the legendary first journey into the dystopian future of
            2013 - where Sentinels stalk the Earth, and the X-Men are humanity's
            only hope...until they die! Also featuring the first appearance of
            Alpha Flight, the return of the Wendigo, the history of the X-Men
            from Cyclops himself...and a demon for Christmas!?
          </p>
          <div className="mt-[40px] font-normal text-[18px]">144 pages</div>
          <div className="mt-[28px] font-normal text-[18px]">
            Language: en-us
          </div>
          <div className="mt-[28px] font-[700] text-[24px] text-[#9f0013]">
            9.99$
          </div>
        </div>
        <Link to="/comics" className="justify-self-end font-[700] text-[18px]">
          Back to all
        </Link>
      </div>
    </div>
  );
}

export default ComicDescription;
