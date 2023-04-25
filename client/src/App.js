import Home from "./components/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { BrowserRouter,Switch,Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import DashBoard from "./components/DashBoards/Dashboard";
import DashBoardSeller from "./components/DashBoards/DashBoardSeller";
import NewHotel from "./hotels/NewHotel";
import StripeCallback from "./stripe/StripeCallback";
import EditHotel from "./hotels/EditHotel";
import ViewHotel from "./hotels/ViewHotel";
import StripeSuccess from "./stripe/StripeSuccess";
import StripeCancel from "./stripe/StripeCancel";
import SearchResult from "./components/SearchResult";

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <ToastContainer autoClose={2000}/>
    <Switch>
      <Route path='/' exact>
        <Home />          
      </Route>
      <Route path='/login' exact>
        <Login />          
      </Route>
      <Route path='/register' exact>
        <Register />          
      </Route>
      <PrivateRoute path='/dashboard' exact>
        <DashBoard />          
      </PrivateRoute>
      <PrivateRoute path='/dashboard/seller' exact>
        <DashBoardSeller />          
      </PrivateRoute>
      <PrivateRoute path='/hotels/new' exact>
        <NewHotel />          
      </PrivateRoute>
      <PrivateRoute path='/stripe/callback' exact>
        <StripeCallback />          
      </PrivateRoute>
      <PrivateRoute path='/hotel/edit/:hotelId' exact component={EditHotel}/>
      <Route path='/hotel/:hotelId' exact component={ViewHotel}/>
      <PrivateRoute path='/stripe/success/:hotelId' exact component={StripeSuccess}/>
      <PrivateRoute path='/stripe/cancel' exact component={StripeCancel}/>
      <Route path='/search-query' exact component={SearchResult}/>
    </Switch>
    </BrowserRouter>

  );
}

export default App;
