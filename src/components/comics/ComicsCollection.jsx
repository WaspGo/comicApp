import Button from "../Button";
import ComicItem from "./ComicItem";
function ComicsCollection() {
  return (
    <div>
      <ul className="mt-[50px] grid grid-cols-4 gap-x-[67px] gap-y-[55px]">
        <ComicItem />
        <ComicItem />
        <ComicItem />
        <ComicItem />
        <ComicItem />
        <ComicItem />
        <ComicItem />
        <ComicItem />
      </ul>
      <Button size="wide" className="mx-auto mt-[45px]">
        load more
      </Button>
    </div>
  );
}

export default ComicsCollection;
