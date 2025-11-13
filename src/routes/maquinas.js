import { Router } from "express";
import { getMaquinas, getMaquinaById, getMaquinaImagenes} from "../controllers/maquinasCtrl.js";

const router = Router();

router.get("/", getMaquinas);           // lista publicadas
router.get("/:id", getMaquinaById);  
router.get("/api/maquinas/:id/imagenes", getMaquinaImagenes);   // detalle
// varbinary → imagen

export default router;
