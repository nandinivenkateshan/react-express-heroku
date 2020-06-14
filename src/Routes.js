import React from 'react'
import SignUp from './SignUp'
import Login from './Login'
import NotFound from './NotFound'
import App from './App'
import ForgotPswd from './ForgotPswd'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ResetPswd from './ResetPswd'

function Routes () {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={SignUp} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/app' component={App} />
        <Route exact path='/pswdSet' component={ForgotPswd} />
        <Route exact path='/resetPswd' component={ResetPswd} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes
