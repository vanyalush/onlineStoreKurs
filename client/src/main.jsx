import {createContext, StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserStore from "./store/UserStore.js";
import ThingStore from "./store/ThingStore.js";
import BasketStore from "./store/BasketStore.js";


export const Context = createContext(null);
console.log(import.meta.env.VITE_APP_URL);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          thing: new ThingStore(),
          basket: new BasketStore(),
      }}>
          <App />
      </Context.Provider>
  </StrictMode>,
)
