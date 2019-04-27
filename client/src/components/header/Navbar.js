import React from 'react'
import { Link } from 'react-router-dom'

class Navbar extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        const role = localStorage.getItem('role')
        return (
            <React.Fragment>
                { this.props.isAuthenticated ? (
                <header className="header">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg">
                            <Link to="/" className="navbar-brand">
                                Expense Manager
                            </Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMenu">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarMenu">
                                <ul className="navbar-nav ml-auto">
                                    { this.props.isAuthenticated ? role === 'admin' ? 
                                        <React.Fragment>
                                            <li className="nav-item">
                                                <Link to="/admin/expenses" className="nav-link">Expenses</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/admin/categories" className="nav-link">Categories</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/admin/users" className="nav-link">Users</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/logout" className="nav-link logout">Logout</Link>
                                            </li>
                                        </React.Fragment> :   
                                        <React.Fragment>
                                            <li className="nav-item">
                                                <Link to="/expenses" className="nav-link">Expenses</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/logout" className="nav-link logout">Logout</Link>
                                            </li>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <li className="nav-item">
                                                <Link to="/login" className="nav-link">Login</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/register" className="nav-link">Register</Link>
                                            </li>
                                        </React.Fragment>
                                    }                                    
                                </ul>
                            </div>
                        </nav>
                    </div>
                </header>
                ) : ( <div></div> )
            }
        </React.Fragment>
        )
    }
}

export default Navbar