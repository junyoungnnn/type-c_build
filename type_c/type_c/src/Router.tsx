import { HashRouter, Switch, Route } from "react-router-dom";
import News from "./routes/News";
import Fish from "./routes/Fish";
import Fishs from "./routes/Fishs";
import About from "./routes/About";
import Contact from "./routes/Contact";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function Router() {
  return (
    <HashRouter>
      <Header />
      <Switch>
        <Route path="/news">
          <News />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/:fishName">
          <Fish />
        </Route>
        <Route exact path="/">
          <Fishs />
        </Route>
      </Switch>
      <Footer />
    </HashRouter>
  );
}

export default Router;
