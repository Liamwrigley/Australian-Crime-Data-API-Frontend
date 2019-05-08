import React, { useState, useEffect } from "react";

export default function Dropdown(props) {
  const [dropdownData, setDropdownData] = useState([]);
  const [loading, setLoading] = useState(true);

  function getDropdownData(props) {
    if (props.type !== "months") {
      return fetch(`https://cab230.hackhouse.sh/${props.type}`)
        .then(res => res.json())
        .then(res => {
          setDropdownData(Object.values(res)[0]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("getting new data");
    getDropdownData(props);
  }, [props.type]);

  if (loading) {
    return "Loading...";
  }

  if (props.type !== "months") {
    let items = dropdownData;
    let optionItems = items.map(items => <option key={items}>{items}</option>);
    return (
      <div>
        <select
          onChange={event => {
            props.onQuerySelect(encodeURIComponent(event.target.value));
          }}
        >
          {optionItems}
        </select>
      </div>
    );
  } else if (props.type === "months") {
    let items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let optionItems = items.map(items => <option key={items}>{items}</option>);
    return (
      <div>
        <select
          onChange={event => {
            props.onQuerySelect(encodeURIComponent(event.target.value));
          }}
        >
          {optionItems}
        </select>
      </div>
    );
  }
}
