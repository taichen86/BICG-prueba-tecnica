<template>
  <div id="app">

    <Loader :message="statusMessage" ></Loader>

    <div>
      <div v-for="item in departmentStats" >
        <label> {{ item.department}} </label>
        <input type="checkbox" name="filter" :value="item.department"  checked>
      </div>
    </div>
    <button v-if="departmentStats" @click="updateFilter()">Update</button>

    <canvas id="salaryChart" width="400" height="400"></canvas>
    <canvas id="employeeChart" width="400" height="400"></canvas>

    <!-- <BarGraph :json="graphJSON" :test="statusMessage"></BarGraph> -->
 

  </div>
</template>

<script>

import Axios from 'axios';
import Chart from 'chart.js';

import Loader from './components/Loader.vue';
import BarGraph from './components/BarGraph'

export default {
  name: 'app',
  props: {
      statusMessage: String,
      rawData: Array,
      filtered: Array,
      departmentStats: Array, // { department: "sales", totalEmployees: 10, totalSalary: 10000 }
      colors: Array
  },

  components: {
    Loader,
    BarGraph
  },

  created(){ 
    this.statusMessage = "initializing..."
    this.getData();
    this.initializeProps();
  },

  updated(){
    this.updateFilter();  
  },


  methods: {

    getData(){

    //  const backendURL = "https://api.myjson.com/bins/1cjnd5";
      const backendURL = "http://localhost:8000/";
      const headers = {
        'Content-Type': 'application/json',
      };

      this.statusMessage = "getting data..."
      Axios.get( backendURL , { headers } )
          .then( response => {
            this.statusMessage = "";
            // console.log( "axios response ", response.data );
            this.rawData = response.data;
            this.createDepartmentStats();
          })
          .catch( error => {
            this.statusMessage = String( error );
            console.error( 'error--> ',  error );  
          }
        );

    },

    createDepartmentStats(){

        let groupedData = [];
        this.rawData.forEach( empleado => {
            let existing = groupedData.find( item => item.department == empleado.Departamento );
            if( existing ){
              existing.totalEmployees++;
              existing.totalSalary += Number( empleado.Sueldo );
            }else{
              let obj = { department: empleado.Departamento, totalEmployees: 1, totalSalary: Number( empleado.Sueldo ) };
              groupedData.push( obj );
            }
        } );

        this.departmentStats = groupedData;

    },

    updateFilter(){

        const nodes = document.querySelectorAll( ['input:checked'] );
        const checked = Array.from( nodes ).map( node => node.value );
        this.filtered = this.departmentStats.filter( item => checked.includes( item.department ) );
        // console.log( 'filtered stats', JSON.stringify( this.filtered ) );

        this.drawSalaryChart();
        this.drawEmployeesChart();

    },

    // TODO: put in component
    drawSalaryChart(){           

          // sort
          let sorted = this.filtered.sort( ( a, b ) => b.totalSalary/b.totalEmployees - a.totalSalary/a.totalEmployees );

          var ctx = document.getElementById( 'salaryChart' );
          var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: this.filtered.map(  item => {
                  return item.department + ' (' + item.totalEmployees + ')';
              } ),
              datasets: [               
                {
                  label: '#AVERAGE SALARY €',
                  data: this.filtered.map(  item => item.totalSalary/item.totalEmployees ),
                  backgroundColor: this.getColors( sorted.length, 0.2 ),
                  borderColor: this.getColors( sorted.length, 1 ),
                  borderWidth: 1
              },

              ]
          },
          options: {
              tooltips: {
                  callbacks: {
                    label: function( tooltipItem, data ){
                      // console.log( data );
                      return '#average salary: ' + Math.round( tooltipItem.yLabel * 100 ) / 100;
                    } 
                  }
              },

              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }

      });
      },


    drawEmployeesChart(){           

      // sort
      let sorted = this.filtered.sort( ( a, b ) => b.totalEmployees - a.totalEmployees );

      var ctx = document.getElementById( 'employeeChart' );
      var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: this.filtered.map(  item => {
              return item.department;
          } ),
          datasets: [               
            {
              label: '#NUMBER OF EMPLOYEES',
              data: this.filtered.map(  item => item.totalEmployees ),
              backgroundColor: this.getColors( sorted.length, 0.2 ),
              borderColor: this.getColors( sorted.length, 1 ),
              borderWidth: 1
          },

          ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }

      });
    },

    getColors( num , alpha ){
        let colors = [];
        let i = 0;
        while( i < num ){
          colors.push( this.colors[ i%this.colors.length ].replace( '0.2', alpha ) );  
          i++;
        }
        return colors;
      },

      initializeProps(){
        this.colors = [ 'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)' ];
      }


  }
  

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#salaryChart{
  margin-top: 60px;
}

</style>
