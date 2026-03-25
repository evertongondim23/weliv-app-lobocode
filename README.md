
  # Mobile Health App Development

  This is a code bundle for Mobile Health App Development. The original project is available at https://www.figma.com/design/zpzLBW5x7YeGQyFnc4pWVP/Mobile-Health-App-Development.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Mobile preview

  - **Cursor / VS Code — Mobile Preview (Phone & Tablet Simulator):** extensão `lirobi.phone-preview` (recomendada neste projeto via `.vscode/extensions.json`). Com o dev server a correr (`npm run dev` ou `npm run dev:mobile`), abra a **Paleta de comandos** (`Cmd+Shift+P` / `Ctrl+Shift+P`) e procure **Mobile Preview** ou **Phone Preview** para abrir o painel; escolha um dispositivo (iPhone, Android, iPad). A extensão costuma detetar o URL do Vite (ex.: `http://localhost:5173`) — confirme se bate com o porto que o terminal mostra.
  - **Browser:** use o modo dispositivo das DevTools (Chrome/Edge: `Cmd+Shift+M` no macOS, `Ctrl+Shift+M` no Windows/Linux).
  - **Telemóvel real (mesma Wi‑Fi):** `npm run dev:mobile`. No telemóvel abra o URL **Network** que o Vite imprime (ex.: `http://192.168.x.x:5173`). Liberte a porta do Vite na firewall se for preciso (por defeito `5173`).
  