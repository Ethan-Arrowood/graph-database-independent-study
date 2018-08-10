import React from 'react'
import { AutoSizer, ScrollSync, Grid } from 'react-virtualized'
import { Form, Field } from 'react-final-form'
import Select from 'react-select'
import './TestManager.css'
import CamperSelector from './CamperSelector'

const RANKS = ['Loki', 'Tyr', 'Thor', 'Odin']
const DEPARTMENTS = [
  'swimming',
  'boating',
  'campcraft',
  'exploring',
  'sailing',
  'archery',
  'athletics',
  'photography',
  'tennis',
  'riflery',
  'arts',
  'shop',
  'music',
  'biking',
]

const SelectorAdapter = ({ input, ...rest }) => (
  <Select {...input} {...rest} simpleValue />
)

const listToOptions = list =>
  list.map(item => ({
    label: item
      .charAt(0)
      .toUpperCase()
      .concat(item.substring(1)),
    value: item.toLowerCase(),
  }))

const rankOptions = listToOptions(RANKS)
const departmentOptions = listToOptions(DEPARTMENTS)

class TestManager extends React.Component {
  state = {
    selectedCampers: [],
  }

  _camperRowRenderer = ({ columnIndex, key, rowIndex, style }) => (
    <div
      key={key}
      className={`camperRow-${rowIndex % 2 === 0 ? 'even' : 'odd'}`}
      style={style}
    >
      <p>{this.state.selectedCampers[rowIndex].label}</p>
    </div>
  )

  _testRowRenderer = ({ columnIndex, key, rowIndex, style }) => (
    <div
      key={key}
      className={`testColumn-${columnIndex % 2 === 0 ? 'even' : 'odd'}`}
      style={style}
    >
      <div className="testColumn-rotateText">
        <span>{this.props.tests[columnIndex].name}</span>
      </div>
    </div>
  )

  _checkBoxCellRenderer = ({ columnIndex, key, rowIndex, style }) => (
    <div key={key} style={style} className="checkboxCell">
      <input type="checkbox" name={key} />
    </div>
  )

  _submitForm = (values, form) => {
    console.log(values)
  }

  _fetchCampers = searchValue => {
    let query = `/campers`
    if (searchValue) query.concat(`?search=${searchValue}`)
    return this.fetchCamperData(query).then(res => {
      console.log(res)
      return { options: listToOptions(res.campers) }
    })
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

  _selectCamper = camper =>
    this.setState(({ selectedCampers }) => ({
      selectedCampers: [...selectedCampers, { name: camper.label }],
    }))

  _handleSelectCamper = selectedCampers => this.setState({ selectedCampers })

  render() {
    const { tests } = this.props

    const widthLeft = 200
    const heightTop = 180

    const rowCount = this.state.selectedCampers.length
    const columnCount = tests.length

    return (
      <React.Fragment>
        <div className="controls">
          <Form
            onSubmit={this._submitForm}
            render={({ handleSubmit, pristine, submitting }) => (
              <form onSubmit={handleSubmit} className="controls-form">
                <div className="controls-form-field">
                  <Field
                    name="department"
                    component={props =>
                      SelectorAdapter({ ...props, placeholder: 'Department' })
                    }
                    options={departmentOptions}
                  />
                </div>
                <div className="controls-form-field">
                  <Field
                    name="rank"
                    component={props =>
                      SelectorAdapter({ ...props, placeholder: 'Rank' })
                    }
                    options={rankOptions}
                  />
                </div>
                <div className="controls-form-field">
                  <button
                    type="submit"
                    disabled={pristine || submitting}
                    className="controls-submitButton"
                  >
                    Fetch Tests
                  </button>
                </div>
              </form>
            )}
          />
          <CamperSelector
            selectedCampers={this.state.selectedCampers}
            onSelectCamper={this._handleSelectCamper}
          />
        </div>
        <div className="table">
          <AutoSizer>
            {({ height, width }) => (
              <ScrollSync>
                {({ onScroll, scrollLeft, scrollTop }) => (
                  <div
                    className="Table-baseContainer"
                    style={{ height, width }}
                  >
                    <div
                      className="Table-leftContainer"
                      style={{ height, width: widthLeft }}
                    >
                      <div
                        className="Table-topLeftContainer"
                        style={{ height: heightTop, width: widthLeft }}
                      >
                        <Grid
                          cellRenderer={() => null}
                          columnCount={1}
                          columnWidth={widthLeft}
                          height={heightTop}
                          rowCount={1}
                          rowHeight={heightTop}
                          width={widthLeft}
                        />
                      </div>
                      <div
                        className="Table-bottomLeftContainer"
                        style={{ height: height - heightTop, width: widthLeft }}
                      >
                        <Grid
                          cellRenderer={this._camperRowRenderer}
                          columnCount={1}
                          columnWidth={widthLeft}
                          height={height - heightTop}
                          rowCount={rowCount}
                          rowHeight={50}
                          width={widthLeft}
                          scrollTop={scrollTop}
                          onScroll={onScroll}
                        />
                      </div>
                    </div>
                    <div
                      className="Table-rightContainer"
                      style={{ height, width: width - widthLeft }}
                    >
                      <div
                        className="Table-topRightContainer"
                        style={{ height: heightTop, width: width - widthLeft }}
                      >
                        <Grid
                          cellRenderer={this._testRowRenderer}
                          columnCount={columnCount}
                          columnWidth={50}
                          height={heightTop}
                          rowCount={1}
                          rowHeight={heightTop}
                          width={width - widthLeft}
                          scrollLeft={scrollLeft}
                          onScroll={onScroll}
                        />
                      </div>
                      <div
                        className="Table-bottomRightContainer"
                        style={{
                          height: height - heightTop,
                          width: width - widthLeft,
                        }}
                      >
                        <Grid
                          cellRenderer={this._checkBoxCellRenderer}
                          columnCount={columnCount}
                          columnWidth={50}
                          height={height - heightTop}
                          rowCount={rowCount}
                          rowHeight={50}
                          width={width - widthLeft}
                          scrollLeft={scrollLeft}
                          scrollTop={scrollTop}
                          onScroll={onScroll}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </ScrollSync>
            )}
          </AutoSizer>
        </div>
      </React.Fragment>
    )
  }
}

export default TestManager
