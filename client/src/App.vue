<template>
  <div id="app">

    <Loader :message="statusMessage" ></Loader>

    <canvas id="myChart" width="400" height="400">chart here</canvas>

    <div v-for="item in departmentStats" >
      <input type="checkbox" name="filter" :value="item.department"  checked>
      <label> {{ item.department}} </label>
    </div>
    <button v-if="departmentStats" @click="updateFilter()">Update</button>

  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Axios from 'axios';
import Chart from 'chart.js';

// import DepartmentsChart from './components/DepartmentsChart.vue';
import Loader from './components/Loader.vue';

export default {
  name: 'app',
  props: {
      statusMessage: String,
      rawData: Array,
      filtered: Array,
      departmentStats: Array, // { department: "sales", totalEmployees: 10, totalSalary: 10000 }
      statsJSON: String
      },

  components: {
    // DepartmentsChart,
    Loader
  },

  created(){ 
    this.statusMessage = "initializing..."
    this.getData();
  },

  updated(){
    console.log( '=== APP UPDATED===' );
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
            console.log( "axios response ", response.data );
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

        // sort once
        groupedData.sort( ( a, b ) =>
              b.totalSalary/b.totalEmployees - a.totalSalary/a.totalEmployees
            );
        this.departmentStats = groupedData;

    },

    updateFilter(){

        // console.log( '=== update filter' );
        const nodes = document.querySelectorAll( ['input:checked'] );
        const checked = Array.from( nodes ).map( node => node.value );
        this.filtered = this.departmentStats.filter( item => checked.includes( item.department ) );
        console.log( 'filtered stats', JSON.stringify( this.filtered ) );

        this.drawChart();

    },

    drawChart(){           

          var ctx = document.getElementById('myChart');
          var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: this.filtered.map(  item => {
                  return item.department + ' (' + item.totalEmployees + ')';
              } ),
              datasets: [{
                  label: '#average salary',
                  data: this.filtered.map(  item => item.totalSalary/item.totalEmployees ),
                  backgroundColor: [ // fix this
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }
              
              
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
</style>
