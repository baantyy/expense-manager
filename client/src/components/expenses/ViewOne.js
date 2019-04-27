import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Spinner from '../commons/Spinner'

class OneExpense extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isLoaded: false,
            expense: {},
            roles: JSON.parse(localStorage.getItem('roles'))
        }
    }

	componentWillMount(){
        document.title = "View Expense"
		!this.state.roles && this.props.history.push('/login')
	}

    componentDidMount(){
        const token = localStorage.getItem('token')
        const id = this.props.match.params.id
        const api = this.state.roles.includes('admin') ? `/api/admin/expenses/${id}` : `/api/expenses/${id}`
        axios.get(api,{ headers: { 'x-auth': token }})
            .then(res => {
                this.setState(() => ({
                    isLoaded: true,
                    expense: res.data
                }))
            })
    }

    render(){
        const id = this.props.match.params.id
        const { budget, createdAt, user, category, reason, isApproved, colleagues } = this.state.expense
        let amountSpent = 0
        const route = this.state.roles.includes('admin') ? '/admin/' : '/'
        if(this.state.isLoaded){
            this.state.expense.colleagues.forEach(colleague => {
                amountSpent = amountSpent + colleague.amountSpent
            })
        }
        return (
            <div className="expenses">
                <div className="headTitle">
                    <div className="container">
                        <div className="row">
                            <div className="col-5">
                                <h1>View Expense</h1>
                            </div>
                            <div className="col-7">
                                <div className="rightBtn">
                                    <Link to={`${route}expenses`}>Go Back</Link>
                                    <Link to={`${route}expenses/edit/${id}`}>Edit</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    { this.state.isLoaded ?
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="expenseView">
                                    <ul>
                                        <li><b>Employee</b> : { user.fullname }</li>
                                        <li><b>Date</b> : { createdAt }</li>
                                        <li><b>Budget</b> : { budget }</li>
                                        <li><b>Spent</b> : { amountSpent }</li>
                                        <li><b>Category</b> : { category.name }</li>
                                        <li><b>Reason</b> : { reason }</li>
                                        <li><b>Status</b> : { isApproved ? <span className="text-success">Approved</span> : <span className="text-danger">Not Approved</span> }</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tableCover">
                                    <table className="table table-bordered table-hover mt-0">
                                        <thead>
                                            <tr>
                                                <th>Sl.No.</th>
                                                <th>Employee</th>
                                                <th>Amount Spent</th>
                                                <th>Amount Received</th>
                                                <th>Receipt</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { colleagues.map((colleague, index) => 
                                                <tr key={index}>
                                                    <td>{ index + 1 }</td>
                                                    <td>{ colleague.user.fullname }</td>
                                                    <td>{ colleague.amountSpent }</td>
                                                    <td>{ colleague.amountReceived }</td>
                                                    <td>{ colleague.receipt !== 'null' ? <a href={`/uploads/${colleague.receipt}`} target="_blank" rel="noopener noreferrer" ><i className="fa fa-download"></i></a> : '' }</td>
                                                    {/* http://localhost:3005 */}
                                                </tr>
                                            ) }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> : <div className="text-center mt-5 mb-5"><Spinner /></div> }
                </div>
            </div>
        )
    }
}

export default OneExpense