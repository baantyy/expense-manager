import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class Register extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            fullname: '', 
            username: '', 
            email: '',
            password: '',
            errors: {},
            submitBtn: 'Register'
        }
    }

    handleChange = (e) => {
        e.persist() 
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            fullname: this.state.fullname,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }
        this.setState(() => ({
            submitBtn: ''
        }))
        axios.post(`/api/users/register`, formData)
            .then(response => {
                console.log(response.data)
                if(response.data.errors){
                    this.setState(() => ({
                        errors: response.data.errors,
                        submitBtn: 'Register'
                    }))
                }else{
                    this.props.handleFormStatus(true, 'success', 'Registered Successfully')
                    this.props.history.push('/login')
                }
            })
    }

    componentDidMount(){
        document.title = "Register"
    }

    render(){
        return (
            <div className="loginBlock">
                <div>
                    <h2>Register </h2>
                    <form onSubmit={this.handleSubmit}>

                        <input type="text"
                            name="fullname"
                            value={this.state.fullname} 
                            onChange={this.handleChange} 
                            className="form-control" 
                            placeholder="Full Name"
                        />
                        { this.state.errors.fullname && <p className="text-danger">{ this.state.errors.fullname.message }</p> }

                        <input type="text"
                            name="username"
                            value={this.state.username} 
                            onChange={this.handleChange} 
                            className="form-control" 
                            placeholder="Username"
                        />
                        { this.state.errors.username && <p className="text-danger">{ this.state.errors.username.message }</p> }
                    
                        <input type="text" 
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Email"
                        />
                        { this.state.errors.email && <p className="text-danger">{ this.state.errors.email.message }</p> }
                    
                        <input type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Password"
                        />
                        { this.state.errors.password && <p className="text-danger">{ this.state.errors.password.message }</p> }

                        <div className="loginFooter">
                            <button type="submit" className="btn">
                                {this.state.submitBtn === 'Register' ? 'Register' : <i className="fa fa-spin fa-spinner"></i>}
                            </button>
                            <Link to="/login">Already have an account ?</Link>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}

export default Register