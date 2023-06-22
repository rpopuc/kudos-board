import { addAliases } from "module-alias";

addAliases({
  "@": __dirname + '/src',
});

import app from "./src/infra/adapters/Express/app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
