import Header from "../Header";
import Banner from "../Banner";
import ComicsCollection from "./comicsCollection";

function Comics() {
  return (
    <div className="relative mx-auto w-[1100px] py-[50px] font-sans">
      <Header />
      <Banner />
      <ComicsCollection />
    </div>
  );
}
export default Comics;
