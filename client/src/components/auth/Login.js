import React from 'react' 
import axios from 'axios'
import { Link } from 'react-router-dom'

class Login extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            username_email: '',
            password: '',
            formStatus: {
                status: props.formStatus.status,
                msg: props.formStatus.msg,
                css: props.formStatus.css
            },
            submitBtn: 'Login'
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            username_email: this.state.username_email,
            password: this.state.password
        }
        this.setState(() => ({
            submitBtn: ''
        }))
        this.props.handleFormStatus(false, '', '')
        axios.post(`/api/users/login`, formData)
            .then(response => {
                if (response.data.errors) {
                    this.setState(() => ({
                        formStatus: {
                            status: true,
                            msg: response.data.errors,
                            css: 'danger'
                        },
                        password: '',
                        submitBtn: 'Login'
                    }))
                } else {
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('id', response.data.id)
                    if(response.data.roles.includes("admin")){
                        localStorage.setItem('role', 'admin')
                        this.props.history.push('/admin/expenses')
                    }else{                        
                        localStorage.setItem('role', 'employer')
                        this.props.history.push('/expenses')
                    }
                    this.props.handleAuthentication(true)
                }
            })
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    componentDidMount(){
        document.title = "Login"
    }

    render() {
        return (
            <div className="loginBlock">
                <div>
                    <h2>Login </h2>
                    <form onSubmit={this.handleSubmit}>
                        
                        <input type="text"
                            name="username_email"
                            value={this.state.username_email}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Username / Email"
                        />
                    
                        <input type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Password"
                        />      

                        { this.state.formStatus.status && <p className={`formStatus text-${this.state.formStatus.css}`}>{ this.state.formStatus.msg }</p> }

                        <div className="loginFooter">
                            <button type="submit" className="btn">
                                {this.state.submitBtn === 'Login' ? 'Login' : <i className="fa fa-spin fa-spinner"></i>}
                            </button>
                            <Link to="/register">Create an account</Link>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}

export default Login