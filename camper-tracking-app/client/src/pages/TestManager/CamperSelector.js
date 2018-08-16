import React from 'react'
import Select from 'react-select'

const listToOptions = list =>
  list.map(item => ({
    label: item
      .charAt(0)
      .toUpperCase()
      .concat(item.substring(1)),
    value: item.toLowerCase(),
  }))

export default class CamperSelector extends React.Component {
  state = {
    isLoading: false,
    campers: [],
  }

  _fetchCampers = searchValue => {
    if (!this.state.isLoading) {
      this.setState(
        ({ isLoading }) => ({ isLoading: !isLoading }),
        () => {
          let query = `/campers?tests=true`
          if (searchValue) query += `?search=${searchValue}`
          this.fetchCamperData(query).then(({ campers }) => {
            this.setState(({ isLoading }) => ({
              campers,
              isLoading: !isLoading,
            }))
            this.props.setCampers(campers)
          })
        }
      )
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

  _selectCamper = selectedCampers => this.props.onSelectCamper

  componentDidMount() {
    this._fetchCampers()
  }

  _onChange = selectedCampers => {
    this._fetchCampers()
    this.props.onSelectCamper(selectedCampers)
  }

  render() {
    const options = listToOptions(this.state.campers.map(c => c.name))
    return (
      <Select
        className="camperSelector"
        name="camper-selector"
        closeOnSelect={false}
        isLoading={this.state.isLoading}
        value={this.props.selectedCampers}
        options={options}
        onChange={this._onChange}
        multi
      />
    )
  }
}
