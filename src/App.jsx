import { BrowserRouter, Routes, Route } from "react-router";
import { Component } from "react";

import LandingPage from "./components/characters/landing";
import Comics from "./components/comics/Comics";
import ComicDescription from "./components/comic/ComicDescription";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/comics" element={<Comics />} />
          <Route path="/comicDesc" element={<ComicDescription />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
