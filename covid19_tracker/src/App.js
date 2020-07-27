import React, { useState, useEffect } from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent, TableSortLabel } from "@material-ui/core"
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData } from './utils/util';
import LineGraph from './components/LineGraph';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, settableData] = useState([]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(resonse => resonse.json())
        .then(data => {
          const countries = data.map(country => (
            {
              key: country.countryInfo._id,
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          settableData(sortedData);
          setCountries(countries);
        })
    }
    getCountriesData();
  }, [])


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setcountryInfo(data);
      })
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide'
      ? "https://disease.sh/v3/covid-19/all" :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setcountryInfo(data);
      })
  }

  return (
    /*Bem naming convention*/
    <div className="app">

      <div className="app__left">
        {/*Header */}
        {/*Title + dropdown */}
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide" key='worldwide'>WorldWide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value} key={country.key}>{country.name}</MenuItem>
              )
              )}
            </Select>
          </FormControl>
        </div>

        {/*InfoBox */}
        <div className="app__stats">
          <InfoBox title="Corona Virus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        {/*Map */}
        <Map />
      </div>

      <Card className="app__right">
        <CardContent>
          {/*Table*/}
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          {/*Graph*/}
          <h3>WorldWide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
