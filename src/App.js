import React from 'react';
import { auth } from 'firebase';

import { firebaseApp } from "./firebase";

import Router from './components/utils/Router';
import Loading from './components/pages/Loading';
import TopNav from './components/organisms/TopNav';
import Header from './components/molecules/Header';
import Spotify from './components/utils/Spotify';

class App extends React.Component {
  state = {
    isLoading: true,
    user: {},
    posts: {}
  }

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.handleAuth({ user });
      }
      this.setState({ isLoading: false });
    });
  };

  isAuthed = () => {
    return typeof this.state.user.uid !== 'undefined';
  };
  authenticate = () => {
    const authProvider = new auth.FacebookAuthProvider();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.handleAuth)
  };
  handleAuth = (authData) => {
    // Here we should probably load their "Posts" so we can take them to their main dashboard.
    const user = {
      uid: authData.user.uid,
      profileImage: authData.user.photoURL,
      displayName: authData.user.displayName,
      email: authData.user.email
    }
    this.setState({ user });
    // TODO: Post login take them to the dashboard
  };
  signOut = async (cb) => {
    this.setState({ isLoading: true });
    await auth().signOut();
    Spotify.setAccessToken(null);
    this.setState({ user: {}, isLoading: false });
    if (cb && typeof cb === 'function') cb();
  }

  renderRouter = () => {
    if (this.state.isLoading) return <Loading />;
    return (
      <Router
        isAuthed={this.isAuthed()}
        authenticate={this.authenticate}
        user={this.state.user}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="bg-gray-800 pb-32">
          <TopNav
            isAuthed={this.isAuthed()}
            user={this.state.user} 
            signOut={this.signOut}
          />
          <Header />
        </div>

        <main className="-mt-32">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              { this.renderRouter() }
            </div>
          </div>
        </main>
      </div>
    );
  };
};

export default App;
