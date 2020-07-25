import React, { useState, useEffect } from 'react';
import '../App.css';
import {
    FormControl, Select, MenuItem
} from "@material-ui/core"

function Header() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide')

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

                    setCountries(countries)
                })
        }
        getCountriesData();
    }, [])

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        console.log(countryCode);
        setCountry(countryCode);
    }
    return (
        <div className="app__header">
            <h1>COVID19 Tracker</h1>
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
    )
}

export default Header;