import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import App from './App';
import { WebSocketProvider } from './context/WebSocketProvider';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <RecoilRoot>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>
);
