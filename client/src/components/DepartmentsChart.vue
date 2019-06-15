<template>
        <div>CHART TO GO HERE
        
        <canvas id="myChart" width="400" height="400">chart here</canvas>
        </div>

</template>


<script>

import Chart from 'chart.js';

export default {

    name: 'DepartmentsChart',
    props: {
        json: String
    },

    created(){
        console.log( 'created' , json );
    },

    mounted(){
        console.log( 'departmentschart mounted' ) ;
    },

    methods: {
        
        drawChart()
        { 
            // TODO: order list here
            let deparmentNames = [];
            let avgSalary = [];
            this.stats.forEach( department => {
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

</style>
