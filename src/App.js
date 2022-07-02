import React, {useState, useEffect, } from 'react';
import {MenuItem, FormControl, Select, Card, CardContent, } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import './App.css';
import 'leaflet/dist/leaflet.css';
import DonarInfo from './DonarInfo';
import SearchDonar from './SearchDonar';

function App() {
 const [countries, setCountries] = useState([]);
 const [country, setCountry] = useState("worldwide");
 const [countryInfo, setCountryInfo] = useState({});
 const [tableData, setTableData] = useState([]);
 const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
 const [mapZoom, setMapZoom] = useState(3);
 const [mapCountries, setMapCountries] = useState([]);
 const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(reponse => reponse.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  //USEEFFECT = Runs a piece of code based on given condition
  useEffect( () => {
    //async --> send a request , wait for it, do something with info
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, //United States, United Kingdom
            value: country.countryInfo.iso2 // UK, USA, FR
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url = 
      countryCode === "worldwide" 
        ? "https://disease.sh/v3/covid-19/all" 
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then((reponse) => reponse.json())
    .then((data) => {
      setCountry(countryCode);
      // All of the data from the contry response
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }; 

  
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select 
            variant="outlined" 
            value={country} 
            onChange={onCountryChange}
          >
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {
            countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))
          }

          </Select>
        </FormControl> 
        </div>
        
        <div className="app__stats">
          <InfoBox 
            isRed
            active={casesType === "cases"}
            onClick={ e => setCasesType('cases')}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
          />
          <InfoBox 
            active={casesType === "recovered"}
            onClick={ e => setCasesType('recovered')}
            title="Recovered Cases" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />
          <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick={ e => setCasesType('deaths')}
            title="Deaths Cases" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
          />
        </div>

        <Map
          casesType = { casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
         />

      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <br />
          <h3>Worldwide new {casesType}</h3>
          <br />
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>

      {/* <DonarInfo className="app__donarinfo" /> */}
    </div>
  );
}

export default App;

















// https://console.firebase.google.com/u/0/project/covid-19-tracker-49b1b/overview