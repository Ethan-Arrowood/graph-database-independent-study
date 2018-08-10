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
    options: [],
    selectedCampers: [],
  }

  _fetchCampers = searchValue => {
    if (!this.state.isLoading) {
      this.setState(
        ({ isLoading }) => ({ isLoading: !isLoading }),
        () => {
          let query = `/campers`
          if (searchValue) query.concat(`?search=${searchValue}`)
          this.fetchCamperData(query).then(res => {
            console.log(res)
            this.setState(({ isLoading }) => ({
              options: listToOptions(res.campers),
              isLoading: !isLoading,
            }))
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

  // _selectCamper = camper =>
  //   this.setState(({ selectedCampers }) => ({
  //     selectedCampers: [...selectedCampers, { name: camper.label }],
  //   }))
  _selectCamper = selectedCampers => this.props.onSelectCamper

  componentDidMount() {
    this._fetchCampers()
  }

  render() {
    return (
      <Select
        name="camper-selector"
        closeOnSelect={false}
        isLoading={this.state.isLoading}
        value={this.props.selectedCampers}
        options={this.state.options}
        onChange={this.props.onSelectCamper}
        multi
      />
    )
  }
}
