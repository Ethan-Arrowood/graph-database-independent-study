import React from 'react'
import { Form, Field } from 'react-final-form'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import neo4j_driver from 'neo4j-driver'
const neo4j = neo4j_driver.v1

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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  values = {
    name: values.name,
    sac: values.sac.split(',').map(s => ({ year: s })),
  }

  const driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'Thor@2013')
  )
  const session = driver.session()

  const query = `
    CREATE (c:Camper {name: $name})
    WITH c
    UNWIND $sac as summer
    MERGE (c)-[:ATTENDED]->(s:Summer {year: summer.year})
    RETURN c, s
  `
  session
    .writeTransaction(tx => tx.run(query, values))
    .then(result => console.log(result.records))
    .catch(err => console.error(err))
    .finally(() => {
      session.close()
      driver.close()
    })
}

class NewCamperForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      sac: [],
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectSummerChange = this.handleSelectSummerChange.bind(this)
  }
  handleChange(event) {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }
  handleSelectSummerChange(value) {
    this.setState({ sac: value })
  }
  render() {
    return (
      <Form
        onSubmit={onSubmit}
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
                name="summers"
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
    )
  }
}

export default NewCamperForm
