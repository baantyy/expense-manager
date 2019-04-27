import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Spinner from '../commons/Spinner'

class ViewAllExpenses extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            expenses: [],
            filteredExpenses: [],
            searchValue: '',
            isLoaded: false,
            deleteLoading: {
                id: '',
                status: false
            },
            formMsg: {
                css: '',
                msg: ''
            },
            roles: JSON.parse(localStorage.getItem('roles'))
        }
    }

    componentWillMount(){
        document.title = "All Expenses"
        !this.state.roles && this.props.history.push('/login')
	}

    componentDidMount(){
        const token = localStorage.getItem('token')
        const api = this.state.roles.includes('admin') ? '/api/admin/expenses' : '/api/expenses'
        axios.get(api,{ headers: { 'x-auth': token }})
            .then(res => {
                this.setState(() => ({
                    expenses: res.data,
                    filteredExpenses: res.data,
                    isLoaded: true
                }))
            })
    }

    searchExpense = (e) => {
        const value = e.target.value.toLowerCase()
        this.setState((prevState) => ({
            searchValue: value,
            filteredExpenses: prevState.expenses.filter(expense => expense.user.fullname.toLowerCase().includes(value))
        }))
    }

    handleDelete = (id) => {
        if(this.state.roles.includes('superadmin')){
            if(window.confirm("Are you sure")){
                this.setState(() => ({
                    deleteLoading: {
                        id, status: true
                    }
                }))
                const token = localStorage.getItem('token')
                axios.delete(`/api/admin/expenses/${id}`,{
                        headers: { 'x-auth': token }
                    })
                    .then(res => {
                        if(res.data.expense){
                            this.setState((prevState) => ({
                                deleteLoading: {
                                    id: '',
                                    status: false
                                },
                                expenses: prevState.expenses.filter(expense => expense._id !== id),
                                filteredExpenses: prevState.filteredExpenses.filter(expense => expense._id !== id)
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
        const route = this.state.roles.includes('admin') ? '/admin/' : '/'
        return (
            <div className="expenses">
                <div className="headTitle">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <h1>Expenses - { this.state.filteredExpenses.length }</h1>
                            </div>
                            <div className="col-6">
                                <div className="rightBtn">
                                    <Link to={`${route}expenses/add`}>Add Expense</Link>
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
                                    { this.state.formMsg.msg ? <p className={`text-${this.state.formMsg.css}`}>{ this.state.formMsg.msg }</p> : '' }
                                </div>
                                <div className="col-md-6">
                                    <form>
                                        <input className="form-control search" type="text" placeholder="Search Here" onChange={this.searchExpense} value={this.state.searchValue} />
                                    </form>
                                </div>
                            </div>
                            <div className="tableCover">
                                <table className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sl. No.</th>
                                            <th>Employee</th>
                                            <th>Date</th>
                                            <th>Budget</th>
                                            <th>Spent</th>
                                            <th>Category</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.filteredExpenses.length ? (
                                            this.state.filteredExpenses.map((expense, index) => {
                                                let amountSpent = 0
                                                expense.colleagues.map(colleague => {
                                                    amountSpent = amountSpent + colleague.amountSpent
                                                })
                                                return (
                                                <tr key={expense._id}>
                                                    <td>{ index + 1 }</td>
                                                    <td>{ expense.user.fullname }</td>
                                                    <td>{ expense.createdAt }</td>
                                                    <td>{ expense.budget }</td>
                                                    <td>{ amountSpent }</td>
                                                    <td>{ expense.category.name }</td>
                                                    <td>{ expense.reason }</td>
                                                    <td>{ expense.isApproved ? <span className="text-success">Approved</span> : <span className="text-danger">Not Approved</span> }</td>
                                                    <td>
                                                        <Link title="Edit" to={`${route}expenses/edit/${expense._id}`}>
                                                            <i className="fa fa-pencil text-dark"></i>
                                                        </Link>
                                                        <Link title="View" to={`${route}expenses/view/${expense._id}`}>
                                                            <i className="fa fa-book text-primary"></i>
                                                        </Link>
                                                        { this.state.roles.includes('admin') ? 
                                                            <button title="delete" 
                                                                    onClick={() => {
                                                                        this.handleDelete(expense._id)
                                                                    }}
                                                            >   
                                                            {
                                                                this.state.deleteLoading.id === expense._id && this.state.deleteLoading.status ? <i className="fa fa-spin text-danger fa-spinner"></i> : <i className="fa fa-trash text-danger"></i>
                                                            }
                                                            </button> : ''
                                                        }
                                                    </td>
                                                </tr>
                                                )
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center"> No Expense Found </td>
                                            </tr>
                                        )}
                                        
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

export default ViewAllExpenses