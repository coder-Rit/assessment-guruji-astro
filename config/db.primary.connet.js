import mongoose from"mongoose";

const primaryConnection = (uri, options = {}) => {
    // By default, Mongoose skips properties not defined in the schema (strictQuery). Adjust it based on your configuration.
    mongoose.set('strictQuery', true);
    

    // Connect to MongoDB
    mongoose.connect(uri, options)
        .then()
        .catch(err => console.error("MongoDB primary connection failed, " + err));

    // Event handling
    mongoose.connection.once('open', () => console.info("MongoDB primary connection opened!"));
    mongoose.connection.on('connected', () => console.info("MongoDB primary connection succeeded!"));
    mongoose.connection.on('error', (err) => {
        console.error("MongoDB primary connection failed, " + err);
        mongoose.disconnect(); 
    });
    mongoose.connection.on('disconnected', () => console.info("MongoDB primary connection disconnected!"));

    // Graceful exit
    process.on('SIGINT', () => {
        mongoose.connection.close().then(() => {
            console.info("Mongoose primary connection disconnected through app termination!");
            process.exit(0);
        });
    });
}
export default primaryConnection