import { Component } from "react";
import ComicService from "../../services/ComicServise";

import Button from "../Button";
import mjolnir from "../../assets/mjolnir.png";
import Spinner from "../spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class Randominfo extends Component {
  state = {
    char: {},
    loading: true,
    error: false,
  };

  comicService = new ComicService();

  componentDidMount() {
    this.updateChar();
  }

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

  updateChar = () => {
    const id = Math.floor(Math.random() * (20 - 1) + 1);
    this.onCharLoading();
    this.comicService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };
  render() {
    const { char, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <View char={char} /> : null;
    return (
      <main className="relative mt-[50px]">
        <div className="grid grid-cols-2 shadow-[5px_5px_20px_rgba(0,0,0,0.25)]">
          {errorMessage}
          {spinner}
          {content}
          <div className="relative bg-dark px-[35px] py-[40px]">
            <p className="text-[24px] font-bold leading-[32px] tracking-[-0.045em] text-white">
              Random character for today!
              <br />
              Do you want to get to know him better?
            </p>
            <p className="mt-[33px] text-[24px] font-bold leading-[32px] tracking-[-0.045em] text-white">
              Or choose another one
            </p>
            <Button
              onClick={() => {
                this.updateChar();
              }}
              className="mt-[13px]"
            >
              try it
            </Button>
            <img
              src={mjolnir}
              alt=""
              className="absolute -right-[37px] bottom-[14px]"
            />
          </div>
        </div>
      </main>
    );
  }
}

const View = ({ char }) => {
  const { name, thumbnail, description, homepage, wiki } = char;
  let imgStyle = "object-cover";
  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = "object-contain";
  }

  return (
    <div className="grid grid-cols-[180px_auto] gap-x-[30px] px-[35px] py-[40px]">
      <img
        src={thumbnail}
        alt="Random character"
        className={`h-[180px] w-[180px] ${imgStyle}`}
      />
      <div className="grid grid-rows-[minmax(29px,auto)_90px_38px] gap-y-[10px] pt-[3px]">
        <p className="text-[22px] font-bold leading-[29px] uppercase">{name}</p>
        <p className="text-[14px] leading-[18px]">{description}</p>
        <div>
          <Button href={homepage} className="mr-[30px]">
            homepage
          </Button>
          <Button href={wiki} variant="secondary">
            Wiki
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Randominfo;
