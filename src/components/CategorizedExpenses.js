import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, defaults } from 'chart.js';

import { AppProvider } from "../context/AppContext";
import  { useState, useEffect } from 'react'
import { calculateValue, getSessionKey } from '../utils/utils.js'
import { Minimize } from "@material-ui/icons";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategorizedExpenses() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
      async function getChartData() {
        try {
          fetch('https://api.bb.gabefarrell.com/w/budget', {
            method: 'GET',
            headers: {
              'x-session-key' : getSessionKey(),
            }
          })
          .then(response => response.json())
          .then(data => {
            if (data.status != 200) {
              console.log(data.error);
            } else {
              let categories = [];
              let values = [];

              Object.values(data.expenses).map((transactions) => {
                let cost = 0;
                categories.push(transactions[0].category)
                transactions.forEach(transaction => {
                  cost += calculateValue(transaction.amount);
                });
                
                values.push(cost);
              });
              if (categories.length == 0) categories = [`No expenses`];

              const chartData = {
                labels: categories,
                datasets: [{
                  data: values,
                  label: "Category",
                  backgroundColor: [ 
                    '#FFC857',
                    '#ED8146',
                    '#DB3A34',
                    '#5672C7',
                  ],
                  borderColor: [
                    "white"
                  ],
                  borderWidth: 2,
                }],
              }
                          
              setChartData(chartData);
            }
          })
          .catch(error => {
            console.log(error);
          });
        } catch(error) {
          console.error(error);
        }
      }
      getChartData();
    });

    if (!chartData) {
        return <p>Loading...</p>
    }

    return (
        <div className="widget">
            <h4>Expenses by Category</h4>
            <Doughnut className="w-100 h-auto" 
              data={chartData}
              options={{
                plugins: {
                  legend: {
                    position: 'right'
                  }
                },
                responsive: true
              }}
              />
        </div>
    )
}