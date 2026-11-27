import Header from "../Header";
import Randominfo from "./Randominfo";
import Collection from "./Collection";
import { Component } from "react";

class LandingPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="relative mx-auto w-[1100px] py-[50px] font-sans">
        <Header />
        <Randominfo />
        <Collection />
      </div>
    );
  }
}

export default LandingPage;
