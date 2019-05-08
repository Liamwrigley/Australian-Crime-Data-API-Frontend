import React, { useState, useEffect } from "react";
//https://www.npmjs.com/package/react-smart-data-table
import SmartDataTable from "react-smart-data-table";
import Dropdown from "./Dropdown";

export default function Main(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offenceQuery, setOffenceQuery] = useState(
    "Advertising%20Prostitution"
  );
  const [areaQuery, setAreaQuery] = useState("");
  const [ageQuery, setAgeQuery] = useState("");
  const [genderQuery, setGenderQuery] = useState("");
  const [yearQuery, setYearQuery] = useState("");
  const [monthQuery, setMonthQuery] = useState("");

  function removeToken(props) {
    localStorage.removeItem("token");
    props.onLogout();
  }

  function getAllData(props) {
    //The parameters of the call
    let getParam = { method: "GET" };
    let head = { Authorization: `Bearer ${props.token}` };
    getParam.headers = head;

    //The URL
    const url = `https://cab230.hackhouse.sh/search?offence=${offenceQuery}&area=${areaQuery}&age=${ageQuery}&gender=${genderQuery}&year=${yearQuery}&month=${monthQuery}`;
    console.log(url);

    return fetch(url, getParam)
      .then(res => {
        if (res.status === 401) {
          removeToken(props);
        } else {
          return res.json();
        }
      })
      .then(res => {
        setData(res.result);
        setLoading(false);
      });
  }

  function Offences(props) {
    const tableData = [];
    for (let i in props.data) {
      tableData.push({ "": props.data[i] });
    }
    return <SmartDataTable data={tableData} name="Offences" sortable />;
  }

  useEffect(() => {
    getAllData(props).catch(e => {
      setError(e);
    });
  }, [offenceQuery, areaQuery, ageQuery, genderQuery, yearQuery, monthQuery]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="main-container">
      <div className="header">
        <div className="RHS-strip" />
        <h1>Crime Data API</h1>
        <button
          onClick={event => {
            removeToken(props);
          }}
        >
          Logout
        </button>
      </div>
      <div className="content-container">
        <div className="btn-nav">
          <Dropdown type={"offences"} onQuerySelect={setOffenceQuery} />
          <Dropdown type={"areas"} onQuerySelect={setAreaQuery} />
          <Dropdown type={"ages"} onQuerySelect={setAgeQuery} />
          <Dropdown type={"genders"} onQuerySelect={setGenderQuery} />
          <Dropdown type={"years"} onQuerySelect={setYearQuery} />
          <Dropdown type={"months"} onQuerySelect={setMonthQuery} />
        </div>
        <div className="data-container">
          <Offences data={data} />
        </div>
      </div>
    </div>
  );
}
