import Header from "../Header";
import Randominfo from "./Randominfo";
import Collection from "./Collection";
import { Component } from "react";
import Errorboundary from "../ErrorBoundary/ErrorBoundary";

class LandingPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="relative mx-auto w-[1100px] py-[50px] font-sans">
        <Header />
        <Errorboundary>
          <Randominfo />
        </Errorboundary>
        <Errorboundary>
          <Collection />
        </Errorboundary>
      </div>
    );
  }
}

export default LandingPage;
