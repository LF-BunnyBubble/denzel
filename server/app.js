
const {MongoClient} = require('mongodb');
const imdb = require('./imdb');
const uri = "mongodb+srv://BunnyBubbles:Kelda2407@cluster0-fspch.mongodb.net/test?retryWrites=true&w=majority";
var client;


// Populate the database with all the Denzel's movies from IMDb.
module.exports.populate = async (actorID) => {

  let movies;
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


  try {      
      await client.connect();
      // fetches all movies with the given actor from IMDb
      movies = await imdb(actorID);
      // inserts all the found movies into the database
      await client.db("movies_imdb").collection("movie_review").insertMany(movies);
  } 
  catch (e) { 
            if (e.name === 'BulkWriteError')
            {
              return("(e.name) => BulkWriteError: Values already exist in the database !");
            }
            else
            {
              console.error(e);
            } 
  }
  finally {
      await client.close();
  }
  return { "Total number of movies found with the given actor " : movies.length}
}

//Fetch a random must-watch movie.
module.exports.fetch_RandomMustWatch = async () => {

  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });  
  let resultArray;

  try {      
      await client.connect();
      //A must-watch movie is a movie with a metascore higher than 70.
      var result = await client.db("movies_imdb").collection("movie_review").find({"metascore":{$gt:70}});
      resultArray = await result.toArray();
  } 
  catch (e) { 
        console.error(e);      
  }
  finally {
          await client.close();
  }
  return resultArray[Math.floor(Math.random() * (resultArray.length))]
}


// Fetch a specific movie, from its id
module.exports.fetch_MovieByID = async (id) => {

var result;
client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {      
      await client.connect();    
      result = await client.db("movies_imdb").collection("movie_review").findOne({"id":id});
  } 
  catch (e) { 
        console.error(e);      
  }
  finally {
          await client.close();
  }
  return result
}

// Fetch Denzel's movies with a given metascore and limit.
// Display by descending order of metascore
module.exports.Fetch_Movies_ByMetascore= async (metascore, limit) => {

  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
      await client.connect();

      // array of all movies above given metascore, assembled in desc order
      const movies = await client.db("movies_imdb").collection("movie_review").find({metascore:{ $gte: metascore }}).sort({ metascore: -1 }).toArray();

      // return a result that respects the limit of movies requested
      if(movies.length>=limit) 
      {
        result=[];
        for (let i = 0; i < limit; i++)
        {
           result[i]=movies[i];
        }
        return [movies.length, result]
      }
      else
      {
        return [movies.length, movies]
      }
  }
  catch (e) {
            console.error(e);
  } 
  finally {
          await client.close();
  }
}

module.exports.addreview = async (id,updates) => {

  var result;
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {      
      await client.connect();
      result = await client.db("movies_imdb").collection("movie_review").updateOne({"_id": id }, { $set: updates });
  } 
  catch (e) { 
            console.error(e);
  }
  finally {
      await client.close();
  }
  return {"_id" : id};
}
