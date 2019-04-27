import React from 'react'

class Home extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillMount() {
        const role = localStorage.getItem('role')
        if(role){
            role === 'admin' ? this.props.history.push("/admin/expenses") : this.props.history.push("/expenses")
        }else{            
            this.props.history.push("/login")
        }
    }

    render(){
        return (
            <div>
                
            </div>
        )
    }
}

export default Home