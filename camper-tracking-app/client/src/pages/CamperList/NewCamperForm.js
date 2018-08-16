import React from 'react'
import { Form, Field } from 'react-final-form'
import Select from 'react-select'

const summerOptions = [
  { label: 2000, value: 2000 },
  { label: 2001, value: 2001 },
  { label: 2002, value: 2002 },
  { label: 2003, value: 2003 },
  { label: 2004, value: 2004 },
  { label: 2005, value: 2005 },
  { label: 2006, value: 2006 },
  { label: 2007, value: 2007 },
  { label: 2008, value: 2008 },
  { label: 2009, value: 2009 },
  { label: 2010, value: 2010 },
  { label: 2011, value: 2011 },
  { label: 2012, value: 2012 },
  { label: 2013, value: 2013 },
  { label: 2014, value: 2014 },
  { label: 2015, value: 2015 },
  { label: 2016, value: 2016 },
  { label: 2017, value: 2017 },
  { label: 2018, value: 2018 },
]

const SummerSelectorAdapter = ({ input, ...rest }) => (
  <Select
    {...input}
    {...rest}
    closeOnSelect={false}
    multi
    placeholder="Summers at camp"
    removeSelected={true}
    simpleValue
  />
)

class NewCamperForm extends React.Component {
  state = {
    name: '',
    sac: [],
    formSuccess: null,
    createCamperResult: null,
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  onSubmit = (values, form) => {
    const createCamperRequest = new Request('/campers', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        // sac: !values.sac ? [] : values.sac.split(',').map(s => ({ year: s })),
        sac: !values.sac ? [] : values.sac.split(','),
      }),
    })

    fetch(createCamperRequest)
      .then(res => res.json())
      .then(res => {
        this.setState(
          {
            formSuccess: `Created camper: ${res.name}`,
            createCamperResult: res,
          },
          () => {
            form.reset()
            this.props.updateList()
          }
        )
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <React.Fragment>
        <p>New Camper {this.state.formSuccess || null}</p>
        <Form
          onSubmit={this.onSubmit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <Field
                  name="name"
                  component="input"
                  type="text"
                  placeholder="Name"
                  className="nameInput"
                />
              </div>
              <div>
                <Field
                  name="sac"
                  component={SummerSelectorAdapter}
                  options={summerOptions}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="submitButton"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        />
      </React.Fragment>
    )
  }
}

export default NewCamperForm
