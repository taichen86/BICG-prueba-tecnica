<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
        <canvas id="myChart" width="400" height="400">chart here</canvas>

    <HelloWorld msg="Welcome to Your Vue.js App"/>




  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Chart from 'chart.js';

export default {
  name: 'app',
  props: {
    allData: [],
    listOfAllDepartments: []
      },
  components: {
    HelloWorld
  },

  created()
  {
    console.log( 'app created...' );
    this.parseJSON();
  },

  methods: {
      fetchJSON( url, init ) 
      {
        return fetch( url, init ).then( response =>
        {
            console.log( 'response ' , response );
            if( response.ok ){ return response.json(); }
            throw new Error( response.statusText );
        });
      },

    parseJSON()
    {
        console.log( 'parse json' );
        const url = "https://api.myjson.com/bins/1cjnd5";
        console.log( '=== get json from ===>' + url );
        this.fetchJSON( url , { method: 'GET' }).then( result => {
            //  console.log( 'result ' , JSON.stringify( result ) );
              this.allData = result;
              console.log( "all data: ", this.allData );
     
            this.createListOfAllDepartments();
            this.drawChart();

          });

    },

    createListOfAllDepartments() // TODO: optimise!!!
    {
        console.log( 'create list of all departments...' );
        let allDeparts = [];
        this.allData.forEach( empleado => {

          var duplicate = allDeparts.find( depart => depart.department == empleado.Departamento );
          // console.log( "duplicate: " , duplicate );
          if( duplicate != undefined ){
            duplicate.TotalEmployees++;
            duplicate.totalSalary += empleado.Sueldo;
          }else{
            var obj = {};
            obj.department = empleado.Departamento;
            obj.TotalEmployees = 1;
            obj.totalSalary = empleado.Sueldo;
            // console.log( obj );
  
            allDeparts.push( obj );
          }
        });
        console.log( allDeparts );
        this.listOfAllDepartments = allDeparts;

    },

  drawChart()
  { 

    // order list here
    let deparmentNames = [];
    let avgSalary = [];
    this.listOfAllDepartments.forEach( department => {
      deparmentNames.push( department.department );
      avgSalary.push( department.totalSalary/department.TotalEmployees );
    })



    console.log( deparmentNames );
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: deparmentNames,
        datasets: [{
            label: '# of Votes',
            data: avgSalary,
            backgroundColor: [
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
        }]
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
