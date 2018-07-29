import React from 'react'
import './CamperList.css'
import { FixedSizeList as List } from 'react-window'
import NewCamperForm from './NewCamperForm'

class ItemRenderer extends React.PureComponent {
  render() {
    let camper = this.props.data[this.props.index]
    return (
      <div
        style={this.props.style}
        className={this.props.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
      >
        {camper.name}
        <span className={`rank-badge ${camper.rank.toLowerCase()}`}>
          {camper.rank}
        </span>
      </div>
    )
  }
}

const fetchCamperData = async () => {
  try {
    const response = await fetch('/campers')
    return response
  } catch (err) {
    console.error(err)
    return []
  }
}

class CamperList extends React.Component {
  state = {
    camperData: null,
    listData: [],
    nameSearchValue: '',
  }

  handleChange = e => {
    let searchValue = e.target.value
    this.setState({
      nameSearchValue: searchValue,
      listData: this.state.campers.filter(camper =>
        camper.name.match(new RegExp(searchValue, 'i'))
      ),
    })
  }

  componentDidMount() {
    this._fetchCampersRequest = fetchCamperData().then(camperData => {
      this._fetchCampersRequest = null
      this.setState({ camperData })
    })

    this.setState({ listData: this.state.campers })
  }

  // componentWillUnmount() {
  //   if (this._fetchCampersRequest) {
  //     this._fetchCampersRequest.cancel()
  //   }
  // }

  render() {
    return (
      <div className="container">
        <div className="controls" />
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={this.state.nameSearchValue}
            onChange={this.handleChange}
          />
        </div>
        {this._fetchCampersRequest === null ? (
          <List
            className="list"
            height={250}
            itemCount={this.state.camperData.length}
            itemSize={35}
            width={600}
          >
            {props => <ItemRenderer {...props} data={this.state.camperData} />}
          </List>
        ) : null}
        <div className="new-camper-form">
          <NewCamperForm />
        </div>
      </div>
    )
  }
}

export default CamperList
