import { createClient } from 'redis';


// const client = createClient({url: "rediss://red-cri49fd6l47c73dta9ig:Y6Lgc6NHb4UMkeoBfPwcPdK40WlMLTHW@singapore-redis.render.com:6379"})
//   .on('error', err => console.log('Redis Client Error', err))

const client = createClient({url: "rediss://red-cri49fd6l47c73dta9ig:Y6Lgc6NHb4UMkeoBfPwcPdK40WlMLTHW@singapore-redis.render.com:6379"})
  .on('error', err => console.log('Redis Client Error', err))

 

export default client;
