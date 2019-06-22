import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'
import { Container, Grid, Card } from 'semantic-ui-react'

class TotalIuran extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.reference = {}
  }

  componentWillReceiveProps(newProps) {
    let barChart = this.reference.chartInstance
    barChart.update()
  }

  render() {
    return(
      <Container style={{ marginTop: '7em' }}>
        <Grid centered verticalAlign='middle' style={{ height: '100%' }}>
          <Grid.Row>
            <Card.Group>
              <Card raised>
                <Card.Content>
                  <Card.Header>Total Iuran</Card.Header>
                  <Card.Description style={{fontSize: '2em'}}>{this.props.total_iuran ? this.props.total_iuran.toLocaleString('id'): 0}</Card.Description>
                </Card.Content>
              </Card>
              <Card raised>
                <Card.Content>
                  <Card.Header>Iuran {this.props.lastMonth}</Card.Header>
                  <Card.Description style={{fontSize: '2em'}}>{this.props.lastIuran ? this.props.lastIuran.toLocaleString('id'): 0}</Card.Description>
              </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <div>
                <Bar
                  data={this.props.chartData}
                  width={100}
                  height={50}
                  options={this.props.chartOptions}
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