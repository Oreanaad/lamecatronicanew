import { Router } from "express";
import { getMaquinas, getMaquinaById} from "../controllers/maquinasCtrl.js";

const router = Router();

router.get("/", getMaquinas);           // lista publicadas
router.get("/:id", getMaquinaById);     // detalle
// varbinary → imagen

export default router;
