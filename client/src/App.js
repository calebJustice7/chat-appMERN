import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Signup from './Components/Signup/Signup';
import Signin from './Components/Signin/Signin';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Components/Home/Home';

function App() {
  const dispatch = useDispatch();
  const [store, setStore] = useState();

  useEffect(() => {
      let store = localStorage.getItem('user') == null ? false : JSON.parse(localStorage.getItem('user'));
      if(store){
          dispatch({type: 'LOGIN', user: store.user});
          setStore(store);
      } else {
        setStore(false);
      }
  },[dispatch])

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/">
            {store ? <Redirect to="/home"/> : <Signin/>}
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
