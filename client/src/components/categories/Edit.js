import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CategoryForm from './Form'
import Spinner from '../commons/Spinner'

class EditCategory extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            submitLoading: false,
            errors: {
                name: ''
            },
            isLoaded: false,
            category: {}
        }
    }

    componentDidMount(){
        document.title = "Edit Category"
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        axios.get(`/api/admin/categories/${id}`, {
                headers: {
                    'x-auth': token
                }
            })
            .then(res => {
                if(res.data.category){
                    this.setState(() => ({
                        category: res.data.category,
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
        axios.put(`/api/admin/categories/${id}`, formData, {
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
                    this.props.history.push('/admin/categories')
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
                                            <h1>Edit Category</h1>
                                        </div>
                                        <div className="col-6">
                                            <div className="rightBtn">
                                                <Link to="/admin/categories">Go Back</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className="container">
                            <CategoryForm title="Update" 
                                    handleSubmit={this.handleSubmit}
                                    submitLoading={this.state.submitLoading} 
                                    errors={this.state.errors}
                                    category={this.state.category}
                            />
                        </div>
                    </React.Fragment>
                    ) : <div className="text-center mt-5 mb-5"><Spinner /></div> 
                }
            </div>
        )
    }
}

export default EditCategory