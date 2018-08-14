import React from 'react'
import './CamperList.css'
import { FixedSizeList as List } from 'react-window'
import NewCamperForm from './NewCamperForm'

class ItemRenderer extends React.PureComponent {
  render() {
    let camper = this.props.data[this.props.index]
    return (
      <div
        key={camper.id}
        style={this.props.style}
        className={this.props.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
      >
        {camper.name}
        {camper.sac.sort().map(summer => (
          <span className="badge-summer" key={`${camper.id}-${summer}`}>
            {summer}
          </span>
        ))}
        {/*<span className={`rank-badge ${camper.rank.toLowerCase()}`}>
          {camper.rank}
        </span>*/}
      </div>
    )
  }
}

class CamperList extends React.Component {
  state = {
    camperData: [],
    nameSearchValue: '',
  }

  _fetchCampersRequest = null

  handleChange = e => {
    let searchValue = e.target.value
    this.setState(
      { nameSearchValue: searchValue },
      this.fetchCampers(searchValue)
    )
  }

  fetchCampers = searchValue => {
    if (this._fetchCampersRequest === null) {
      let query = '/campers?sac=True'
      if (searchValue) query += `&search=${searchValue}`
      this._fetchCampersRequest = this.fetchCamperData(query).then(res => {
        this._fetchCampersRequest = null
        this.setState({ camperData: res.campers })
      })
    }
  }

  fetchCamperData = async req => {
    try {
      const response = await fetch(req)
      return await response.json()
    } catch (err) {
      console.error(err)
      return []
    }
  }

  componentDidMount() {
    this.fetchCampers()
  }

  componentWillUnmount() {
    if (this._fetchCampersRequest) {
      this._fetchCampersRequest.cancel()
    }
  }

  render() {
    return (
      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={this.state.nameSearchValue}
            onChange={this.handleChange}
          />
        </div>
        <List
          className="list"
          height={250}
          itemCount={this.state.camperData.length}
          itemSize={35}
          width={600}
        >
          {props => <ItemRenderer {...props} data={this.state.camperData} />}
        </List>
        <div className="new-camper-form">
          <NewCamperForm
            updateList={() => this.fetchCampers(this.state.nameSearchValue)}
          />
        </div>
      </div>
    )
  }
}

export default CamperList
