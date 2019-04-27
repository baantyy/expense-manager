import React from 'react'

class UserForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            fullname: props.user ? props.user.fullname : '',
            username: props.user ? props.user.username : '',
            email: props.user ? props.user.email : '',
            password: '',
            roles: props.user ? props.user.roles[0] : 'employee',
            allowAccess: props.user ? props.user.allowAccess : true,
            errors: {}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            fullname: this.state.fullname,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            roles: [this.state.roles],
            allowAccess: this.state.allowAccess
        }
        this.props.handleSubmit(formData)
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    render(){
        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-3">
                            <label className="label">Fullname</label>
                        </div>
                        <div className="col-md-4">
                            <input type="text" 
                                   className="form-control field" 
                                   placeholder="Enter Fullname" 
                                   name="fullname" 
                                   value={this.state.fullname} 
                                   onChange={this.handleChange}
                            />
                        </div>
                        <div className="col-md-5">
                            { this.props.errors.fullname ? <p className="text-danger">{ this.props.errors.fullname.message}</p> : '' }
                        </div>
                        <div className="col-md-3">
                            <label className="label">Username</label>
                        </div>
                        <div className="col-md-4">
                            <input type="text" 
                                   className="form-control field" 
                                   placeholder="Enter Username" 
                                   name="username" 
                                   value={this.state.username} 
                                   onChange={this.handleChange}
                            />
                        </div>
                        <div className="col-md-5">
                            { this.props.errors.username ? <p className="text-danger">{ this.props.errors.username.message}</p> : '' }
                        </div>
                        <div className="col-md-3">
                            <label className="label">Email</label>
                        </div>
                        <div className="col-md-4">
                            <input type="text" 
                                   className="form-control field" 
                                   placeholder="Enter Email" 
                                   name="email" 
                                   value={this.state.email} 
                                   onChange={this.handleChange}
                            />
                        </div>
                        <div className="col-md-5">
                            { this.props.errors.email ? <p className="text-danger">{ this.props.errors.email.message}</p> : '' }
                        </div>
                        <div className="col-md-3">
                            <label className="label">Password</label>
                        </div>
                        <div className="col-md-4">
                            <input type="password" 
                                   className="form-control field" 
                                   placeholder="Enter Password" 
                                   name="password"
                                   value={this.state.password} 
                                   onChange={this.handleChange}
                            />
                        </div>
                        <div className="col-md-5">
                            { this.props.errors.password ? <p className="text-danger">{ this.props.errors.password.message}</p> : '' }
                        </div>
                        <div className="col-md-3">
                            <label className="label">Access</label>
                        </div>
                        <div className="col-md-4">
                            <select className="form-control field" 
                                    name="allowAccess"
                                    onChange={this.handleChange} 
                                    value={this.state.allowAccess}>
                                <option value="true">Approved</option>
                                <option value="false">Not Approved</option>
                            </select>
                        </div>
                        <div className="col-md-5">
                            { this.props.errors.allowAccess ? <p className="text-danger">{ this.props.errors.allowAccess.message}</p> : '' }
                        </div>
                        <div className="col-md-3">
                            <label className="label">Role</label>
                        </div>
                        <div className="col-md-4">
                            <select className="form-control field" 
                                    name="roles"
                                    onChange={this.handleChange} 
                                    value={this.state.roles} >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="col-md-5">
                            { this.props.errors.roles ? <p className="text-danger">{ this.props.errors.roles.message}</p> : '' }
                        </div>
                        <div className="col-md-3">

                        </div>
                        <div className="col-md-4">
                            <button className="btn">
                                { this.props.submitLoading ? <i className="fa fa-spin fa-spinner"></i> : (`${this.props.title} User`)}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default UserForm