import express from "express";
import snippetRouter from "./routes/snippetRoutes.js"
import cors from "cors"

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}))

app.use("/api/v1/snippet", snippetRouter);

app.post("/events", (req, res) => {
  return res.status(200).json({});
});

app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
});