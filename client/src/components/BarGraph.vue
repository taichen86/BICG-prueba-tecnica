<template>
        <div>{{ test}}
        
        <canvas id="myChart" width="400" height="400"></canvas>
        </div>

</template>


<script>

import Chart from 'chart.js';

export default {

    name: 'BarGraph',
    props: {
        data: Array,
        test: String
    },

    created(){
        console.log( 'created'  );
    },

    mounted(){
        console.log( ' mounted' ) ;
    },

    updated(){
        console.log( 'graph 2 updated' );
    },

    methods: {

          drawChart(){           

          var ctx = document.getElementById( 'salaryChart' );
          var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: this.datas.map(  item => {
                  return item.department;
              } ),
              datasets: [               
                
                {
                  label: '#NUMBER OF EMPLOYEES',
                  data: this.data.map(  item => item.totalEmployees ),
                  backgroundColor: 
                  [ // fix this
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
        
       
    }
    
}
</script>


<style>

</style>
