import { Component } from "react";
import Spinner from "../spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import ComicService from "../../services/ComicServise";
import Button from "../Button";
import Skeleton from "./Skeleton";

class CharacterDescription extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };

  comicService = new ComicService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedChar !== prevProps.selectedChar) {
      this.updateChar();
    }
  }

  updateChar = () => {
    const { selectedChar } = this.props;
    if (!selectedChar) {
      return;
    }
    this.onCharLoading();

    this.comicService
      .getCharacter(selectedChar)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };
  onCharLoading = () => {
    this.setState({ loading: true });
  };
  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    const { char, loading, error } = this.state;

    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
      <div className="relative z-[5] bg-white p-[25px] shadow-[0_0_20px_rgba(0,0,0,0.25)]">
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  let imgStyle = "object-cover";
  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = "object-contain";
  }
  return (
    <>
      <div className="grid grid-cols-[150px_auto] gap-x-[25px]">
        <img
          src={thumbnail}
          alt={name}
          className={`h-[150px] w-[150px] ${imgStyle}`}
        />
        <div>
          <div className="text-[22px] font-bold leading-[29px] uppercase">
            {name}
          </div>
          <div className="mt-[35px]">
            <Button href={homepage}>homepage</Button>
            <Button href={wiki} variant="secondary" className="mt-[10px]">
              Wiki
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-[15px] text-[14px] leading-[18px]">{description}</div>
      <div className="mt-[10px] text-[18px] font-bold leading-[24px]">
        Comics:
      </div>
      <ul className="relative mt-[10px]">
        {comics.length > 0 ? null : "There is no comics with this characres"}
        {comics.map((item, i) => {
          if (i > 9) return;
          return (
            <li
              key={i}
              className="mt-[10px] w-full px-[10px] leading-[25px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            >
              {item}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CharacterDescription;
