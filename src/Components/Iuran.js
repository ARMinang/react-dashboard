import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'
import { Container, Grid, Card } from 'semantic-ui-react'
import axios from 'axios'
import moment from 'moment'
import localization from 'moment/locale/id'

class TotalIuran extends Component {
  constructor() {
    super()
    this.state = {
      chartData: {},
      chartOptions: {},
      iuran: 0,
      lastMonth: '',
      lastIuran: 0
    }
  }

  componentWillMount(){
    this.getChartData()
  }

  getChartData(){
    axios.get('http://127.0.0.1:8000/api/iuran/')
      .then(res => {
        const allIurans = res.data
        const iuran = allIurans.map(allIuran => allIuran.jml_bayar)
        const bulan = allIurans.map(allIuran => moment(allIuran.month).locale('id', localization).format('MMMM'))
        const add = (a, b) => a + b
        const total_iuran = iuran.reduce(add)
        const lastMonth = bulan[bulan.length - 1]
        const lastIuran = iuran[iuran.length - 1]
        console.log(total_iuran)
        this.setState({
          chartData: {
            labels: bulan,
            datasets: [
              {
                label: 'Penerimaan Iuran',
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: [
	                'rgba(255, 99, 132, 0.4)',
	                'rgba(54, 162, 235, 0.4)',
	                'rgba(255, 206, 86, 0.4)',
	                'rgba(75, 192, 192, 0.4)',
	                'rgba(153, 102, 255, 0.4)',
	                'rgba(255, 159, 64, 0.4)'
           		  ],
                borderWidth: 1,
                data: iuran
              }
            ]
          },
          chartOptions: {
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero:true,
                  callback: function(value, index, values) {
                    return value.toLocaleString('en');
                  },
                }
              }]
            }
          },
          iuran: total_iuran.toLocaleString('id'),
          lastMonth,
          lastIuran
        })
      })

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
                  <Card.Description style={{fontSize: '2em'}}>{this.state.iuran}</Card.Description>
                </Card.Content>
              </Card>
              <Card raised>
                <Card.Content>
                  <Card.Header>Iuran {this.state.lastMonth}</Card.Header>
                  <Card.Description style={{fontSize: '2em'}}>{this.state.lastIuran.toLocaleString('id')}</Card.Description>
              </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <div>
                <Bar
                  data={this.state.chartData}
                  width={100}
                  height={50}
                  options={this.state.chartOptions}/>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

export default TotalIuran