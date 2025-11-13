import { Router } from "express";
import { getMaquinas, getMaquinaById, getMaquinaImagenes} from "../controllers/maquinasCtrl.js";

const router = Router();

router.get("/", getMaquinas);   
router.get("/:id/imagenes", getMaquinaImagenes);        // lista publicadas
router.get("/:id", getMaquinaById);  

// detalle
// varbinary → imagen

export default router;
