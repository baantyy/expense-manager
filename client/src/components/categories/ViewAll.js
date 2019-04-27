import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Spinner from '../commons/Spinner'

class ViewAllCategories extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            categories: [],
            filteredCategories: [],
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

	componentWillMount(){
        document.title = "All Categories"
		const roles = JSON.parse(localStorage.getItem('roles'))
		!roles ? this.props.history.push('/login') : !roles.includes('admin') && this.props.history.push('/login')
	}

    componentDidMount(){
        const token = localStorage.getItem('token')
        axios.get(`/api/admin/categories`,{
                headers: {
                    'x-auth': token
                }
            })
            .then(res => {
                this.setState(() => ({
                    categories: res.data,
                    filteredCategories: res.data,
                    isLoaded: true
                }))
            })
    }

    searchCategory = (e) => {
        const value = e.target.value.toLowerCase()
        this.setState((prevState) => ({
            searchValue: value,
            filteredCategories: prevState.categories.filter(category => category.name.toLowerCase().includes(value))
        }))
    }

    handleDelete = (id) => {
        const roles = JSON.parse(localStorage.getItem('roles'))
        if(roles.includes('superadmin')){
            if(window.confirm("Are you sure")){
                this.setState(() => ({
                    deleteLoading: {
                        id, status: true
                    }
                }))
                const token = localStorage.getItem('token')
                axios.delete(`/api/admin/categories/${id}`,{
                        headers: {
                            'x-auth': token
                        }
                    })
                    .then(res => {
                        if(res.data.category){
                            this.setState((prevState) => ({
                                deleteLoading: {
                                    id: '',
                                    status: false
                                },
                                categories: prevState.categories.filter(category => category._id !== id),
                                filteredCategories: prevState.filteredCategories.filter(category => category._id !== id)
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
        }else{
            window.alert(`You don't have permission to delete`)
        }
    }

    render(){
        return (
            <div className="expenses">
                <div className="headTitle">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <h1>Categories - { this.state.filteredCategories.length }</h1>
                            </div>
                            <div className="col-6">
                                <div className="rightBtn">
                                    <Link to="/admin/categories/add">Add Category</Link>
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
                                        <input className="form-control search" type="text" placeholder="Search Here" onChange={this.searchCategory} value={this.state.searchValue} />
                                    </form>
                                </div>
                            </div>
                            <div className="tableCover">
                                <table className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sl. No.</th>
                                            <th>Category</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.filteredCategories.length ? (
                                                this.state.filteredCategories.map((category, index) => {
                                                    return (
                                                    <tr key={category._id}>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ category.name }</td>
                                                        <td>
                                                            <Link title="Edit" to={`/admin/categories/edit/${category._id}`}>
                                                                <i className="fa fa-pencil text-primary"></i>
                                                            </Link>
                                                            <button title="delete" 
                                                                    onClick={() => {
                                                                        this.handleDelete(category._id)
                                                                    }}
                                                            >   
                                                            {
                                                                this.state.deleteLoading.id === category._id && this.state.deleteLoading.status ? <i className="fa fa-spin text-danger fa-spinner"></i> : <i className="fa fa-trash text-danger"></i>
                                                            }
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center"> No Category Found </td>
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

export default ViewAllCategories