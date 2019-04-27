import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ExpenseForm from './Form'

class AddExpense extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            submitLoading: false,
            errors: {
                budget: '',
                category: '',
                reason: '',
                user: ''
            },
            roles: JSON.parse(localStorage.getItem('roles'))
        }
    }

	componentWillMount(){
        document.title = "Add Expense"
        !this.state.roles && this.props.history.push('/login')
	}

    handleSubmit = (formData) => {
        this.setState(() => ({
            submitLoading: true
        }))
        const token = localStorage.getItem('token')
        const api = this.state.roles.includes('admin') ? `/api/admin/expenses` : `/api/expenses`
        axios.post(api, formData, {
                headers: { 'x-auth': token }
            })
            .then(res => {
                console.log(res.data)
                if(res.data.errors){
                    this.setState(() => ({
                        errors: res.data.errors,
                        submitLoading: false
                    }))
                }else{
                    this.state.roles.includes('admin') ? this.props.history.push('/admin/expenses') : this.props.history.push('/expenses')
                }
            })
            .catch(err => {
                console.log('error',err)
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
                                <h1>Add Expense</h1>
                            </div>
                            <div className="col-6">
                                <div className="rightBtn">
                                    <Link to={`${route}expenses`}>Go Back</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">                    
                    <ExpenseForm title="Add" 
                            handleSubmit={this.handleSubmit}
                            submitLoading={this.state.submitLoading} 
                            errors={this.state.errors}
                            roles={this.state.roles}
                    />
                </div>
            </div>
        )
    }
}

export default AddExpense