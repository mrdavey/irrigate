import React, { Component } from 'react';
import axios from 'axios'

class Stream extends Component {
	constructor(props){
		super(props);
		this.state = {
      newStreamAmount: '',
      donateOnceAmount: '5'
		};
	}

  componentDidMount = () => {
    
  }

  handleChange = ({ target }) => {
    const { name, value } = target
    this.setState({ [name]: value })
  }

  displayUserCauses = (userCauses) => {
    if (!userCauses) return null
    return userCauses.map( (cause, index) => (
      <div className="causeDisplay" key={index}>
        <div className="causeLogoContainer">
          <img className="causeLogo" src={cause.logoName} alt={cause.name} />
        </div>
        <h3>{cause.name}</h3>
        <p>{cause.category}</p>
      </div>
    ))
  }

  setStreamAmount = (event) => {
    event.preventDefault()
    const payload = new FormData()
    const userEmail = sessionStorage.getItem('userEmail')
    const userToken = sessionStorage.getItem('userToken')
    payload.append('email', userEmail)
    payload.append('newStreamAmount', this.state.newStreamAmount)
    // payload.append('newStreamAmount', this.state.setStreamAmount)

    let config = {
      headers: {
        Authorization: 'Bearer ' + userToken
      }
    }

    axios.post("/user/updateStreamAmount", payload, config)
      .then(() => {
        console.log('New stream amount sent to the server')
        this.props.getUserData()
      })
      .catch(() => {
        console.log('Internal server error')
      })
  }

  donateOnce = async (event) => {
    event.preventDefault()
    const { irrigateAddress, accounts, mockDaiContract } = this.props
    let userBalance = await mockDaiContract.methods.balanceOf(accounts[0]).call()
    console.log(userBalance)
    if (userBalance >= this.state.donateOnceAmount) {
      await mockDaiContract.methods.transfer(irrigateAddress, this.state.donateOnceAmount).send({from: accounts[0]})
      //inform server that user X have sent amount Y to causes 1, 2 , 3 ...
      const payload = new FormData()
      const userEmail = sessionStorage.getItem('userEmail')
      const userToken = sessionStorage.getItem('userToken')
      payload.append('email', userEmail)
      payload.append('gavedAmount', this.state.donateOnceAmount)

      let config = {
        headers: {
          Authorization: 'Bearer ' + userToken
        }
      }

      // axios.post("/donations/donateOnce", payload, config)
      //   .then(() => {
      //     console.log('Donation sent')
      //     // this.props.getUserData()
      //   })
      //   .catch(() => {
      //     console.log('Internal server error')
      //   })
    } else alert("Unsufficient DAI balance")
  }

	render() {

    console.log(this.state)
		
    let Stream = (
      <div className="Stream">
        <div className="StreamTitle_Close">
          <p className="StreamTitle">Your current stream:</p>
          <button className="closeFormAddCauseButton" onClick={this.props.closeStream}>x</button>
        </div>
        <div>Your supported causes:</div>
        <div className="userCausesContainer">
          {this.displayUserCauses(this.props.userCauses)}
        </div>

        <div className="donateOnceContainer">
          <form className="donateOnceForm" onSubmit={this.donateOnce} >
            <label>Donation value: </label>
            <div className="form-input">
              <input 
                name="donateOnceAmount" 
                type="number" 
                min="5"
                step="5"
                placeholder="5"
                onChange={this.handleChange} 
              /> DAI
            </div>
            <button className="FormAddCauseButton">Donate once</button>
          </form>
        </div>

        <div>
          <p className="">Your current stream: {this.props.currentStreamAmount} DAI / month</p>
          <form className="setStreamForm" onSubmit={this.setStreamAmount} >
            <label>Set monthly donation to: </label>
            <div className="form-input">
              <input 
                name="newStreamAmount" 
                type="number" 
                min="0"
                step="5"
                placeholder="5"
                onChange={this.handleChange} 
              /> DAI
            </div>
            <button className="FormAddCauseButton">Set amount</button>
          </form>
        </div>
      </div>
		)

    if (! this.props.displayStream) {
      Stream = null;
    }

    return (
      <div>
        {Stream}
      </div>
    )
	}
}

export default Stream;