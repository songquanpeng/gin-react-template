import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import App from './App';
import Header from './components/Header';
import Footer from './components/Footer';
// import { Provider } from 'react-redux';
import { store } from './helpers';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import { UserProvider } from './context/User';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Header />
        <Container className={'main-content'}>
          <App />
        </Container>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
