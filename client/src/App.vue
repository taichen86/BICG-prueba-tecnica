<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <div v-if="this.statsJSON!=undefined">
        <DepartmentsChart json="test string">
    </div>
    <div v-else>
      processing data...
    </div> -->
    <!-- <DepartmentsChart json="test json string"></DepartmentsChart> -->
        <canvas id="myChart" width="400" height="400">chart here</canvas>
        
          <div v-for="item in departmentStats" >
            <input type="checkbox" name="filter" :value="item.department" @click="drawChart()" checked>
            <label> {{ item.department}} </label>
          </div>
          <span>checkedDepartments: </span>

  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Axios from 'axios';
import Chart from 'chart.js';

import DepartmentsChart from './components/DepartmentsChart'

export default {
  name: 'app',
  props: {
      rawData: [],
      departmentStats: [], // { department: "sales", totalEmployees: 10, totalSalary: 10000 }
      statsJSON: String

      },

  components: {
    DepartmentsChart
  },

  created(){
    console.log( 'app created...' );
    this.getEmpleadosData();
  },



  methods: {

    check( event ){
      console.log( 'filter checked ', event.target );
    },

    getEmpleadosData(){

      const backendURL = "https://api.myjson.com/bins/1cjnd5";
      const headers = {
        'Content-Type': 'application/json',
      };
      // show loader
        Axios.get( backendURL , { headers} )
        .then( response =>  
        {
          console.log( "axios response ", response.data );
          this.rawData = response.data;
          this.createDepartmentStats();
          this.drawChart();

        })
        .catch( e => // show error
        console.error( e ) );


    },

    createDepartmentStats(){

        let groupedData = [];
        this.rawData.forEach( empleado => {
          // console.log ( 'doing ', empleado );
          let existing = groupedData.find( item => item.department == empleado.Departamento );
          if( existing ){
            existing.totalEmployees++;
            existing.totalSalary += empleado.Sueldo;
          }else{
            let obj = { department: empleado.Departamento, totalEmployees: 1, totalSalary: empleado.Sueldo };
            groupedData.push( obj );
          }
        } );
        console.log( 'groupedData ', groupedData );
        this.departmentStats = groupedData;
        this.statsJSON = JSON.stringify( groupedData );
        console.log( 'json string ', this.statsJSON );
    },

    filter(){
            //filter
            console.log( '===FILTER===' );
            // const nodes = document.querySelectorAll( ['input[name=filter]:checked'] );
             const nodes = document.querySelectorAll( ['input:checked'] );
            console.log( nodes );

            const checked = Array.from( nodes ).map( node => node.value );
            console.log('checked ',  checked );
            const filtered = this.departmentStats.filter( item => {
                console.log( checked.includes( item.department ) );
                return checked.includes( item.department );
            } );
            console.log( 'filtered ', filtered );
            this.filteredStats = filtered;
              console.log( 'filtered stats', this.filteredStats );

    },


     drawChart()
        { 
            this.filter();
            // order
            const sorted = this.filteredStats.sort( ( a, b ) =>
                b.totalSalary/b.totalEmployees - a.totalSalary/a.totalEmployees
             );
            console.log( 'sorted ', sorted );


            var ctx = document.getElementById('myChart');
            var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sorted.map(  item => {
                    return item.department + ' (' + item.totalEmployees + ')';
                } ),
                datasets: [{
                    label: '#average salary',
                    data: sorted.map(  item => item.totalSalary/item.totalEmployees ),
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
