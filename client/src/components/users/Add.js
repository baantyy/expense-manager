import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import UserForm from './Form'

class AddUser extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            submitLoading: false,
            errors: {
                fullname: '',
                username: '',
                email: '',
                password: '',
                roles: '',
                allowAccess: ''
            }
        }
    }

    componentDidMount(){
        document.title = "Add User"
    }

    handleSubmit = (formData) => {
        this.setState(() => ({
            submitLoading: true
        }))
        const token = localStorage.getItem('token')
        axios.post("/api/admin/users", formData, {
                headers: {
                    'x-auth': token
                }
            })
            .then(res => {
                console.log(res.data)
                if(res.data.errors){
                    this.setState(() => ({
                        errors: res.data.errors,
                        submitLoading: false
                    }))
                }else{
                    this.props.history.push('/admin/users')
                }
            })
            .catch(err => {
                console.log('error',err)
            })
    }

    render(){
        return (
            <div className="expenses">
                <div className="headTitle">
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <h1>Add User</h1>
                                </div>
                                <div className="col-6">
                                    <div className="rightBtn">
                                        <Link to="/admin/users">Go Back</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="container">
                    <UserForm title="Add" 
                              handleSubmit={this.handleSubmit}
                              submitLoading={this.state.submitLoading} 
                              errors={this.state.errors}
                    />
                </div>
            </div>
        )
    }
}

export default AddUser