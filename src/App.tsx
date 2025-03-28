
import MainPage from './components/MainPage'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

function App() {


  return (
    <>
      <Provider store={store}>
        <div>
          <BrowserRouter>
            <MainPage />
          </BrowserRouter>
        </div>
      </Provider>
    </>
  )
}

export default App
