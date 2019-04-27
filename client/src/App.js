import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import axios from 'axios'

import Navbar from './components/header/Navbar'

import Home from './components/Home'

import AddExpense from './components/expenses/Add'
import EditExpense from './components/expenses/Edit'
import ViewAllExpenses from './components/expenses/ViewAll'
import ViewOneExpense from './components/expenses/ViewOne'

import AddUser from './components/users/Add'
import EditUser from './components/users/Edit'
import ViewAllUsers from './components/users/ViewAll'

import AddCategory from './components/categories/Add'
import EditCategory from './components/categories/Edit'
import ViewAllCategories from './components/categories/ViewAll'

import Register from './components/auth/Register'
import Login from './components/auth/Login'

class App extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      isAuthenticated: false,
      roles: [],
      formStatus: {
        status: false,
        msg: '',
        css: ''
      }
    }
  }

  componentDidMount(){
    const token = localStorage.getItem('token')    
    const roles = JSON.parse(localStorage.getItem('roles'))
    if(token && roles){
      this.setState(() => ({
        isAuthenticated: true,
        roles: roles
      }))
    }
  }

  handleAuthentication = () => {
    this.setState(() => ({
      isAuthenticated: true
    }))
  }

  handleFormStatus = (status, css, msg) => {
    this.setState(() => ({
      formStatus: {
        status, msg, css
      }
    }))
  }

  render() {
    return (
      
      <BrowserRouter >
        <div className="wrapper">
          <Navbar isAuthenticated={this.state.isAuthenticated} />
          <div className="body">

            <Switch>

              <Route path="/" component={Home} exact={true} />

              <Route path="/admin/expenses" component={ViewAllExpenses} exact={true} />
              <Route path="/admin/expenses/add" component={AddExpense} exact={true} />
              <Route path="/admin/expenses/view/:id" component={ViewOneExpense} exact={true} />
              <Route path="/admin/expenses/edit/:id" component={EditExpense} exact={true} />

              <Route path="/admin/users" component={ViewAllUsers} exact={true} />
              <Route path="/admin/users/add" component={AddUser} exact={true} />
              <Route path="/admin/users/edit/:id" component={EditUser} exact={true} />

              <Route path="/admin/categories" component={ViewAllCategories} exact={true} />
              <Route path="/admin/categories/add" component={AddCategory} exact={true} />
              <Route path="/admin/categories/edit/:id" component={EditCategory} exact={true} />

              <Route path="/expenses" component={ViewAllExpenses} exact={true} />
              <Route path="/expenses/add" component={AddExpense} exact={true} />
              <Route path="/expenses/view/:id" component={ViewOneExpense} exact={true} />
              <Route path="/expenses/edit/:id" component={EditExpense} exact={true} />

              <Route path="/login" render={(props) => {
                return <Login {...props} 
                              handleFormStatus={this.handleFormStatus} 
                              handleAuthentication={this.handleAuthentication} 
                              formStatus={this.state.formStatus} 
                              isAuthenticated={this.state.isAuthenticated}
                        />
              }} />
              <Route path="/register" render={(props) => {
                return <Register {...props} handleFormStatus={this.handleFormStatus} />
              }} />
              <Route path="/logout" render={(props) => {
                axios.delete(`/api/users/logout`, {
                    headers: {
                      'x-auth': localStorage.getItem('token')
                    }
                  })
                  .then(res => {
                    props.history.push('/login')
                    this.setState(() => ({
                      isAuthenticated: false
                    }))
                    localStorage.removeItem('token')
                    localStorage.removeItem('id')
                    localStorage.removeItem('roles')
                  })
              }} />

            </Switch>

          </div>
        </div>
      </BrowserRouter>

    )
  }
}

export default App