import React from 'react'
import axios from 'axios'
import Spinner from '../commons/Spinner'

class ExpenseForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            budget: props.expense ? props.expense.budget : '',
            category: props.expense ? props.expense.category._id : '',
            reason: props.expense ? props.expense.reason : '',
            user: props.expense ? props.expense.user._id : '',
            colleagues: props.expense ? props.expense.colleagues : [],
            isApproved: props.expense ? props.expense.isApproved : false,

            errors: {},
            isLoaded: false,

            users: [],
            availableUsers: [],
            filteredUsers: [],
            searchUserLoaded: false,

            categories: [],
            role: props.role
        }
    }

    componentDidMount(){
        const token = localStorage.getItem('token')
        const self = this
        function getUsers(){
            return axios.get("/api/users/employee",{
                        headers: { 'x-auth': token }
                    })
        }
        function getCategories(){
            return axios.get("/api/admin/categories",{
                        headers: { 'x-auth': token }
                    })
        }            
        axios.all([getUsers(), getCategories()])
            .then(axios.spread(function (users, categories) {
                self.setState((prevState) => ({
                    users: users.data,
                    availableUsers: users.data.map(user => prevState.colleagues.length ? !prevState.colleagues.map(colleague => colleague.user._id).includes(user._id) ? user : {} : user).filter(user => user._id),
                    categories: categories.data,
                    isLoaded: true
                }))
            }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            budget: this.state.budget,
            category: this.state.category,
            reason: this.state.reason,
            user: this.state.user,
            isApproved: this.state.isApproved,
            colleagues: this.props.title === 'Update' ? this.state.colleagues : 
                this.state.colleagues.filter(user => {
                    if(this.state.user !== user.user._id){
                        return { user: user.user._id }
                    }
                })
        }
        this.props.handleSubmit(formData)
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    searchUser = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            searchUserLoaded: value.length ? true : false,
            filteredUsers: prevState.availableUsers.filter(user => user.fullname.toLowerCase().includes(value.toLowerCase()))
        }))
    }

    selectUser = (_id, fullname) => {
        this.setState((prevState) => ({
            searchUserLoaded: false,
            availableUsers: prevState.availableUsers.filter(user => user._id !== _id),
            filteredUsers: prevState.availableUsers.filter(user => user._id !== _id),
            colleagues: prevState.colleagues.concat([{user: {_id, fullname}, amountReceived: 0}])
        }))
    }

    removeSelectedUser = (_id, fullname) => {
        this.setState((prevState) => ({
            availableUsers: prevState.availableUsers.concat({_id, fullname}),
            colleagues: prevState.colleagues.filter(user => user.user._id !== _id)
        }))
    }

    amountReceived = (e) => {
        e.persist()
        this.setState((prevState) => ({
            colleagues: prevState.colleagues.map(colleague => colleague.user._id === e.target.id ? { ...colleague, amountReceived: Number(e.target.value)} : colleague )
        }))
    }

    render(){
        return (
            <div>
                { this.state.isLoaded ? 
                    <form className="form" onSubmit={this.handleSubmit}>
                        <div className="row">
                            { this.state.role === 'admin' ? 
                                <React.Fragment>
                                    <div className="col-md-3">
                                        <label className="label">Employee</label>
                                    </div>
                                    <div className="col-md-4">
                                        <select className="form-control field" 
                                                name="user"
                                                value={this.state.user}
                                                onChange={this.handleChange}
                                        >
                                            <option value="">Choose Employee</option>
                                            { this.state.users.map(user => <option key={ user._id } value={ user._id }>{ user.fullname }</option> )}
                                        </select>
                                    </div>
                                    <div className="col-md-5">
                                        { this.props.errors.user ? <p className="text-danger">{ this.props.errors.user.kind === "ObjectID" ? 'employee is required' : this.props.errors.user.message }</p> : '' }
                                    </div>                                
                                    <div className="col-md-3">
                                        <label className="label">Budget</label>
                                    </div>
                                    <div className="col-md-4">
                                        <input type="text" 
                                            className="form-control field" 
                                            placeholder="Enter Budget" 
                                            name="budget" 
                                            value={this.state.budget} 
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        { this.props.errors.budget ? <p className="text-danger">{ this.props.errors.budget.message}</p> : '' }
                                    </div>
                                    <div className="col-md-3">
                                        <label className="label">Approve</label>
                                    </div>
                                    <div className="col-md-4">
                                        <select className="form-control field" 
                                                name="isApproved"
                                                value={this.state.isApproved}
                                                onChange={this.handleChange}
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                    <div className="col-md-5">
                                        
                                    </div>
                                </React.Fragment> : ''
                            }
                            <div className="col-md-3">
                                <label className="label">Category</label>
                            </div>
                            <div className="col-md-4">
                                <select className="form-control field" 
                                        name="category"
                                        value={this.state.category}
                                        onChange={this.handleChange}
                                >
                                    <option value="">Choose Category</option>
                                    { 
                                        this.state.categories.map(category => <option key={ category._id } value={ category._id }>{ category.name }</option> ) 
                                    }
                                </select>
                            </div>
                            <div className="col-md-5">
                                { this.props.errors.category ? <p className="text-danger">{ this.props.errors.category.kind === "ObjectID" ? 'category is required' : this.props.errors.category.message}</p> : '' }
                            </div>
                            <div className="col-md-3">
                                <label className="label">Reason</label>
                            </div>
                            <div className="col-md-4">
                                <textarea type="text" 
                                    rows="4"
                                    className="form-control field" 
                                    placeholder="Enter Reason" 
                                    name="reason" 
                                    value={this.state.reason} 
                                    onChange={this.handleChange}
                                ></textarea>
                            </div>
                            <div className="col-md-5">
                                { this.props.errors.reason ? <p className="text-danger">{ this.props.errors.reason.message}</p> : '' }
                            </div>
                            <div className="col-md-3">
                                <label className="label">Colleagues</label>
                            </div>
                            <div className="col-md-4">
                                <input type="text" 
                                       className="form-control field" 
                                       placeholder="Choose Colleagues" 
                                       onChange={this.searchUser}
                                />
                                { this.state.searchUserLoaded ? 
                                    <div className="dropDownSearch">
                                        <ul>
                                            { this.state.filteredUsers.length ? 
                                                this.state.filteredUsers.map(user => 
                                                    <li key={user._id} onClick={() => {
                                                        this.selectUser(user._id, user.fullname)
                                                    }}>{user.fullname}</li>
                                                ) : <li>No User Found</li> 
                                            }
                                        </ul>
                                    </div> : ''
                                }                
                                { this.state.colleagues.length ?
                                    <div className="selectedUser">
                                        <ul>
                                            { this.state.colleagues.map((user, index) =>
                                                <li key={index} className={ this.props.title === 'Update' ? 'editCol' : '' } >
                                                    { user.user.fullname }
                                                    <span onClick={() => {
                                                        this.removeSelectedUser(user.user._id, user.user.fullname)
                                                    }}>x</span>
                                                    { this.props.title === 'Update' ? 
                                                        <input className="form-control field" 
                                                               type="text" 
                                                               placeholder="Amount Received"
                                                               onChange={this.amountReceived}
                                                               value={user.amountReceived}
                                                               id={user.user._id}
                                                        /> : '' 
                                                    }
                                                </li>
                                            )}
                                        </ul>
                                    </div> : ''
                                }
                            </div>
                            <div className="col-md-5">
                                
                            </div>
                            <div className="col-md-3">

                            </div>
                            <div className="col-md-4">
                                <button className="btn">
                                    { this.props.submitLoading ? <i className="fa fa-spin fa-spinner"></i> : (`${this.props.title} Expense`)}
                                </button>
                            </div>
                        </div>
                    </form>
                    : <div className="text-center mt-5 mb-5"><Spinner /></div> 
                }
            </div>
        )
    }
}

export default ExpenseForm