import React from 'react'
import axios from 'axios'

class EmployeeForm extends React.Component{
    constructor(props){
        super(props)
        const expense = props.expense.colleagues.find(colleague => colleague.user._id === localStorage.getItem('id'))
        this.state = {
            amountSpent: expense.amountSpent,
            receipt: expense.receipt,
            receiptImg: expense.receipt,
            currentExpense: {},
            error: '',
            submitLoading: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const id = localStorage.getItem('id')
        const token = localStorage.getItem('token')

        this.setState(() => ({
            submitLoading: true
        }))

        axios.get(`/api/expenses/${this.props.expense._id}`,{ headers: { 'x-auth': token }})
            .then(res => {
                
                const colleagues = res.data.colleagues
                var totalSpent = 0

                for(let i = 0; i < colleagues.length; i++){
                    if(String(colleagues[i].user._id) !== String(id)){
                        totalSpent = totalSpent + colleagues[i].amountSpent
                    }else{
                        totalSpent = totalSpent + Number(this.state.amountSpent)
                    }
                }

                if(this.props.expense.budget === 0 || this.props.expense.budget >= totalSpent){
                    const formData = new FormData()
                    formData.append('receipt', this.state.receipt ? this.state.receipt : this.state.receiptImg)
                    formData.append('amountSpent', this.state.amountSpent)
                    this.props.handleSubmit(formData)
                }else{
                    this.setState(() => ({
                        error: `total spent can't exceed ${this.props.expense.budget}`,
                        submitLoading: false
                    }))
                }
            })
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    handleFileChange = (e) => {
        e.persist()
        this.setState(() => ({
            receipt: e.target.files[0]
        }))
    }

    render(){
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <div className="row">                                                         
                    <div className="col-md-3">
                        <label className="label">Amount Spent</label>
                    </div>
                    <div className="col-md-4">
                        <input type="text" 
                            className="form-control field" 
                            placeholder="Enter Amount Spent" 
                            name="amountSpent" 
                            value={this.state.amountSpent} 
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="col-md-5">
                        { this.state.error !== '' && <p className="text-danger">{ this.state.error }</p> }
                        { console.log(this.state.error) }
                    </div>
                    <div className="col-md-3">
                        <label className="label">Receipt</label>
                    </div>
                    <div className="col-md-4">
                        <input type="file" 
                               className="form-control field"
                               name="receipt" 
                               onChange={this.handleFileChange}
                        />
                        <div className="receiptImg">
                            { this.state.receiptImg !== 'null' ? <img src={`/uploads/${this.state.receiptImg}`} alt={`${this.state.receiptImg}`} /> : '' }
                        </div>
                    </div>
                    <div className="col-md-5">
                        
                    </div>
                    <div className="col-md-3">

                    </div>
                    <div className="col-md-4">
                        <button className="btn">
                            { this.props.submitLoading || this.state.submitLoading ? <i className="fa fa-spin fa-spinner"></i> : 'Update Expense' }
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

export default EmployeeForm