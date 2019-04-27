import React from 'react'

class Home extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillMount(){
        this.props.history.push('login')
    }

    render(){
        return (
            <div></div>
        )
    }
}

export default Home