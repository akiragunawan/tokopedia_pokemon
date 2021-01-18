import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import GetPokemon from './component/GetPokemon';
import Nav from './component/nav'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PokeDetail from './component/poke_detail';
import mypoke from './component/mypokemon'

function App() {

  const client = new ApolloClient({
    uri: 'https://graphql-pokeapi.vercel.app/api/graphql ',
    cache: new InMemoryCache()
  });

  return (
    <Router>
      <ApolloProvider client={client}>
        <Nav />
        <Switch>

          <Route path="/" exact component={GetPokemon} />
          <Route path="/poke_detail" exact component={PokeDetail} />
          <Route path="/poke_detail/:id" exact component={PokeDetail} />
          <Route path="/mypokemons" exact component={mypoke} />



        </Switch>

      </ApolloProvider>
    </Router>
  );
}

export default App;
