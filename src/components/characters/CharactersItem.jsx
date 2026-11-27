// import abyss from "../../assets/abyss.jpg";
import { Component } from "react";
class CharactersItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, onCharSelected } = this.props;
    return (
      <li
        key={item.id}
        className={`h-[318px] w-[200px] cursor-pointer bg-dark p-[15px] transition-transform duration-300 shadow-[5px_5px_10px_rgba(0,0,0,0.25)]`}
        onClick={() => {
          onCharSelected(item.id);
        }}
      >
        <img
          src={item.thumbnail}
          alt="Abyss"
          className="h-[200px] w-[200px] max-w-none -translate-x-[15px] -translate-y-[15px] object-cover"
        />
        <div className="text-[22px] font-bold leading-[29px] text-white uppercase">
          {item.name}
        </div>
      </li>
    );
  }
}

export default CharactersItem;
