import { Switch, Route } from "react-router-dom";
import Homepage from "./App/Homepage";
import Login from "./App/Login";
import Register from "./App/Register";
const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    </>
  );
};

export default App;
