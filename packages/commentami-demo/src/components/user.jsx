import React from 'react'

const passwords = {
  filippo: 'filippo',
  paolo: 'paolo',
  davide: 'davide',
  test: 'test'
}

export const UserContext = React.createContext()

class User extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: 'test',
      authorization: `Basic ${Buffer.from(`test:${passwords['test']}`).toString('base64')}`
    }
  }

  selectUser(username) {
    if (!passwords[username]) {
      return
    }

    this.setState({
      selected: username,
      authorization: `Basic ${Buffer.from(`${username}:${passwords[username]}`).toString('base64')}`
    })
  }

  render() {
    return (
      <UserContext.Provider value={{ ...this.state, selectUser: username => this.selectUser(username) }}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default User
