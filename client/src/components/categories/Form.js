import React from 'react'

class CategoryForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name: props.category ? props.category.name : '',
            errors: {}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            name: this.state.name
        }
        this.props.handleSubmit(formData)
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    render(){
        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-3">
                            <label className="label">Category</label>
                        </div>
                        <div className="col-md-4">
                            <input type="text" 
                                   className="form-control field" 
                                   placeholder="Enter Category" 
                                   name="name" 
                                   value={this.state.name} 
                                   onChange={this.handleChange}
                            />
                        </div>
                        <div className="col-md-5">
                            { this.props.errors.name ? <p className="text-danger">{ this.props.errors.name.message}</p> : '' }
                        </div>
                        <div className="col-md-3">

                        </div>
                        <div className="col-md-4">
                            <button className="btn">
                                { this.props.submitLoading ? <i className="fa fa-spin fa-spinner"></i> : (`${this.props.title} Category`)}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default CategoryForm