import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'
import { Container, Grid, Card } from 'semantic-ui-react'
import axios from 'axios'
import moment from 'moment'
import localization from 'moment/locale/id'

class TenagaKerja extends Component {
  constructor() {
    super()
    this.state = {
      chartData: {},
      chartOptions: {},
      totalTk: 0,
      lastMonth: '',
      lastTk: 0
    }
  }

  componentWillMount(){
    this.getChartData()
  }

  getChartData(){
    axios.get('http://pekanbarukota.zapto.org:8000/api/tk/')
      .then(res => {
        const allTks = res.data
        const jumlah = allTks.map(allTk => allTk.jml_tk)
        const bulan = allTks.map(allTk => moment(allTk.month).locale('id', localization).format('MMMM'))
        const add = (a, b) => a + b
        const totalTk = jumlah.reduce(add)
        const lastMonth = bulan[bulan.length - 1]
        const lastTk = jumlah[jumlah.length - 1]
        this.setState({
          chartData: {
            labels: bulan,
            datasets: [
              {
                label: 'Penambahan Tenaga Kerja',
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
                data: jumlah
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
          totalTk: totalTk.toLocaleString('id'),
          lastMonth,
          lastTk
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
                  <Card.Header>Total Penambahan TK</Card.Header>
                  <Card.Description style={{fontSize: '2em'}}>{this.state.totalTk}</Card.Description>
                </Card.Content>
              </Card>
              <Card raised>
                <Card.Content>
                  <Card.Header>Penambahan {this.state.lastMonth}</Card.Header>
                  <Card.Description style={{fontSize: '2em'}}>{this.state.lastTk.toLocaleString('id')}</Card.Description>
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

export default TenagaKerja