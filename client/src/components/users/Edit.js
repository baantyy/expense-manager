import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import UserForm from './Form'
import Spinner from '../commons/Spinner'

class EditUser extends React.Component{
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
            },
            isLoaded: false,
            user: {}
        }
    }

    componentDidMount(){
        document.title = "Edit User"
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        axios.get(`/api/admin/users/${id}`, {
                headers: {
                    'x-auth': token
                }
            })
            .then(res => {
                if(res.data.user){
                    this.setState(() => ({
                        user: res.data.user,
                        isLoaded: true
                    }))
                }
            })
            .catch(err => {
                console.log('error',err)
            })
    }

    handleSubmit = (formData) => {
        this.setState(() => ({
            submitLoading: true
        }))
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        axios.put(`/api/admin/users/${id}`, formData, {
                headers: {
                    'x-auth': token
                }
            })
            .then(res => {
                console.log(res.data)
                if(res.data.errors){
                    this.setState(() => ({
                        submitLoading: false,
                        errors: res.data.errors
                    }))
                }else{
                    this.props.history.push('/admin/users')
                }
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    render(){
        return (
            <div className="expenses">
                { this.state.isLoaded ? (
                    <React.Fragment>
                        <div className="headTitle">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-6">
                                            <h1>Edit User</h1>
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
                            <UserForm title="Update" 
                                    handleSubmit={this.handleSubmit}
                                    submitLoading={this.state.submitLoading} 
                                    errors={this.state.errors}
                                    user={this.state.user}
                            />
                        </div>
                    </React.Fragment>
                    ) : <div className="text-center mt-5 mb-5"><Spinner /></div> 
                }
            </div>
        )
    }
}

export default EditUser