import express from "express";
import commentRouter from "./routes/commentRoutes.js";
import cors from "cors";

const app = express();
const PORT = 8001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}))

app.use("/api/v1/snippet", commentRouter);

app.post("/events", (req, res) => {
  return res.status(200).json({});
});

app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
});