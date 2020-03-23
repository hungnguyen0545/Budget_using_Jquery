import low from './node_modules/lowdb'
import FileSync from './node_modules/lowdb/adapters/FileSync.js'

 const adapter = new FileSync('db.json')
 const db = low(adapter)


 db.defaults({ 
     "author" : {
         "name" : "Nguyen Sy Canh Hung",
         "age" : 21,
     },
     "income_list" : [],
     "expense_list" : []
  })
 .write()
