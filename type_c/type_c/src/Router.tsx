import { BrowserRouter, Switch, Route } from "react-router-dom";
import News from "./routes/News";
import Fish from "./routes/Fish";
import Fishs from "./routes/Fishs";
/*<Route path={process.env.PUBLIC_URL + "/"}></Route>*/

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/type-c_build">
          <Fishs />
        </Route>
        <Route path="/:fishName">
          <Fish />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default Router;
