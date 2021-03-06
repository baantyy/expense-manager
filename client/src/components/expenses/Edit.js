import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ExpenseForm from './Form'
import EmployeeForm from './EmployeeForm'
import Spinner from '../commons/Spinner'

class EditExpense extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            submitLoading: false,
            errors: {},
            isLoaded: false,
            expense: {},
            roles: JSON.parse(localStorage.getItem('roles'))
        }
    }

    componentWillMount(){
        document.title = "Edit Expense"
        !this.state.roles && this.props.history.push('/login')
	}

    componentDidMount(){
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        const api = this.state.roles.includes('admin') ? `/api/admin/expenses/${id}` : `/api/expenses/${id}`
        axios.get(api, { headers: { 'x-auth': token }})
            .then(res => {
                this.setState(() => ({
                    expense: res.data,
                    isLoaded: true
                }))
            })
    }

    handleSubmit = (formData) => {
        this.setState(() => ({
            submitLoading: true
        }))
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        const api = this.state.roles.includes('admin') ? `/api/admin/expenses/${id}` : `/api/expenses/${id}`
        axios.put(api, formData, {
                headers: { 'x-auth': token }
            })
            .then(res => {
                if(res.data.errors){
                    this.setState(() => ({
                        submitLoading: false,
                        errors: res.data.errors
                    }))
                }else{
                    this.state.roles.includes('admin') ? this.props.history.push(`/admin/expenses/view/${id}`) : this.props.history.push(`/expenses/view/${id}`)
                }
            })
    }

    render(){
        const route = this.state.roles.includes('admin') ? '/admin/' : '/'
        return (
            <div className="expenses">
                <div className="headTitle">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <h1>Edit Expense</h1>
                            </div>
                            <div className="col-6">
                                <div className="rightBtn">
                                    <Link to={`${route}expenses`}>Go Back</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                { this.state.isLoaded ? 
                    <div className="container">
                        { this.state.roles.includes('admin') ?
                            <ExpenseForm title="Update" 
                                    handleSubmit={this.handleSubmit}
                                    submitLoading={this.state.submitLoading} 
                                    errors={this.state.errors}
                                    expense={this.state.expense}
                                    roles={this.state.roles}
                            /> : 
                            <EmployeeForm handleSubmit={this.handleSubmit}
                                    submitLoading={this.state.submitLoading} 
                                    errors={this.state.errors}
                                    expense={this.state.expense}
                            />
                        }
                    </div> : <div className="text-center mt-5 mb-5"><Spinner /></div> 
                }
            </div>
        )
    }
}

export default EditExpense