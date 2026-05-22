import express from "express";
import axios from "axios";
import cors from "cors"

const app = express();

app.use(express.json());
const PORT = 8005;

app.use(cors({
    origin: "http://localhost:5173"
}))

app.post("/events", async (req, res) => {
    const events = req.body;
    await axios.post("http://localhost:8000/events", events)
    await axios.post("http://localhost:8001/events", events)
    await axios.post("http://localhost:8002/events", events)

    return res.status(200).json({});
})

app.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
});