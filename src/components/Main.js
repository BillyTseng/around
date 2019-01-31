import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Register} from './Register';
import { Login } from './Login';
import { Home } from './Home';

export class Main extends React.Component {

    getLogin = () => {
        if (this.props.isLoggedIn) {
            return <Redirect to={`${process.env.PUBLIC_URL}/home`} />
        }
        return <Login handleLogin={this.props.handleLogin} />;
    }

    getHome = () => {
        return this.props.isLoggedIn ? <Home/> : <Redirect to={`${process.env.PUBLIC_URL}/login`}/>;
    }

    getRoot = () => {
        return <Redirect to={`${process.env.PUBLIC_URL}/login`} />;
    }

    render() {
        return (
            <div className="main">
                <Switch>
                    <Route exact path={`${process.env.PUBLIC_URL}/around`} render={this.getRoot}/>
                    <Route path={`${process.env.PUBLIC_URL}/login`} render={this.getLogin}/>
                    <Route path={`${process.env.PUBLIC_URL}/register`} component={Register}/>
                    <Route path={`${process.env.PUBLIC_URL}/home`} render={this.getHome}/>
                    <Route path={`${process.env.PUBLIC_URL}`} render={this.getRoot}/>
                </Switch>
            </div>
        );
    }
}