import { Component } from "react";
import CharactersItem from "./CharactersItem";
import CharacterDescription from "./CharacterDesc";
import ComicService from "../../services/ComicServise";
import vision from "../../assets/vision.png";
import Button from "../Button";
import Spinner from "../spinner";

class Collection extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
    selectedChar: null,
  };

  comicService = new ComicService();

  componentDidMount() {
    this.updateCollection();
  }

  onCharsLoaded = (chars) => {
    this.setState({ chars, loading: false });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  updateCollection = () => {
    this.comicService
      .getAllCharacters()
      .then(this.onCharsLoaded)
      .catch(this.onError);
  };

  onCharSelected = (id) => {
    this.setState({
      selectedChar: id,
    });
  };

  characterItems = () => {
    if (this.state.loading) {
      return (
        <div className="col-span-3 flex min-h-[260px] items-center justify-center text-center">
          <Spinner />
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className="col-span-3 flex min-h-[1014px] items-center justify-center text-center">
          "The characters could not be found"
        </div>
      );
    } else if (this.state.loading === false) {
      return this.state.chars.map((item) => {
        return (
          <CharactersItem
            key={item.id}
            item={item}
            onCharSelected={this.onCharSelected}
          />
        );
      });
    }
  };

  render() {
    return (
      <section className="mt-[50px] grid grid-cols-[650px_425px] items-start gap-x-[25px]">
        <div>
          <ul className="grid grid-cols-[200px_200px_200px] gap-x-[25px] gap-y-[30px]">
            {this.characterItems()}
          </ul>
          <Button size="wide" className="mx-auto mt-[45px]">
            load more
          </Button>
        </div>
        <CharacterDescription selectedChar={this.state.selectedChar} />

        <img
          src={vision}
          alt=""
          className="absolute -right-[174px] -bottom-[70px] -z-[1]"
        />
      </section>
    );
  }
}

export default Collection;
