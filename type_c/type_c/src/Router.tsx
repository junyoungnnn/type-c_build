import { HashRouter, Switch, Route } from "react-router-dom";
import News from "./routes/News";
import Fish from "./routes/Fish";
import Fishs from "./routes/Fishs";

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Fishs />
        </Route>
        <Route path="/news">
          <News />
        </Route>
        <Route path="/:fishName">
          <Fish />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default Router;
