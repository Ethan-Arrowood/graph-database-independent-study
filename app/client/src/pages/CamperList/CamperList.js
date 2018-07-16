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

class CamperList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      campers: [
        {
          name: 'Ethan Arrowood',
          rank: 'Thor',
          summers: [2008, 2009, 2010, 2011, 2012, 2013],
        },
        {
          name: 'Alex Arrowood',
          rank: 'Loki',
          summers: [2010, 2011, 2012, 2013, 2014, 2015, 2016],
        },
        {
          name: 'Sara Liptrot',
          rank: 'Odin',
          summers: [2013, 2015, 2016, 2017, 2018],
        },
        {
          name: 'Andy Mortimer',
          rank: '',
          summers: [2013, 2014, 2015, 2016, 2017],
        },
        {
          name: 'JD Kennedy',
          rank: 'Loki',
          summers: [2013, 2014, 2015, 2016, 2017],
        },
        {
          name: 'Blake Himes',
          rank: 'Tyr',
          summers: [2013, 2014, 2015, 2016, 2017],
        },
        {
          name: 'Bryan Partridge',
          rank: 'Tyr',
          summers: [2013, 2014, 2015, 2016, 2017],
        },
        {
          name: 'Jeremy Cutler',
          rank: 'Thor',
          summers: [2013, 2014, 2015, 2016, 2017],
        },
        {
          name: 'Tommy Reynolds',
          rank: '',
          summers: [2013, 2014, 2015, 2016, 2017],
        },
      ],
      listData: [],
      nameSearchValue: '',
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    let searchValue = e.target.value
    this.setState({
      nameSearchValue: searchValue,
      listData: this.state.campers.filter(camper =>
        camper.name.match(new RegExp(searchValue, 'i'))
      ),
    })
  }

  componentDidMount() {
    this.setState({ listData: this.state.campers })
  }

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
        <List
          className="list"
          height={250}
          itemCount={this.state.listData.length}
          itemSize={35}
          width={600}
        >
          {props => <ItemRenderer {...props} data={this.state.listData} />}
        </List>
        <div className="new-camper-form">
          <NewCamperForm />
        </div>
      </div>
    )
  }
}

export default CamperList
