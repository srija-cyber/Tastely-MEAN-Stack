const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const blogRoutes = require("./routes/blogs");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", require("./routes/auth"));
app.use("/recipes", require("./routes/recipes"));
app.use('/api/users', require('./routes/users'));
app.use("/blogs", blogRoutes);

const envPort = process.env.PORT;
const PORT = envPort && envPort !== '5000' ? envPort : 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
