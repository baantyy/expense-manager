import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Spinner from '../commons/Spinner'

class ViewAllUsers extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            users: [],
            filteredUsers: [],
            searchValue: '',
            isLoaded: false,
            deleteLoading: {
                id: '',
                status: false
            },
            formMsg: {
                css: '',
                msg: ''
            }
        }
    }

    componentDidMount(){
        document.title = "All Users"
        const token = localStorage.getItem('token')
        axios.get(`/api/admin/users`,{
                headers: {
                    'x-auth': token
                }
            })
            .then(res => {
                this.setState(() => ({
                    users: res.data,
                    filteredUsers: res.data,
                    isLoaded: true
                }))
            })
    }

    searchUser = (e) => {
        const value = e.target.value.toLowerCase()
        this.setState((prevState) => ({
            searchValue: value,
            filteredUsers: prevState.users.filter(user => user.fullname.toLowerCase().includes(value))
        }))
    }

    handleDelete = (id) => {
        if(window.confirm("Are you sure")){
            this.setState(() => ({
                deleteLoading: {
                    id, status: true
                }
            }))
            const token = localStorage.getItem('token')
            axios.delete(`/api/admin/users/${id}`,{
                    headers: {
                        'x-auth': token
                    }
                })
                .then(res => {
                    if(res.data.user){
                        this.setState((prevState) => ({
                            deleteLoading: {
                                id: '',
                                status: false
                            },
                            users: prevState.users.filter(user => user._id !== id),
                            filteredUsers: prevState.filteredUsers.filter(user => user._id !== id)
                        }))
                    }else{
                        this.setState(() => ({
                            deleteLoading: {
                                id: '',
                                status: false
                            },
                            formMsg: {
                                css: 'danger',
                                msg: 'Something Went Wrong !'
                            }
                        }))
                    }
                })
        }
    }

    render(){
        return (
            <div className="expenses">
                <div className="headTitle">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <h1>Users - { this.state.filteredUsers.length }</h1>
                            </div>
                            <div className="col-6">
                                <div className="rightBtn">
                                    <Link to="/admin/users/add">Add User</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    { this.state.isLoaded ? (
                        <React.Fragment>
                            <div className="row">
                                <div className="col-md-6">
                                    {
                                        this.state.formMsg.msg ? <p className={`text-${this.state.formMsg.css}`}>{ this.state.formMsg.msg }</p> : ''
                                    }
                                </div>
                                <div className="col-md-6">
                                    <form>
                                        <input className="form-control search" type="text" placeholder="Search Here" onChange={this.searchUser} value={this.state.searchValue} />
                                    </form>
                                </div>
                            </div>
                            <div className="tableCover">
                                <table className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sl. No.</th>
                                            <th>Full Name</th>
                                            <th>Userame</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.filteredUsers.length ? (
                                                this.state.filteredUsers.map((user, index) => {
                                                    return (
                                                    <tr key={user._id}>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ user.fullname }</td>
                                                        <td className="noCap">{ user.username }</td>
                                                        <td className="noCap">{ user.email }</td>
                                                        <td>{ user.roles[0] }</td>
                                                        <td>
                                                            { user.allowAccess ? (
                                                                <span className="text-success">Approved</span>
                                                            ) : (
                                                                <span className="text-danger">Not Approved</span>
                                                            ) }
                                                        </td>
                                                        <td>
                                                            <Link title="Edit" to={`users/edit/${user._id}`}>
                                                                <i className="fa fa-pencil text-primary"></i>
                                                            </Link>
                                                            <button title="delete" 
                                                                    onClick={() => {
                                                                        this.handleDelete(user._id)
                                                                    }}
                                                            >   
                                                            {
                                                                this.state.deleteLoading.id === user._id && this.state.deleteLoading.status ? <i className="fa fa-spin text-danger fa-spinner"></i> : <i className="fa fa-trash text-danger"></i>
                                                            }
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center"> No Users Found </td>
                                                </tr>
                                            )
                                        }
                                        
                                    </tbody>
                                </table>
                            </div>
                        </React.Fragment>
                        ) : ( <div className="text-center mt-5 mb-5"><Spinner /></div> )
                    }
                </div>
            </div>
        )
    }
}

export default ViewAllUsers