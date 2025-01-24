import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>
);
