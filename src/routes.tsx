import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppSearchDx } from './pages/app-index/app';
import { NotFound } from './pages/not-found/not-found';

function Routes(props: any) {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL} {...props}>
      <Switch>
        <Route path="/" exact component={AppSearchDx} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
