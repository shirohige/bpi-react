import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { Container } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import LoadingOverlay from 'react-loading-overlay';
import { Line } from 'react-chartjs-2';
import React, { useState } from 'react';
import API from "./api"

function getFormattedDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

function App() {
  let dateOffset = (24 * 60 * 60 * 1000) * 10; //10 days
  let myDate = new Date();
  myDate.setTime(myDate.getTime() - dateOffset);
  const defaultAppState = {
    dataLoaded: false,
    loading: true,
    fromDate: myDate,
    toDate: new Date(),
    data: {
      dates: [],
      values: []
    },
    errors: []
  }
  const [appState, setAppState] = useState(defaultAppState);


  if (!appState.dataLoaded) {
    API.getData(getFormattedDate(appState.fromDate), getFormattedDate(appState.toDate), (data) => {
      console.log(data);
      setAppState({
        ...appState,
        dataLoaded: true,
        loading: false,
        data: {
          dates: Object.keys(data),
          values: Object.values(data),
        },
        errors: []
      })
    }, (error) => {
      setAppState({
        ...appState,
        dataLoaded: true,
        loading: false,
        errors: error
      });
    })
  }


  let data = {
    labels: appState.data.dates,
    datasets: [
      {
        label: 'Bitcoing Chart',
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: appState.data.values,
      }
    ]
  };

  const lineOptions = {
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
      }],
      yAxes: [{
        // stacked: true,
        gridLines: {
          display: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  };

  return (
    <LoadingOverlay
      width={"100%"}
      height={"100%"}
      active={appState.loading}
      spinner
      text='Loading your content...'
    >
      <Container style={{
        width: '100%',
        height: '100%'
      }}>
        <Grid container spacing={3}>
          <Grid justify="center" container item xs={12}>
            <Grid item xs={4}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  label={"From Date"}
                  value={appState.fromDate}
                  format={"yyyy-MM-dd"}
                  maxDate={appState.toDate}
                  disableFuture={true}
                  onChange={(date) => {
                    setAppState({
                      ...appState,
                      fromDate: date
                    })
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={4}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  label={"To Date"}
                  format={"yyyy-MM-dd"}
                  minDate={appState.fromDate}
                  disableFuture={true}
                  value={appState.toDate}
                  onChange={(date) => {
                    setAppState({
                      ...appState,
                      toDate: date
                    })
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                onClick={() => {
                  setAppState({
                    ...appState,
                    loading: true,
                    dataLoaded: false,
                  })
                }}
              >Render</Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {/* Errors */}
            {appState.errors.map((item) => <p>{item}</p>)}
          </Grid>
          <Grid item xs={12}>
            <Line redraw={false} data={data} options={lineOptions} />
          </Grid>
        </Grid>

      </Container>
    </LoadingOverlay>
  );
}

export default App;
