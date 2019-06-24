import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'
import { Container, Grid } from 'semantic-ui-react'

class TotalIuran extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.reference = {}
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps.chartData)
    let barChart = this.reference.chartInstance
    barChart.update()
  }

  render() {
    return(
      <Container style={{ marginTop: '7em' }}>
        <Grid centered verticalAlign='middle' style={{ height: '100%' }}>
          <Grid.Row>
            <Grid.Column>
              <div>
                <Bar
                  data={this.props.chartData}
                  width={100}
                  height={50}
                  options={this.props.stackedChartOptions}
                  ref = {(reference) => this.reference = reference}/>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

export default TotalIuran