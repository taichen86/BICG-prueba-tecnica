<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>


    


  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  props: {
    allData: [],
    listOfAllDepartments: [],
    departmentStats: []
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

          });

    },

    createListOfAllDepartments() // TODO: optimise!!!
    {
        console.log( 'create list of all departments...' );
        let allDeparts = [];
        this.allData.forEach( empleado => {

          var duplicate = allDeparts.find( depart => depart.department == empleado.Departamento );
          console.log( "duplicate: " , duplicate );
          if( duplicate != undefined ){
            duplicate.TotalEmployees++;
            duplicate.totalSalary += empleado.Sueldo;
          }else{
            var obj = {};
            obj.department = empleado.Departamento;
            obj.TotalEmployees = 1;
            obj.totalSalary = empleado.Sueldo;
            console.log( obj );
            // allDeparts.push( item.Departamento );
            allDeparts.push( obj );
          }
        });
        console.log( allDeparts );
        this.listOfAllDepartments = allDeparts;

    },

 
 
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
